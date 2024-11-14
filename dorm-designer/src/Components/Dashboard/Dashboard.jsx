import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { getDesignByUserId, createDesign } from '../../services/designServices.js';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { userId } = useParams(); 

  // fetching user's designs 
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const data = await getDesignByUserId(userId);
        if (!data || data.length === 0) {
          // Do nothing if no data is returned or data is empty
          return;
        }
        setDesigns(data);
      } catch (error) {
        console.error('Error fetching designs:', error);
        // Optionally handle the error, e.g., set an error state or log
      }
    };

    if (userId) {
      fetchDesigns();
    }
  }, [userId]);

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
      const newDesign = {
        vertices: [[1, 2], [3, 4], [5, 6]], 
        UserId: userId,
        furnitureIds: [], 
      };
      await createDesign(newDesign); 
      navigate('/residential-area'); 
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
        {designs.length === 0 ? (
          <p>No designs yet. Click "New Design" to create your first one!</p>
        ) : (
          <ul className="design-list">
            {designs.map((design) => (
              <li key={design.id} className="design-item">
                <Link to={`/design/${design.id}`} className="design-link">
                  {design.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Dashboard;