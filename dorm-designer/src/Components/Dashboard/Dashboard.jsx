import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { getDesignsByUserId, createDesign } from '../../services/designServices.js';

const Dashboard = () => {

  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [error, setError] = useState(null);
  const { userId} = useParams();
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const data = await getDesignsByUserId(userId);
        if (Array.isArray(data)) {
          setDesigns(data);
        } else {
          setDesigns([]); 
        }
      } catch (error) {
        console.error('Error fetching designs:', error);
        setError('Failed to load designs.'); 
      }
    };

    if (userId) {
      fetchDesigns();
    }
  }, [userId]); // fetching designs associated with userId


  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNewDesign = async () => {
    try {
      navigate(`/residential-area/${userId}`);
    } catch (error) {
      console.error('Error creating new design:', error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Your Designs</h1>
        <div className="buttons">
          <div className="button" onClick={handleNewDesign}>New Design</div>
          <div className="button">Help</div>
          <div className="button" onClick={handleSignOut}>Sign Out</div>
        </div>
      </nav>
      <main className="designs-container">
        {error ? (
          <p>{error}</p> // Display error message if any error occurs
        ) : designs.length > 0 ? (
          <ul className="design-list">
            {designs.map((design) => (
              <li key={design._id} className="design-item">
                <Link to={`/editor/${userId}/${design._id}`} className="design-link">
                  {/*original code: {design._id} 
                      to change to when database is changed to include name: {design.name}
                  */}
                  Untitled Design 1
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No designs yet. Click "New Design" to create your first one!</p>
        )}
      </main>
    </div>
  );
};


export default Dashboard;
