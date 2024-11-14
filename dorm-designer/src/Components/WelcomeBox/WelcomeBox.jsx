import React , {useEffect} from 'react';
import './WelcomeBox.css'; 
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom'; 

const WelcomeBox = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      navigate(`/dashboard/${user.id}`);
    }
  }, [isSignedIn, user, navigate]);


  return (
    <div className="WelcomeBox">
      <h1 className="welcome-text">Welcome</h1>
        <SignedOut className="signed-out">
          <SignInButton className="sign-in-button" />
        </SignedOut>
        <SignedIn className="signed-in">
          <UserButton className="user-button" />
        </SignedIn>
    </div>
  );
};


export default WelcomeBox;
