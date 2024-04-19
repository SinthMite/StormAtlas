import React, { useState, useEffect, useRef } from 'react';
import BackGroundVideo from './assets/BackGround.mp4';
import './Home.css';

const API_KEY_OPENWEATHERMAP = "c02c81c69aeca3d86e9118215a9f3cca";
const API_KEY_NEWSAPI = "pub_4209530ee2e4b7b0baaf460bdb8c7b4869283";

const Home = ({ setLat, setLon }) => {
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
    console.log(longitude)
    useEffect(() => {
        const fetchData = async () => {
            if (zipCode.trim() === '') return; // Skip fetching if zipCode is empty
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
                        setLat(geoResponse.lat);
                        setLon(geoResponse.lon);
                    }
                }
            } catch (error) {
                setError('Error fetching weather data. Please enter a valid ZIP code.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [zipCode, setLat, setLon]);

    useEffect(() => {
        const fetchNews = async () => {
            const apiKey = 'AIzaSyCKSPy_djrq8jIcAWBLnKq2L4X-rs_dylU';
const searchEngineId = 'f362cbcad97df4478';
const searchTerm = `weather ${zipCode}`; // Combining zipCode with hardcoded weather term
        try {
            const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchTerm)}`);
            if (response.ok) {
                const data = await response.json();
                console.log("News Data:", data); // Log the data
                setScienceNews(data.items || []); // Update state with news items
            } else {
                throw new Error('Error fetching news data');
            }
        } catch (error) {
            console.error('Error fetching news data:', error); // Log detailed error
            setError('Error fetching news data. Please try again later.');
        }
    };

    fetchNews(); // Call the fetchNews function when the component mounts or when zipCode changes
}, [zipCode]); // Trigger fetchNews whenever zipCode changes

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.error('Error playing video:', error));
        }
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            setLoading(true);
            const geoResponse = await fetchGeo();
            if (geoResponse) {
                const weatherData = await fetchWeather(geoResponse.lat, geoResponse.lon);
                if (weatherData) {
                    setCityName(weatherData.cityName);
                    setTemperature(weatherData.temperature);
                    setDescription(weatherData.description.toUpperCase());
                    setHumidity(weatherData.humidity);
                    setLat(geoResponse.lat);
                    setLon(geoResponse.lon);
                }
            }
        } catch (error) {
            setError('Error fetching weather data. Please enter a valid ZIP code.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setZipCode(event.target.value);
    };
    const fetchGeo = async () => {
        try {
            const urlGeo = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zipCode)},US&appid=${API_KEY_OPENWEATHERMAP}`;
            const response = await fetch(urlGeo);
            if (response.ok) {
                const data = await response.json();
                setLatitude(data.lat); // Set latitude
                setLongitude(data.lon); // Set longitude
                return data; // Return the data
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
console.log(scienceNews.results)
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
                </div>
            </section>
        </div>
    );
}

export default Home;