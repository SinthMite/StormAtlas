import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import './HomeMap.css';

export default function HomeMap({ lat, lon }) {
    const apiKey = "c02c81c69aeca3d86e9118215a9f3cca";
    const position = [lat || 51.505, lon || -0.09]; // Use lat and lon props if available, fallback to default values
    console.log("lon "+lon)
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
}