import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CountryModal = ({ show, country, onClose }) => {
    if (!show || !country) return null;

    const {
        name,
        flags,
        capital,
        region,
        subregion,
        population,
        area,
        languages,
        currencies,
        timezones,
        borders,
        maps,
    } = country;

    return (
        <AnimatePresence>
            {show && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <motion.div
                        className="modal-dialog modal-xl modal-dialog-centered"
                        role="document"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="modal-content shadow-lg bg-light dark:bg-dark text-dark dark:text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">{name?.common} - More Details</h5>
                                <button type="button" className="btn-close" onClick={onClose}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <img
                                            src={flags?.png}
                                            alt={name?.common}
                                            className="img-fluid rounded border"
                                        />
                                        <ul className="list-group list-group-flush mt-3">
                                            <li className="list-group-item">
                                                <strong>Capital:</strong> {capital?.[0] || "N/A"}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Region:</strong> {region} ({subregion})
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Population:</strong> {population.toLocaleString()}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Area:</strong> {area?.toLocaleString()} km²
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Languages:</strong> {languages ? Object.values(languages).join(", ") : "N/A"}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Currencies:</strong> {currencies ? Object.values(currencies).map(cur => cur.name).join(", ") : "N/A"}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Timezones:</strong> {timezones?.join(", ")}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Borders:</strong> {borders ? borders.join(", ") : "None"}
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="col-md-6">
                                        <h6>Map View:</h6>
                                        {country.latlng ? (
                                            <iframe
                                                title="map"
                                                width="100%"
                                                height="400"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                src={`https://www.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}&hl=es&z=6&output=embed`}
                                            />
                                        ) : (
                                            <p>No map available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CountryModal;
