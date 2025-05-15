import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import confetti from 'canvas-confetti';
import { Modal, Button } from 'react-bootstrap';

export default function CountryFlagGame() {
    const [countries, setCountries] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [options, setOptions] = useState([]);
    const [correctCountry, setCorrectCountry] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [totalTimeLeft, setTotalTimeLeft] = useState(40);
    const [gameStarted, setGameStarted] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const timerRef = useRef(null);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(
                    c => c.name?.common?.toLowerCase() !== 'israel' &&
                        c.name && c.flags && (c.flags.png || c.flags.svg)
                );
                setCountries(filtered);
            });
    }, []);

    useEffect(() => {
        clearInterval(timerRef.current);
        if (gameStarted && !gameOver) {
            timerRef.current = setInterval(() => {
                setTotalTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [gameStarted, gameOver]);

    useEffect(() => {
        if (countries.length && currentQuestion < 10 && gameStarted && !gameOver) {
            generateQuestion();
        } else if (currentQuestion >= 10 && gameStarted) {
            clearInterval(timerRef.current);
            setGameOver(true);
        }
    }, [countries, currentQuestion, gameStarted, gameOver]);

    useEffect(() => {
        if (gameOver && score === 10) {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 },
            });
        }
    }, [gameOver, score]);

    const generateQuestion = () => {
        const correct = countries[Math.floor(Math.random() * countries.length)];
        const optionsSet = new Set([correct]);

        while (optionsSet.size < 4) {
            const randomCountry = countries[Math.floor(Math.random() * countries.length)];
            optionsSet.add(randomCountry);
        }

        const shuffledOptions = Array.from(optionsSet).sort(() => 0.5 - Math.random());
        setCorrectCountry(correct);
        setOptions(shuffledOptions);
    };

    const handleAnswer = (country) => {
        if (country.name.common === correctCountry.name.common) {
            setScore(prev => prev + 1);
        }
        setCurrentQuestion(prev => prev + 1);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const resetGame = () => {
        clearInterval(timerRef.current);
        setScore(0);
        setCurrentQuestion(0);
        setGameOver(false);
        setTotalTimeLeft(40);
        setGameStarted(false);
        setShowModal(true);
    };

    const startNewGame = () => {
        setScore(0);
        setCurrentQuestion(0);
        setGameOver(false);
        setTotalTimeLeft(40);
        setGameStarted(true);
        setShowModal(false);
    };

    return (
        <>
            {/* <Navbar /> */}

            {/* Instruction Modal */}
            <Modal show={showModal} backdrop="static" centered>
                <Modal.Header>
                    <Modal.Title>Welcome to the Flag Quiz!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        <li>You have 40 seconds to answer 10 questions.</li>
                        <li>Each question asks you to identify a flag of a country.</li>
                        <li>1 point per correct answer. Score all to trigger confetti!</li>
                    </ul>
                    <strong>Good luck!</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={startNewGame}>
                        Start Game
                    </Button>
                </Modal.Footer>
            </Modal>

            {(!countries.length || !correctCountry) && !gameOver ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status" />
                    <span className="ms-2">Loading countries...</span>
                </div>
            ) : gameOver ? (
                <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
                    <h1 className="display-4 text-primary mb-3">🎉 Game Over!</h1>
                    <p className="lead">You scored <strong>{score}</strong> out of 10</p>
                    {score === 10 && (
                        <p className="fw-bold text-success fs-4">🏆 Perfect Score! Well done!</p>
                    )}
                    <button className="btn btn-primary mt-3" onClick={resetGame}>
                        🔄 Play Again
                    </button>
                </div>
            ) : (
                <div className="container py-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-2">Flag Quiz</h2>
                        <p className="text-muted">Question {currentQuestion + 1} of 10</p>
                        <div className="progress mb-2" style={{ height: '10px' }}>
                            <div
                                className="progress-bar bg-primary"
                                style={{ width: `${(currentQuestion / 10) * 100}%` }}
                            />
                        </div>
                        <div className="mb-3 text-center">
                            <span className="fw-bold fs-4" style={{ color: totalTimeLeft <= 10 ? 'red' : '#0d6efd' }}>
                                Time Left: {formatTime(totalTimeLeft)}
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <h4>
                            Which is the flag of <span className="text-primary">{correctCountry?.name.common}</span>?
                        </h4>
                    </div>

                    <div className="row g-4">
                        {options.map((country, index) => (
                            <div className="col-6 col-md-3" key={index}>
                                <button
                                    className="btn w-100 p-0 border rounded shadow-sm overflow-hidden btn-outline-secondary"
                                    onClick={() => handleAnswer(country)}
                                >
                                    <img
                                        src={country.flags?.svg || country.flags?.png}
                                        alt={`Flag of ${country.name.common}`}
                                        className="img-fluid"
                                        style={{
                                            height: '150px',
                                            objectFit: 'contain',
                                            width: '100%',
                                            backgroundColor: '#fff',
                                            padding: '10px'
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150x100?text=No+Flag';
                                        }}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
