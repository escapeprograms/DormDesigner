import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BuildingSelection.css';

    const BuildingSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve the selected area name from the state
    const selectedArea = location.state?.area || 'Unknown Area';

    // Sample data for buildings by area
    const buildingsByArea = {
        Northeast: ['Crabtree', 'Dwight', 'Hamlin'],
        Southwest: ['JQA', 'Crampton'],
        Central: ['Baker', 'Greeno', 'VanMeter'],
        OrchardHill: ['Field', 'Grayson'],
        Sylvan: ['Cashin', 'McNamara']
    };

    const buildings = buildingsByArea[selectedArea] || [];

    const handleBuildingSelect = (building) => {
        console.log(`Selected building: ${building}`);
        // Additional navigation or actions can be added here
        navigate(`/${building+"FloorPlan"}`)
        
    };

    return (
        <div className="container">
        <h2 style={{color: 'black'}}>Select a Building in {selectedArea}</h2>
        <div>
            {buildings.length > 0 ? (
            buildings.map((building, index) => (
                <div
                key={index}
                onClick={() => handleBuildingSelect(building)}
                className="building-card"
                >
                {building}
                </div>
            ))
            ) : (
            <p>No buildings available for this area.</p>
            )}
        </div>

        {/* Back button */}
        <button onClick={() => navigate('/residential-area')} className="back-button">
            Back to Residential Area Selection
        </button>
        </div>
    );
    };

    export default BuildingSelection;
