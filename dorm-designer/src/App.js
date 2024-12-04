import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BuildingSelection from './Components/BuildingSelectionPage/BuildingSelection.js';
import BakerFloorPlan from './Components/FloorPlans/Baker/BakerFloorPlan.js';
import ResidentialAreaSelection from './Components/ResidentialAreaSelectionPage/ResidentialAreaSelection.js';


import Editor from './Components/Editor/Editor.js';
import LoginPage from './Components/LoginPage/LoginPage.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';


function App() {
  return (
    <Router>
      {/* <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header> */}
      <Routes>
        <Route path="/residential-area/:userId" element={<ResidentialAreaSelection />} />
        <Route path="/building-selection/:userId" element={<BuildingSelection />} />
        <Route path="/BakerFloorPlan/:userId" element={<BakerFloorPlan />} />
        <Route exact path ="/" element = {<LoginPage/>}></Route>
        <Route exact path = "/dashboard/:userId" element = {<Dashboard/>}></Route>
        <Route exact path = "/editor/:userId/:designId" element = {<Editor/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;

