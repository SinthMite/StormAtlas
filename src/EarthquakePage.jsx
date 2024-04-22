import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import './EarthquakePage.css';

const EarthquakePage = () => {
    const [earthquakeDataHour, setEarthquakeDataHour] = useState([]);
    const [earthquakeDataDay, setEarthquakeDataDay] = useState([]);
    const [earthquakeDataWeek, setEarthquakeDataWeek] = useState([]);
    const [mapCenterHour, setMapCenterHour] = useState([51.505, 50]); // Default position for hour
    const [mapCenterDay, setMapCenterDay] = useState([51.505, 50]); // Default position for day
    const [mapCenterWeek, setMapCenterWeek] = useState([51.505, 50]); // Default position for week
    const [radius, setRadius] = useState(0); // Initial radius

    useEffect(() => {
        fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson', setEarthquakeDataHour, setMapCenterHour);
        fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson', setEarthquakeDataDay, setMapCenterDay);
        fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson', setEarthquakeDataWeek, setMapCenterWeek);
    }, []);

    const fetchEarthquakeData = async (url, setter, setMapCenter) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}`);
            }
            const data = await response.json();
            setter(data.features);
            // Set default map center to the first earthquake data
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
    
    function PanToMarkerHour() {
        const map = useMap();
        useEffect(() => {
            map.flyTo(mapCenterHour, 3, {
                duration: 2, // Duration of the animation in seconds
            });
        }, [map, mapCenterHour]);

        return null;
    }

    function PanToMarkerDay() {
        const map = useMap();
        useEffect(() => {
            map.flyTo(mapCenterDay, 1, {
                duration: 2, // Duration of the animation in seconds
            });
        }, [map, mapCenterDay]);

        return null;
    }

    function PanToMarkerWeek() {
        const map = useMap();
        useEffect(() => {
            map.flyTo(mapCenterWeek, 3, {
                duration: 1, // Duration of the animation in seconds
            });
        }, [map, mapCenterWeek]);

        return null;
    }
    useEffect(() => {
        // Function to update radius gradually
        const interval = setInterval(() => {
            // Increase radius up to a maximum value (e.g., 20)
            setRadius(prevRadius => prevRadius < 20 ? prevRadius + 1 : 0);
        }, 40); // Update every 40 milliseconds

        return () => clearInterval(interval); // Cleanup function to clear interval
    }, []); // Run only once on component mount

    return (
        <div className='EarthPage'>
            <div className='EarthheaderDiv'>
                <h1>Earthquake Tracking</h1>
            </div>
            <div className='EarthpageDiv'>
                <section>
                    <h2>Earthquakes within the last hour</h2>
                    <div className='EarthQuakeContainer'>
                        <MapContainer center={mapCenterHour} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <PanToMarkerHour />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                            />
                            {renderEarthquakeList(earthquakeDataHour, handleButtonClick, setMapCenterHour)}
                            {mapCenterHour && (
                                <CircleMarker
                                    center={mapCenterHour}
                                    radius={radius}
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
                    <h2>Significant Earthquakes within the last day</h2>
                    <div className='EarthQuakeContainer'>
                        <MapContainer center={mapCenterDay} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <PanToMarkerDay />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                            />
                            {renderEarthquakeList(earthquakeDataDay, handleButtonClick, setMapCenterDay)}
                            {mapCenterDay && (
                                <CircleMarker
                                    center={mapCenterDay}
                                    radius={radius}
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
                        <MapContainer center={mapCenterWeek} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <PanToMarkerWeek />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                            />
                            {renderEarthquakeList(earthquakeDataWeek, handleButtonClick, setMapCenterWeek)}
                            {mapCenterWeek && (
                                <CircleMarker
                                    center={mapCenterWeek}
                                    radius={radius}
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
            </div>
        </div>
    );
};

export default EarthquakePage;
