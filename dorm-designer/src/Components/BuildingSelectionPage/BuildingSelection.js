import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './BuildingSelection.css';

const BuildingSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();

  // Retrieve the selected area name from the state
  const selectedArea = location.state?.area || 'Unknown Area';

  // Sample data for buildings by area
  const buildingsByArea = {
    Northeast: ['MaryLyon', 'Johnson', 'CrabTree'],
    Southwest: ['JQA', 'Crampton', 'PierPont'],
    Central: ['Baker', 'Greeno', 'Van Meter'],
    OrchardHill: ['Field', 'Grayson'],
    Sylvan: ['Cashin', 'McNamara']
  };

  const buildings = buildingsByArea[selectedArea] || [];

  // Buildings that are not 'coming soon'
  const availableBuildings = ['Baker', 'Field', 'Grayson', 'Van Meter'];

  const handleBuildingSelect = (building) => {
    console.log(`Selected building: ${building}`);
    navigate(`/${building + "FloorPlan"}/${userId}`);
  };

  return (
    <div className="container">
      <h2>Select a Building in {selectedArea}</h2>
      <div className="building-list">
        {buildings.length > 0 ? (
          buildings.map((building, index) => (
            <div
              key={index}
              onClick={() => {
                if (availableBuildings.includes(building)) {
                  handleBuildingSelect(building);
                }
              }}
              className={`building-card ${
                !availableBuildings.includes(building) ? 'coming-soon' : ''
              }`}
            >
              {building}
              {!availableBuildings.includes(building) && (
                <div className="overlay">
                  <span>Coming Soon</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No buildings available for this area.</p>
        )}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(`/residential-area/${userId}`)}
        className="back-button"
      >
        Back to Residential Area Selection
      </button>
    </div>
  );
};

export default BuildingSelection;
