import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className='footerContent'>
        <div className='logoContainer'>
          <h2>Storm<span>Atlas</span></h2>
        </div>
        <div className='footerLinks'>
          <Link to="/StormAtlas"><button>Home</button></Link>
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
