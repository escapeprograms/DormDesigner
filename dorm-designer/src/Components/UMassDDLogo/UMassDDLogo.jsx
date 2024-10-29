import React from 'react'
import './UMassDDLogo.css'
import logo from '../Assets/UMass Logo.png'
import text from '../Assets/Dorm Designer.png'

const UMassDDLogo = () => {
    return (
        <div className="logo-container">
            <img src={logo} alt="Logo" className="umass-logo"/>
            <img src={text} alt="Text" className="dorm-designer"/>
        </div>
    )
}

export default UMassDDLogo