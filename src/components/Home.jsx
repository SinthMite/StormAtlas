import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import './Home.css';
import altimage from '../assets/alt.jpg';
import earthquakeimage from '../assets/BackGroundImage.webp';

const API_KEY_OPENWEATHERMAP = 'c02c81c69aeca3d86e9118215a9f3cca';
const API_KEY_NEWSAPI = 'pub_4209530ee2e4b7b0baaf460bdb8c7b4869283';

const Home = () => {
  const videoRef = useRef(null);
  const [cityName, setCityName] = useState('');
  const [temperature, setTemperature] = useState('');
  const [description, setDescription] = useState('');
  const [humidity, setHumidity] = useState('');
  const [zipCode, setZipCode] = useState('10036');
  const [loading, setLoading] = useState(false);
  const [scienceNews, setScienceNews] = useState([]);
  const [error, setError] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [state, setState] = useState('');
  const [earthquakeDataHour, setEarthquakeDataHour] = useState([]);
  const [earthquakeDataDay, setEarthquakeDataDay] = useState([]);
  const [earthquakeDataWeek, setEarthquakeDataWeek] = useState([]);
  const [mapCenterHour, setMapCenterHour] = useState([51.505, 50]);
  const [mapCenterDay, setMapCenterDay] = useState([51.505, 50]);
  const [mapCenterWeek, setMapCenterWeek] = useState([51.505, 50]);

  useEffect(() => {
    const fetchData = async () => {
      if (zipCode.trim() === '') return;
      setLoading(true);
      try {
        const geoResponse = await fetchGeo();
        if (geoResponse) {
          const weatherData = await fetchWeather(geoResponse.lat, geoResponse.lon);
          if (weatherData) {
            setCityName(weatherData.cityName);
            setTemperature(weatherData.temperature);
            setDescription(weatherData.description.toUpperCase());
            setHumidity(weatherData.humidity);
            setLatitude(geoResponse.lat);
            setLongitude(geoResponse.lon);
          }
        }
      } catch (error) {
        setError('Error fetching weather data. Please enter a valid ZIP code.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [zipCode]);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = 'AIzaSyCKSPy_djrq8jIcAWBLnKq2L4X-rs_dylU';
      const searchEngineId = 'f362cbcad97df4478';
      const weatherCondition = `hurricane ${zipCode} OR tornado ${zipCode} OR earthquake ${zipCode} OR flood ${zipCode} OR wildfire ${zipCode} OR tsunami ${zipCode} OR avalanche ${zipCode} OR blizzard ${zipCode} OR drought ${zipCode} OR heatwave ${zipCode} OR cyclone ${zipCode} OR landslide ${zipCode} OR volcano eruption ${zipCode} OR weather forecast ${zipCode} OR weather news ${zipCode} OR climate change ${zipCode} OR meteorology ${zipCode} OR weather patterns ${zipCode} OR atmospheric conditions ${zipCode} OR extreme weather events ${zipCode} OR weather alerts ${zipCode} OR severe weather ${zipCode}`;
      const searchTerm = `${weatherCondition} ${zipCode} -filetype:htm`;

      if (zipCode.length === 5 && /^\d+$/.test(zipCode)) {
        try {
          const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchTerm)}&num=4`);
          if (response.ok) {
            const data = await response.json();
            setScienceNews(data.items || []);
          } else {
            throw new Error('Error fetching news data');
          }
        } catch (error) {
          console.error('Error fetching news data:', error);
          setError('Error fetching news data. Please try again later.');
        }
      }
    };

    fetchNews();
  }, [zipCode]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error('Error playing video:', error));
    }
  }, []);

  useEffect(() => {
    fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson', setEarthquakeDataHour, setMapCenterHour);
    fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', setEarthquakeDataDay, setMapCenterDay);
    fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson', setEarthquakeDataWeek, setMapCenterWeek);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    if (!loading) {
      setZipCode(event.target.value);
    }
  };

  const fetchGeo = async () => {
    try {
      const urlGeo = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zipCode)},US&appid=${API_KEY_OPENWEATHERMAP}`;
      const response = await fetch(urlGeo);
      if (response.ok) {
        const data = await response.json();
        setState(data.name);
        return data;
      } else {
        throw new Error('Error fetching geo location');
      }
    } catch (error) {
      console.error('Error fetching geo location:', error);
      throw error;
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_OPENWEATHERMAP}`;
      const response = await fetch(weatherUrl);
      if (response.ok) {
        const data = await response.json();
        return {
          cityName: data.name,
          temperature: `${Math.round((data.main.temp - 273.15) * 9/5 + 32)}°F`,
          description: data.weather[0].description,
          humidity: `${data.main.humidity}%`,
        };
      } else {
        throw new Error('Error fetching weather data');
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  };

  const fetchEarthquakeData = async (url, setter, setMapCenter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data from ${url}`);
      }
      const data = await response.json();
      setter(data.features);
      if (data.features.length > 0) {
        const firstQuake = data.features[0];
        setMapCenter([firstQuake.geometry.coordinates[1], firstQuake.geometry.coordinates[0]]);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  const handleButtonClick = (quake, setMapCenter) => {
    const coords = [quake.geometry.coordinates[1], quake.geometry.coordinates[0]];
    setMapCenter(coords);
  };

  const renderEarthquakeList = (earthquakeData, handleButtonClick, setMapCenter) => {
    if (earthquakeData.length === 0) {
      return <p>No significant earthquakes found.</p>;
    }
    return (
      <select className="EarthquakeList" onChange={(e) => handleButtonClick(earthquakeData[e.target.value], setMapCenter)}>
        {earthquakeData.map((quake, index) => (
          <option key={index} value={index}>
            {quake.properties.title} - {quake.properties.place}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className='mainDiv'>
        <section className='PosterImage'>
            <img src={earthquakeimage} alt="" />
            <div className='PosterText'>
                <h1>StormAtlas</h1>
                <p>StormAtlas is your trusted source for comprehensive information on natural disasters and weather phenomena. We aim to empower communities with real-time data, expert insights, and practical advice to help you stay informed and safe during extreme weather events.</p>
            </div>
            <div className='about'>
                <a href='/StormAtlas/about' className='button-link'>
                    About Us
                </a>
            </div>
        </section>
      <section className='basicInfo'>
        <div className='weatherContainer'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={zipCode}
              onChange={handleChange}
              placeholder="Enter ZIP code"
              id='homeWeather'
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div>
                <h2>Weather Information</h2>
                <p>Temperature: {temperature}</p>
                <p>Description: {description}</p>
                <p>Humidity: {humidity}</p>
              </div>
              <h2 className='state'>{state}</h2>
            </>
          )}
          <MapComponent latitude={latitude} longitude={longitude} />
        </div>
        <div className='newsContainer'>
          <h2>Weather News</h2>
          <ul className='newsUl'>
            {scienceNews.map((item, index) => (
              <li key={index}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img src={item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0 ? item.pagemap.cse_image[0].src : altimage} alt={altimage} />
                  <h2>{item.title}</h2>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className='EarthQuakeMaps'>
      <section>
        <h2>Earthquakes within the last hour</h2>
        <div className='EarthQuakeContainer'>
          <MapContainer center={mapCenterHour} zoom={5} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
            <PanToMarkerHour mapCenter={mapCenterHour} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            />
            {renderEarthquakeList(earthquakeDataHour, handleButtonClick, setMapCenterHour)}
            {mapCenterHour && (
              <CircleMarker
                center={mapCenterHour}
                radius={5}
                fillColor="red"
                fillOpacity={0.5}
                color="red"
              >
                <Popup>
                  <h3>{earthquakeDataHour[0]?.properties.title}</h3>
                  <p>{earthquakeDataHour[0]?.properties.place}</p>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </section>
      <section>
        <h2>Earthquakes within the last day</h2>
        <div className='EarthQuakeContainer'>
          <MapContainer center={mapCenterDay} zoom={5} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
            <PanToMarkerDay mapCenter={mapCenterDay} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            />
            {renderEarthquakeList(earthquakeDataDay, handleButtonClick, setMapCenterDay)}
            {mapCenterDay && (
              <CircleMarker
                center={mapCenterDay}
                radius={5}
                fillColor="red"
                fillOpacity={0.5}
                color="red"
              >
                <Popup>
                  <h3>{earthquakeDataDay[0]?.properties.title}</h3>
                  <p>{earthquakeDataDay[0]?.properties.place}</p>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </section>
      <section>
        <h2>Significant Earthquakes within the last week</h2>
        <div className='EarthQuakeContainer'>
          <MapContainer center={mapCenterWeek} zoom={5} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
            <PanToMarkerWeek mapCenter={mapCenterWeek} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            />
            {renderEarthquakeList(earthquakeDataWeek, handleButtonClick, setMapCenterWeek)}
            {mapCenterWeek && (
              <CircleMarker
                center={mapCenterWeek}
                radius={5}
                fillColor="red"
                fillOpacity={0.5}
                color="red"
              >
                <Popup>
                  <h3>{earthquakeDataWeek[0]?.properties.title}</h3>
                  <p>{earthquakeDataWeek[0]?.properties.place}</p>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </section>
      </section>
    </div>
  );
};

const MapComponent = ({ latitude, longitude }) => {
  const apiKey = "c02c81c69aeca3d86e9118215a9f3cca";
  const position = [latitude || 51.05, longitude || -0.09]; // Use lat and lon props if available, fallback to default values

  function PanToMarker() {
    const map = useMap();
    useEffect(() => {
      map.flyTo(position, 3, {
        duration: 2, // Duration of the animation in seconds
      });
    }, [map, position]);

    return null;
  }
  return (
    <div className='MapContainer'>
      <MapContainer center={position} zoom={-100} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
        <PanToMarker />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
        />
        <TileLayer
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`}
        />
        <TileLayer
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

const PanToMarkerHour = ({ mapCenter }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(mapCenter, 3, {
      duration: 2, // Duration of the animation in seconds
    });
  }, [map, mapCenter]);

  return null;
}

const PanToMarkerDay = ({ mapCenter }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(mapCenter, 3, {
      duration: 2, // Duration of the animation in seconds
    });
  }, [map, mapCenter]);

  return null;
}

const PanToMarkerWeek = ({ mapCenter }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(mapCenter, 3, {
      duration: 2, // Duration of the animation in seconds
    });
  }, [map, mapCenter]);

  return null;
}

export default Home;
