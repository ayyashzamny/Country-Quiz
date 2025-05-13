import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CountryModal from "../components/CountryModal";
import { FaArrowUp } from "react-icons/fa";
import "animate.css";

const CountryExplorer = () => {
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [regionFilter, setRegionFilter] = useState("All");
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchCountries();
    }, [regionFilter]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const fetchCountries = async () => {
        setLoading(true);
        let url = "https://restcountries.com/v3.1/all";
        if (regionFilter !== "All") {
            url = `https://restcountries.com/v3.1/region/${regionFilter.toLowerCase()}`;
        }
        try {
            const res = await axios.get(url);
            setCountries(res.data);
        } catch (err) {
            console.error("Error fetching countries", err);
        } finally {
            setLoading(false);
        }
    };

    const searchCountries = async (name) => {
        setLoading(true);
        try {
            const res = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
            setCountries(res.data);
        } catch (err) {
            console.error("Error searching country", err);
            setCountries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            searchCountries(value);
        } else {
            fetchCountries();
        }
    };

    return (
        <div className={`${darkMode ? "bg-dark text-light" : "bg-light text-dark"} min-vh-100`}>
            <Navbar />

            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">World Flags Explorer</h2>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="darkModeSwitch"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <label className="form-check-label ms-2" htmlFor="darkModeSwitch">
                            {darkMode ? "Dark Mode" : "Light Mode"}
                        </label>
                    </div>
                </div>

                <div className="row justify-content-center mb-4">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg shadow-sm"
                            placeholder="Search countries..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <select
                            className="form-select form-select-lg shadow-sm"
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                        >
                            <option value="All">All Regions</option>
                            <option value="Africa">Africa</option>
                            <option value="Americas">Americas</option>
                            <option value="Asia">Asia</option>
                            <option value="Europe">Europe</option>
                            <option value="Oceania">Oceania</option>
                        </select>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                )}

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {countries.map((country) => (
                        <div className="col" key={country.cca3}>
                            <div className="card h-100 shadow border-0">
                                <img
                                    src={country.flags?.png}
                                    alt={country.name?.common}
                                    loading="lazy"
                                    className="card-img-top rounded-top"
                                    style={{
                                        height: "180px",
                                        objectFit: "cover",
                                        borderBottom: "5px solid #f1f1f1"
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-semibold mb-2">
                                        {country.name?.common}
                                    </h5>
                                    <ul className="list-unstyled small text-muted mb-2">
                                        <li><strong>Population:</strong> {country.population?.toLocaleString()}</li>
                                        <li><strong>Region:</strong> {country.region}</li>
                                        <li><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</li>
                                        <li><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(", ") : "N/A"}</li>
                                    </ul>
                                    <button
                                        className="btn btn-outline-primary btn-sm mt-2"
                                        onClick={() => setSelectedCountry(country)}
                                    >
                                        View More Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CountryModal
                show={!!selectedCountry}
                country={selectedCountry}
                onClose={() => setSelectedCountry(null)}
            />

            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="btn btn-primary position-fixed"
                    style={{
                        bottom: "20px",
                        right: "20px",
                        borderRadius: "50%",
                        padding: "10px 12px",
                        zIndex: 9999,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
                    }}
                    aria-label="Scroll to top"
                >
                    <FaArrowUp size={20} />
                </button>
            )}
        </div>
    );
};

export default CountryExplorer;