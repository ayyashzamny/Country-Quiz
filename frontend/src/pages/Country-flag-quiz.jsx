import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import confetti from 'canvas-confetti';

export default function CountryFlagGame() {
    const [countries, setCountries] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [options, setOptions] = useState([]);
    const [correctCountry, setCorrectCountry] = useState(null);
    const [gameOver, setGameOver] = useState(false);

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
        if (countries.length && currentQuestion < 10) {
            generateQuestion();
        } else if (currentQuestion >= 10) {
            setGameOver(true);
        }
    }, [countries, currentQuestion]);

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

    if (!countries.length) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status" />
                <span className="ms-2">Loading countries...</span>
            </div>
        );
    }

    if (gameOver) {
        return (
            <>
                <Navbar />
                <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
                    <h1 className="display-4 text-primary mb-3">🎉 Game Over!</h1>
                    <p className="lead">
                        You scored <strong>{score}</strong> out of 10
                    </p>
                    {score === 10 && (
                        <p className="fw-bold text-success fs-4">🏆 Perfect Score! Well done!</p>
                    )}
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                            setScore(0);
                            setCurrentQuestion(0);
                            setGameOver(false);
                        }}
                    >
                        🔄 Play Again
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">Flag Quiz</h2>
                    <p className="text-muted">Question {currentQuestion + 1} of 10</p>
                    <div className="progress" style={{ height: '10px' }}>
                        <div
                            className="progress-bar bg-primary"
                            style={{ width: `${(currentQuestion / 10) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="text-center mb-4">
                    <h4>
                        Which is the flag of <span className="text-primary">{correctCountry?.name.common}</span>?
                    </h4>
                </div>

                <div className="row g-4">
                    {options.map((country, idx) => (
                        <div className="col-6 col-md-3" key={idx}>
                            <button
                                className="btn btn-outline-secondary w-100 p-0 border rounded shadow-sm overflow-hidden"
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
        </>
    );
}
