import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home.jsx'; // Import the combined Home component
import Footer from './components/Footer.jsx';
import AboutPage from './components/AboutPage.jsx';
import logo from './assets/Logo.png'
function App() {

  return (
    <Router>
      <div className='homePage'>
        <header>
          <div className='headerDiv'>
            <div className='logoSide'>
              <img src={logo} alt='logo' className='logo'/>
          </div>
            <div className='headerbutton'>
              <Link to="/StormAtlas"><button>Home</button></Link>
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

export default App;
