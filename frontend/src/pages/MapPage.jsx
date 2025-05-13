import React, { useEffect, useState } from "react";
import axios from "axios";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { feature } from "topojson-client";
import Navbar from "../components/Navbar";
import "../styles/MapPage.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MapPage = () => {
    const [countries, setCountries] = useState([]);
    const [geographies, setGeographies] = useState([]);
    const [hoveredCountry, setHoveredCountry] = useState(null);

    useEffect(() => {
        // Load countries from REST API
        axios.get("https://restcountries.com/v3.1/all")
            .then(res => setCountries(res.data))
            .catch(err => console.error("Error fetching countries", err));

        // Load Geo data
        axios.get(geoUrl)
            .then(res => {
                const geoFeatures = feature(res.data, res.data.objects.countries).features;
                setGeographies(geoFeatures);
            })
            .catch(err => console.error("Error loading map data", err));
    }, []);

    const colorScale = scaleLinear()
        .domain([0, 1400000000])
        .range(["#e0f7fa", "#006064"]);

    const getCountryFromGeo = (geo) => {
        return countries.find(c => c.cca3 === geo.id || c.cca2 === geo.properties.ISO_A2);
    };

    return (
        <div className="container-fluid">
            <Navbar />

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 mb-4">
                    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 150 }}>
                        <ZoomableGroup>
                            <Geographies geography={geographies}>
                                {({ geographies }) =>
                                    geographies.map(geo => {
                                        const country = getCountryFromGeo(geo);
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={country ? colorScale(country.population || 0) : "#EEE"}
                                                stroke="#FFF"
                                                onMouseEnter={() => setHoveredCountry(country)}
                                                onMouseLeave={() => setHoveredCountry(null)}
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { fill: "#FFB74D", cursor: "pointer" },
                                                    pressed: { fill: "#FF7043" }
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                </div>

                {hoveredCountry && (
                    <div className="col-12 col-md-4">
                        <div className="card shadow">
                            <img
                                src={hoveredCountry.flags?.png}
                                alt={hoveredCountry.name?.common}
                                className="card-img-top"
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{hoveredCountry.name?.common}</h5>
                                <ul className="list-unstyled">
                                    <li><strong>Population:</strong> {hoveredCountry.population?.toLocaleString()}</li>
                                    <li><strong>Region:</strong> {hoveredCountry.region}</li>
                                    <li><strong>Capital:</strong> {hoveredCountry.capital?.[0] || "N/A"}</li>
                                    <li><strong>Languages:</strong> {hoveredCountry.languages ? Object.values(hoveredCountry.languages).join(", ") : "N/A"}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;
