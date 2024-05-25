import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home.jsx'; // Import the combined Home component
import Footer from './components/Footer.jsx';
import AboutPage from './components/AboutPage.jsx';

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Router>
      <div className='homePage'>
        <header>
          <div className='headerDiv'>
            <div className='logoSide'>
              <h1 className='title'>StormAtlas</h1>
            </div>
            <div className='headerbutton'>
              <Link to="/StormAtlas"><button>Home</button></Link>
              {showDropdown && <DropDown dropdownRef={dropdownRef} />}
              <Link to="/StormAtlas/about"><button>About</button></Link>
            </div>
          </div>
        </header>
        <div className='homeComponent'>
          <Routes>
            <Route path="/StormAtlas" element={<Home />} />
            <Route path="/StormAtlas/about" element={<AboutPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function DropDown({ dropdownRef }) {
  return (
    <div ref={dropdownRef} className='dropDown'>
      <ul className='dropDownList'>
        <li><Link className='linkItem' to="/StormAtlas">Home</Link></li>
        <li><Link className='linkItem' to="/StormAtlas/about">About</Link></li>
      </ul>
    </div>
  );
}

export default App;
