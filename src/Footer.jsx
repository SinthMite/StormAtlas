import React from 'react';
import Logo from './assets/Logo.svg';
import './Footer.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className='footerContent'>
        <div className='logoContainer'>
          <h1>StormAtlas</h1>
        </div>
        <div className='footerLinks'>
        <Link to="/StormAtlas"><button >Home</button></Link>
        <Link to="/StormAtlas/earthquake"><button>EarthQuake</button></Link>
        <Link to="/StormAtlas/trend-analysis"><button>Trend Analysis</button></Link>
        <Link to="/StormAtlas/about"><button>About</button></Link>
        </div>
      </div>
      <div className="footerBottom">
        <p>&copy; {new Date().getFullYear()} StormAtlas. All rights reserved.</p>
        <p>Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
}

export default Footer;