import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();
  const { signOut } = useClerk();

  // fetching user's designs 
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await fetch('/api/user-designs');
        const data = await response.json();
        setDesigns(data);
      } catch (error) {
        console.error('Error fetching designs:', error);
      }
    };

    fetchDesigns();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Your Designs</h1>
        <div className="buttons">
          <div className="button"><Link to="/editor">New Design</Link></div>
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