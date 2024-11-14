import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import central from '../Assets/central.jpg';
import northeast from '../Assets/northeast.jpg';
import ohill from '../Assets/ohill.jpg';
import southwest from '../Assets/southwest.jpg';
import sylvan from '../Assets/sylvan.jpg';
import './ResidentialAreaSelection.css';

const areas = [
    { name: 'Northeast', image: northeast },
    { name: 'Southwest', image:  southwest },
    { name: 'Central', image: central },
    { name: 'OrchardHill', image: ohill },
    { name: 'Sylvan', image: sylvan },
];

const ResidentialAreaSelection = () => {
    const navigate = useNavigate();
    const {userId} = useParams();

    const handleAreaSelect = (areaName) => {
        navigate(`/building-selection/${userId}`, { state: { area: areaName } });
    };

    return (
        <div className="area-selection-container">
            <h2>Select a Residential Area</h2>
            <div className="area-cards">
                {areas.map((area) => (
                    <div
                        key={area.name}
                        className="area-card"
                        onClick={() => handleAreaSelect(area.name)}
                    >
                        <img src={area.image} alt={area.name} className="area-image" />
                        <div className="area-name">{area.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResidentialAreaSelection;
