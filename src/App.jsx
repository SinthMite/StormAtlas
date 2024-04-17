import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import Footer from './Footer.jsx';
import HomeMap from './HomeMap.jsx';
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

  return (
    <Router>
      <div className='homePage'>
        <header>
          <div className='headerDiv'>
            <div className='logoSide'>
              <h1>StormAtlas</h1>
            </div>
            <div className='headerbutton'>
              <Link to="/StormAtlas"><button id='homeButton'>Home</button></Link>
              <button onClick={toggleDropdown}>Options</button>
              {showDropdown && <DropDown />}
              <Link to="/about"><button>About</button></Link>
            </div>
          </div>
        </header>
        <div className='homeComponent'>
          <Routes>
            <Route path="/StormAtlas" element={<HomeWithMap />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/hurricane" element={<HurricanePage />} />
            <Route path="/earthquake" element={<EarthquakePage />} />
            <Route path="/flood" element={<FloodPage />} />
            <Route path="/trend-analysis" element={<TrendAnalysisPage />} />
            <Route path="/news-coverage" element={<NewsCoveragePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function HomeWithMap() {
  return (
    <div>
      <Home />
      <HomeMap />
    </div>
  );
}
function DropDown() {
  return (
    <div className='dropDown'>
      <ul className='dropDownList'>
        <li><Link className='linkItem' to="/hurricane">Hurricane</Link></li>
        <li><Link className='linkItem' to="/earthquake">Earthquake</Link></li>
        <li><Link className='linkItem' to="/flood">Flood</Link></li>
        <li><Link className='linkItem' to="/trend-analysis">Trend Analysis</Link></li>
        <li><Link className='linkItem' to="/news-coverage">News Coverage</Link></li>
      </ul>
    </div>
  );
}
export default App;