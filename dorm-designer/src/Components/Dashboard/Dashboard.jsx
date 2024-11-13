import React from 'react'
import './Dashboard.css'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      <nav className = "navbar">
        <h1>Your Designs</h1>
        <div className = "buttons">
          <div className = "button"><Link to = "/editor">New Design</Link></div>
          <div className = "button">Help</div>
          <div className = "button"><Link to = "/">Sign Out</Link></div>
        </div>
      </nav>
    </div>
  )
}

export default Dashboard