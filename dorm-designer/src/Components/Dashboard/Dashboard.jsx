import React, { useState } from 'react';
import './Dashboard.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { createDesign } from '../../services/designServices.js';

const Dashboard = () => {

  const navigate = useNavigate();
  const { signOut } = useClerk();


  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // const handleNewDesign = async () => {
  //   try {
  //     const newDesign = {
  //       vertices: [[1, 2], [3, 4], [5, 6]], 
  //       UserId: userId,
  //       furnitureIds: [], 
  //     };
  //     await createDesign(newDesign); 
  //     navigate('/residential-area'); 
  //   } catch (error) {
  //     console.error('Error creating new design:', error);
  //   }
  // };

  return (
    <div>
      <nav className="navbar">
        <h1>Your Designs</h1>
        <div className="buttons">
          <div className="button" /*onClick={handleNewDesign}*/>New Design</div>
          <div className="button">Help</div>
          <div className="button" onClick={handleSignOut}>Sign Out</div>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
