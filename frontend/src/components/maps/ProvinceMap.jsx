import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import sriLankaProvinces from '../../data/sriLankaProvinces';
import 'leaflet/dist/leaflet.css';
import '../../utils/leafletInit';

const ProvinceMap = ({ selectedProvinces = [] }) => {
  const navigate = useNavigate();

  const onEachFeature = (feature, layer) => {
    // Add province name as tooltip
    layer.bindTooltip(feature.properties.name, {
      permanent: false,
      direction: 'center',
      className: 'province-tooltip'
    });

    // Add click handler to navigate to snake details
    layer.on('click', () => {
      navigate(`/admin/snake-details/province/${feature.properties.name}`);
    });
  };

  const style = (feature) => {
    const isSelected = selectedProvinces.includes(feature.properties.name);
    return {
      fillColor: isSelected ? '#4CAF50' : '#3388ff',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[400px]">
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            key={selectedProvinces.join(',')}
            data={sriLankaProvinces}
            style={style}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: '#4CAF50', opacity: 0.7 }}></div>
          <span>Provinces where snakes are found</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: '#3388ff', opacity: 0.7 }}></div>
          <span>Provinces where snakes are not found</span>
        </div>
      </div>
    </div>
  );
};

export default ProvinceMap; 