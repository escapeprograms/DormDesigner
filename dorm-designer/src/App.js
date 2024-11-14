import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BuildingSelection from './Components/BuildingSelectionPage/BuildingSelection';
import BakerFloorPlan from './Components/FloorPlans/Baker/BakerFloorPlan';
import CashinFloorPlan from './Components/FloorPlans/Cashin/CashinFloorPlan';
import CrabtreeFloorPlan from './Components/FloorPlans/Crabtree/CrabtreeFloorPlan';
import CramptonFloorPlan from './Components/FloorPlans/Crampton/CramptonFloorPlan';
import DwightFloorPlan from './Components/FloorPlans/Dwight/DwightFloorPlan';
import FieldFloorPlan from './Components/FloorPlans/Field/FieldFloorPlan';
import GraysonFloorPlan from './Components/FloorPlans/Grayson/GraysonFloorPlan';
import GreenoFloorPlan from './Components/FloorPlans/Greeno/GreenoFloorPlan';
import HamlinFloorPlan from './Components/FloorPlans/Hamlin/HamlinFloorPlan';
import JQAFloorPlan from './Components/FloorPlans/JQA/JQAFloorPlan';
import McNamaraFloorPlan from './Components/FloorPlans/McNamara/McNamaraFloorPlan';
import VanMeterFloorPlan from './Components/FloorPlans/VanMeter/VanMeterFloorPlan';


import ResidentialAreaSelection from './Components/ResidentialAreaSelectionPage/ResidentialAreaSelection';

import Dashboard from './Components/Dashboard/Dashboard';
import Editor from './Components/Editor/Editor';
import LoginPage from './Components/LoginPage/LoginPage';

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
        <Route path="/residential-area" element={<ResidentialAreaSelection />} />
        <Route path="/building-selection" element={<BuildingSelection />} />
        <Route path="/BakerFloorPlan" element={<BakerFloorPlan />} />
        <Route path="/GraysonFloorPlan" element={<GraysonFloorPlan />} />
        <Route path="/FieldFloorPlan" element={<FieldFloorPlan />} />
        <Route path="/VanMeterFloorPlan" element={<VanMeterFloorPlan />} />
        <Route path="/GreenoFloorPlan" element={<GreenoFloorPlan />} />
        <Route path="/CashinfloorPlan" element={<CashinFloorPlan />} />
        <Route path="/McNamaraFloorPlan" element={<McNamaraFloorPlan />} />
        <Route path="/CrabtreeFloorPlan" element={<CrabtreeFloorPlan />} />
        <Route path="/DwightFloorPlan" element={<DwightFloorPlan />} />
        <Route path="/HamlinFloorPlan" element={<HamlinFloorPlan />} />
        <Route path="/JQAFloorPlan" element={<JQAFloorPlan />} />
        <Route path="/CramptonFloorPlan" element={<CramptonFloorPlan />} />
        <Route exact path ="/" element = {<LoginPage/>}></Route>
        <Route exact path = "/dashboard" element = {<Dashboard/>}></Route>
        <Route exact path = "/editor" element = {<Editor/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;

