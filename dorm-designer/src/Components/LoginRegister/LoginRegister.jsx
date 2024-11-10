import React from 'react'
import { Link } from 'react-router-dom'
import './LoginRegister.css'

const LoginRegister = () => {

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Sign In</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
      <div className='input'>
        <img src ="" alt="" />
        <input type ="Username" placeholder="Username" />
      </div>
      <div className='input'>
        <img src ="" alt="" />
        <input type ="Password" placeholder="Password" />
      </div>
      </div>
      <div className ="submit-container">
        <div className = "submit"><Link to = "/dashboard">Login</Link></div>
        <div className = "submit"><Link to = "/dashboard">Register</Link></div>
      </div>
    </div>
  )
}

export default LoginRegister