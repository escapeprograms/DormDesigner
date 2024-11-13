import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BuildingSelection from './Components/BuildingSelectionPage/BuildingSelection';
import BakerFloorPlan from './Components/FloorPlans/Baker/BakerFloorPlan';
import ResidentialAreaSelection from './Components/ResidentialAreaSelectionPage/ResidentialAreaSelection';

import Editor from './Components/Editor/Editor';
import LoginPage from './Components/LoginPage/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/residential-area" element={<ResidentialAreaSelection />} />
        <Route path="/building-selection" element={<BuildingSelection />} />
        <Route path="/BakerFloorPlan" element={<BakerFloorPlan />} />
        <Route exact path ="/" element = {<LoginPage/>}></Route>
        <Route exact path = "/editor" element = {<Editor/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
