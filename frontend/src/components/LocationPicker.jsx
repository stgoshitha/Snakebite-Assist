import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { HiOutlineLocationMarker } from "react-icons/hi";

const LocationPicker = ({ formData, setFormData }) => {
  const [position, setPosition] = useState([7.8731, 80.7718]); // Default: Sri Lanka
  const [city, setCity] = useState("");

  // Handle map click event
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
        setPosition([lat, lng]); // Update marker position
      },
    });
    return null;
  };

  // Handle city search
  const handleSearchlocation = async () => {
    if (!city) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: { q: city, format: "json" },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
        }));
      } else {
        alert("City not found! Try again.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
          <HiOutlineLocationMarker />
          <label>Select Location on Map</label>
        </div>
        <div className="text-sm text-gray-600 mb-2">Use My Location</div>
      </div>

      {/* City Search */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full"
        />
        <button
          type="button"
          onClick={handleSearchlocation}
          className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700"
        >
          Search
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-grow overflow-y-auto">
    {/* Your map or other page content here */}
    <MapContainer
      center={position}
      zoom={8}
      style={{ height: "400px", width: "100%" }}
      className="mb-4 rounded border"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {formData.latitude && formData.longitude && (
        <Marker position={[formData.latitude, formData.longitude]} />
      )}
      <MapClickHandler />
      <ChangeView center={position} />
    </MapContainer>
  </div>

      {/* Lat/Long Info */}
      <div className="flex gap-5 text-sm text-gray-700 mt-2">
        <div>
          <label className="font-medium">Latitude: </label>
          {formData.latitude || ""}
        </div>
        <div>
          <label className="font-medium">Longitude: </label>
          {formData.longitude || ""}
        </div>
      </div>
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
