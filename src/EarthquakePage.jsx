import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import './EarthquakePage.css';

export default function EarthquakePage() {
    const [earthquakeDataHour, setEarthquakeDataHour] = useState([]);
    const [earthquakeDataDay, setEarthquakeDataDay] = useState([]);
    const [earthquakeDataWeek, setEarthquakeDataWeek] = useState([]);
    const [radius, setRadius] = useState(0); // Initial radius
    const position = [51.505, -0.09]; // Default position

    useEffect(() => {
        // Function to update radius gradually
        const interval = setInterval(() => {
            // Increase radius up to a maximum value (e.g., 50)
            setRadius(prevRadius => prevRadius < 50 ? prevRadius + 1 : 0);
        }, 20); // Update every 100 milliseconds

        return () => clearInterval(interval); // Cleanup function to clear interval
    }, []); // Run only once on component mount

    useEffect(() => {
        const fetchHourData = async () => {
            try {
                const response = await fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Hour Data:", data); // Log the data
                    setEarthquakeDataHour(data.features); // Extracting earthquake data and setting state
                } else {
                    throw new Error('Error fetching hour data');
                }
            } catch (error) {
                console.error('Error fetching hour data:', error); // Log detailed error
            }
        };

        fetchHourData();
    }, []);

    useEffect(() => {
        const fetchDayData = async () => {
            try {
                const response = await fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Day Data:", data); // Log the data
                    setEarthquakeDataDay(data.features); // Extracting earthquake data and setting state
                } else {
                    throw new Error('Error fetching day data');
                }
            } catch (error) {
                console.error('Error fetching day data:', error); // Log detailed error
            }
        };

        fetchDayData();
    }, []);

    useEffect(() => {
        const fetchWeekData = async () => {
            try {
                const response = await fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Week Data:", data); // Log the data
                    setEarthquakeDataWeek(data.features); // Extracting earthquake data and setting state
                } else {
                    throw new Error('Error fetching week data');
                }
            } catch (error) {
                console.error('Error fetching week data:', error); // Log detailed error
            }
        };

        fetchWeekData();
    }, []);

    return (
        <div className='EarthPage'>
            <div className='EarthheaderDiv'>
                <h1>Earthquake Tracking</h1>
            </div>
            <div className='EarthpageDiv'>
                <section>
                    <h2>Earthquakes within the last hour</h2>
                    <div className='EarthQuakeContainer'>
                        <MapContainer center={position} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                            />
                            {/* Display earthquake circle markers */}
                            {earthquakeDataHour.map((quake, index) => (
                                <CircleMarker key={index} center={[quake.geometry.coordinates[1], quake.geometry.coordinates[0]]} radius={radius}>
                                    <Popup>
                                        Magnitude: {quake.properties.mag}<br />
                                        Location: {quake.properties.place}
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                    {earthquakeDataHour && earthquakeDataHour.length <= 0 ? (
                        <p>No Significant earthquakes within the last hour</p>
                    ) : (
                        <ul className="EarthquakeList">
                            {earthquakeDataHour.map((quake, index) => (
                                <li key={index}>
                                    <h3>{quake.properties.title}</h3>
                                    <p>{quake.properties.place}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section>
                    <h2>Significant Earthquakes within the day</h2>
                    <div className='EarthQuakeContainer'>
                        <MapContainer center={position} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                            />
                            {/* Display earthquake circle markers */}
                            {earthquakeDataDay.map((quake, index) => (
                                <CircleMarker key={index} center={[quake.geometry.coordinates[1], quake.geometry.coordinates[0]]} radius={radius}>
                                    <Popup>
                                        Magnitude: {quake.properties.mag}<br />
                                        Location: {quake.properties.place}
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                    {earthquakeDataDay && earthquakeDataDay.length <= 0 ? (
                        <p>No Significant earthquakes within the last hour</p>
                    ) : (
                        <ul className="EarthquakeList">
                            {earthquakeDataDay.map((quake, index) => (
                                <li key={index}>
                                    <h3>{quake.properties.title}</h3>
                                    <p>{quake.properties.place}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section className='weeklyEarthQuakeSection'>
                    <h2>Significant Earthquakes within the last week</h2>
                    <div className='EarthQuakeContainer'>
                        <MapContainer center={position} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                            />
                            {/* Display earthquake circle markers */}
                            {earthquakeDataWeek.map((quake, index) => (
                                <CircleMarker key={index} center={[quake.geometry.coordinates[1], quake.geometry.coordinates[0]]} radius={radius}>
                                    <Popup>
                                        Magnitude: {quake.properties.mag}<br />
                                        Location: {quake.properties.place}
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                    {earthquakeDataWeek && earthquakeDataWeek.length <= 0 ? (
                        <p>No Significant earthquakes within the last hour</p>
                    ) : (
                        <ul className="EarthquakeList">
                            {earthquakeDataWeek.map((quake, index) => (
                                <li key={index}>
                                    <h3>{quake.properties.title}</h3>
                                    <p>{quake.properties.place}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
