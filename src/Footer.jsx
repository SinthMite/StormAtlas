import React from 'react';
import Logo from './assets/Logo.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className='footerContent'>
        <div className='logoContainer'>
          <h1>StormAtlas</h1>
        </div>
        <div className='footerLinks'>
          <button>Home</button>
          <button>Options</button>
          <button>About</button>
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