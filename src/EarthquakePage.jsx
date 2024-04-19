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

    useEffect(() => {
        fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson', setEarthquakeDataHour);
        fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson', setEarthquakeDataDay);
        fetchEarthquakeData('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson', setEarthquakeDataWeek);
    }, []);

    const fetchEarthquakeData = async (url, setter) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}`);
            }
            const data = await response.json();
            setter(data.features);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
        }
    };

    const renderEarthquakeMarkers = (earthquakeData) => {
        return earthquakeData.map((quake, index) => (
            <CircleMarker key={index} center={[quake.geometry.coordinates[1], quake.geometry.coordinates[0]]} radius={5}>
                <Popup>
                    Magnitude: {quake.properties.mag}<br />
                    Location: {quake.properties.place}
                </Popup>
            </CircleMarker>
        ));
    };

    const handlePanning = (coords) => {
        const map = document.querySelector('.leaflet-container').leafletElement;
        map.flyTo(coords, 10); // Pan to the clicked earthquake's coordinates with zoom level 10
    };

    const renderEarthquakeList = (earthquakeData, handlePanning) => {
        if (earthquakeData.length === 0) {
            return <p>No significant earthquakes found.</p>;
        }
        return (
            <ul className="EarthquakeList">
                {earthquakeData.map((quake, index) => (
                    <li key={index}>
                        <button onClick={() => handlePanning([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])}>
                            <h3>{quake.properties.title}</h3>
                            <p>{quake.properties.place}</p>
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    const MapPanner = ({ quake }) => {
        const map = useMap();
        map.flyTo([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], 10); // Pan to the clicked earthquake's coordinates with zoom level 10
        return null;
    };

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
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                            />
                            {renderEarthquakeMarkers(earthquakeDataHour)}
                            {renderEarthquakeList(earthquakeDataHour, handlePanning)}
                        </MapContainer>
                    </div>
                </section>
                <section>
                    <h2>Significant Earthquakes within the last day</h2>
                    <div className='EarthQuakeContainer'>
                        <MapContainer center={mapCenterDay} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                            />
                            {renderEarthquakeMarkers(earthquakeDataDay)}
                            {renderEarthquakeList(earthquakeDataDay, handlePanning)}
                        </MapContainer>
                    </div>
                </section>
                <section>
                    <h2>Significant Earthquakes within the last week</h2>
                    <div className='EarthQuakeContainer'>
                        <MapContainer center={mapCenterWeek} zoom={5} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                            />
                            {renderEarthquakeMarkers(earthquakeDataWeek)}
                            {renderEarthquakeList(earthquakeDataWeek, handlePanning)}
                        </MapContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EarthquakePage;
