import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import Logo from './assets/Logo.svg';
import Footer from './Footer.jsx';
import HomeMap from './HomeMap.jsx';
import HurricanePage from './HurricanePage.jsx';
import EarthquakePage from './EarthquakePage.jsx';
import FloodPage from './FloodPage.jsx';
import TrendAnalysisPage from './TrendAnalysisPage.jsx';
import NewsCoveragePage from './NewsCoveragePage.jsx';
import AboutPage from './AboutPage.jsx';

function App() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  // Manually specify the base URL (change '/myapp' to match your deployment)
  const baseUrl = '/';

  return (
    <Router basename={baseUrl}>
      <div className='homePage'>
        <header>
          <div className='headerDiv'>
            <div className='logoSide'>
              <h1>StormAtlas</h1>
            </div>
            <div className='headerbutton'>
              <Link to="/StormAtlas"><button id='homeButton'>Home</button></Link>
              <Link to="/options"><button>Options</button></Link>
              <Link to="/about"><button>About</button></Link>
            </div>
          </div>
          <div>
          <h2 className='subHeader'>Amidst Troubling Times, Seek Refuge in the Sheltering Arms of StormAtlas</h2>
          </div>
        </header>
        <div className='homeComponent'>
          <Routes>
            <Route path="/StormAtlas" element={<HomeWithMap setLat={setLat} setLon={setLon} lat={lat} lon={lon} />} />
            <Route path="/hurricane" element={<HurricanePage />} />
            <Route path="/earthquake" element={<EarthquakePage />} />
            <Route path="/flood" element={<FloodPage />} />
            <Route path="/trend-analysis" element={<TrendAnalysisPage />} />
            <Route path="/news-coverage" element={<NewsCoveragePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function HomeWithMap({ setLat, setLon, lat, lon }) {
  return (
    <div>
      <Home setLat={setLat} setLon={setLon} />
      <HomeMap lat={lat} lon={lon} />
    </div>
  );
}

export default App;