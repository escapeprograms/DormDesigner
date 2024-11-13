import './App.css';

import Editor from './Components/Editor/Editor';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './Components/LoginPage/LoginPage';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

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
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;

