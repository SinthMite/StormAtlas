import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './Home.jsx'; // Import the combined Home component
import Footer from './Footer.jsx';
import HurricanePage from './HurricanePage.jsx';
import EarthquakePage from './EarthquakePage.jsx';
import FloodPage from './FloodPage.jsx';
import TrendAnalysisPage from './TrendAnalysisPage.jsx';
import NewsCoveragePage from './NewsCoveragePage.jsx';
import AboutPage from './AboutPage.jsx';

function App() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to handle click outside dropdown
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

  const dropdownRef = useRef(null);

  return (
    <Router>
      <div className='homePage'>
        <header>
          <div className='headerDiv'>
            <div className='logoSide'>
              <h1>StormAtlas</h1>
            </div>
            <div className='headerbutton'>
              <Link to="/StormAtlas"><button >Home</button></Link>
              <button onClick={toggleDropdown} id='OptionButton'>Options</button>
              {showDropdown && <DropDown dropdownRef={dropdownRef} />}
              <Link to="/StormAtlas/about"><button>About</button></Link>
            </div>
          </div>
        </header>
        <div className='homeComponent'>
          <Routes>
            <Route path="/StormAtlas" element={<Home />} /> {/* Use the combined Home component */}
            <Route path="/StormAtlas/about" element={<AboutPage />} />
            <Route path="/StormAtlas/hurricane" element={<HurricanePage />} />
            <Route path="/StormAtlas/earthquake" element={<EarthquakePage />} />
            <Route path="/StormAtlas/flood" element={<FloodPage />} />
            <Route path="/StormAtlas/trend-analysis" element={<TrendAnalysisPage />} />
            <Route path="/StormAtlas/news-coverage" element={<NewsCoveragePage />} />
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
        <li><Link className='linkItem' to="/StormAtlas/hurricane">Hurricane</Link></li>
        <li><Link className='linkItem' to="/StormAtlas/earthquake">Earthquake</Link></li>
        <li><Link className='linkItem' to="/StormAtlas/flood">Flood</Link></li>
        <li><Link className='linkItem' to="/StormAtlas/trend-analysis">Trend Analysis</Link></li>
        <li><Link className='linkItem' to="/StormAtlas/news-coverage">News Coverage</Link></li>
      </ul>
    </div>
  );
}

export default App;
