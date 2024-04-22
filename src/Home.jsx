import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import './Home.css';

const API_KEY_OPENWEATHERMAP = "c02c81c69aeca3d86e9118215a9f3cca";
const API_KEY_NEWSAPI = "pub_4209530ee2e4b7b0baaf460bdb8c7b4869283";

const Home = () => {
    const videoRef = useRef(null);
    const [cityName, setCityName] = useState('');
    const [temperature, setTemperature] = useState('');
    const [description, setDescription] = useState('');
    const [humidity, setHumidity] = useState('');
    const [zipCode, setZipCode] = useState('07052');
    const [loading, setLoading] = useState(false);
    const [scienceNews, setScienceNews] = useState([]);
    const [error, setError] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [submitted, setSubmitted] = useState(false); // State to track form submission

    useEffect(() => {
        const fetchData = async () => {
            if (!submitted || zipCode.trim() === '') return; // Only fetch data when submitted and zipCode is not empty
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
    }, [submitted, zipCode]);

    useEffect(() => {
        const fetchNews = async () => {
            const apiKey = 'Your_API_Key';
            const searchEngineId = 'Your_Search_Engine_ID';
            const searchTerm = `weather ${zipCode}`;
            
            // Check if zipCode is a valid 5-digit value
            if (zipCode.length === 5 && /^\d+$/.test(zipCode)) {
                try {
                    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchTerm)}`);
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
    }, [submitted, zipCode]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.error('Error playing video:', error));
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true); // Set submitted to true when the form is submitted
    };
    
    const handleChange = (event) => {
        // Update zipCode state only when typing if the form is not loading
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
                    humidity: `${data.main.humidity}%`
                };
            } else {
                throw new Error('Error fetching weather data');
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    };

    return (
        <div className='mainDiv'>
            <section className='basicInfo'>
                <div className='newsContainer'>
                    <h2>Science News</h2>
                    <ul className='newsUl'>
                        {scienceNews.map((item, index) => (
                            <li key={index}>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    <img src={item.pagemap.cse_image && item.pagemap.cse_image.length > 0 ? item.pagemap.cse_image[0].src : 'IMAGE_URL_FALLBACK'} alt={item.title} />
                                    <h2>{item.title}</h2>
                                    <p>{item.pagemap.metatags && item.pagemap.metatags.length > 0 && item.pagemap.metatags[0].author ? item.pagemap.metatags[0].author : 'No Author'}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
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
                            {loading? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                    {error && <p className="error">{error}</p>}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            <h2>Weather Information</h2>
                            <p>City: {cityName}</p>
                            <p>Temperature: {temperature}</p>
                            <p>Description: {description}</p>
                            <p>Humidity: {humidity}</p>
                        </div>
                    )}
                    <MapComponent latitude={latitude} longitude={longitude} />
                </div>
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

export default Home;
