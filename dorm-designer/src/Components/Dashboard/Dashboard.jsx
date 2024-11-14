import React, {useState} from 'react'
import './Dashboard.css'
import { Link } from 'react-router-dom'

const Dashboard = () => {

  const [designs, setDesigns] = useState([]);

  const addDesign = () => {
    setDesigns([...designs, <div key = {designs.length} className = "design">New Design{designs.length+1}</div>]);
  };

  return (
    <div>
      <nav className = "navbar">
        <h1>Your Designs</h1>
        <div className = "buttons">
          <div className = "button" onClick ={addDesign}><Link to = "/residential-area">New Design</Link></div>
          <div className = "button">Delete Design</div>
          <div className = "button">Help</div>
          <div className = "button"><Link to = "/">Sign Out</Link></div>
        </div>
      </nav>
      <div className = "designContainer">
        {designs}
      </div>
    </div>
  )
}

export default Dashboard