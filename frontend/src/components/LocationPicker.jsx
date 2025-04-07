import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const LocationPicker = ({ formData, setFormData }) => {
  const [position, setPosition] = useState([7.8731, 80.7718]); // Default: Sri Lanka
  const [city, setCity] = useState("");

  // Handle map click event
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
        setPosition([lat, lng]); // Update marker position
      },
    });
    return null;
  };

  // Handle city search
  const handleSearchlocation = async () => {
    if (!city) return;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: city, format: "json" },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
      } else {
        alert("City not found! Try again.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <div>
      {/* Latitude & Longitude Inputs */}
      <label>
        Latitude:
        <input type="text" name="latitude" value={formData.latitude || ""} readOnly />
      </label>
      <label>
        Longitude:
        <input type="text" name="longitude" value={formData.longitude || ""} readOnly />
      </label>

      {/* City Search */}
      <div>
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearchlocation} className="px-4 py-2 mt-4 bg-zinc-600 text-white rounded">Search</button>
      </div>

      {/* Map Container */}
      <MapContainer center={position} zoom={8} style={{ height: "400px", width: "50%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {formData.latitude && formData.longitude && <Marker position={[formData.latitude, formData.longitude]} />}
        <MapClickHandler />
        <ChangeView center={position} />
      </MapContainer>
    </div>
  );
};

// Update map view when position changes
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 10);
  return null;
};

export default LocationPicker;
