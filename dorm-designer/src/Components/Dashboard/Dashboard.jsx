import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { getDesignsByUserId, createDesign } from '../../services/designServices.js';

const Dashboard = () => {
  return (
    <div>
      <nav className="navbar">
        <h1>Your Designs</h1>
        <div className = "buttons">
          <div className = "button"><Link to = "/editor">New Design</Link></div>
          <div className = "button">Help</div>
          <div className = "button"><Link to = "/">Sign Out</Link></div>
        </div>
      </nav>
    </div>
  );
};


export default Dashboard;
