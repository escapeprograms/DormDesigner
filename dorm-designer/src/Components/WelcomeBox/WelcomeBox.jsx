import React from 'react';
import './WelcomeBox.css'; 
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const WelcomeBox = () => {
  return (
    <div className="WelcomeBox">
      <h1 className="welcome-text">Welcome</h1>
      <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
    </div>
  );
};

export default WelcomeBox;
