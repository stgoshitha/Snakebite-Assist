import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import sriLankaProvinces from '../../data/sriLankaProvinces';
import 'leaflet/dist/leaflet.css';
import '../../styles/ProvinceMap.css';
import '../../utils/leafletInit';

const ProvinceMap = ({ selectedProvinces = [] }) => {
  const navigate = useNavigate();
  const [hoveredProvince, setHoveredProvince] = useState(null);

  const onEachFeature = (feature, layer) => {
    // Add province name as tooltip with enhanced styling
    layer.bindTooltip(feature.properties.name, {
      permanent: false,
      direction: 'center',
      className: 'province-tooltip font-medium text-sm',
      opacity: 0.9
    });

    // Add hover effects
    layer.on({
      mouseover: (e) => {
        setHoveredProvince(feature.properties.name);
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.85,
          dashArray: ''
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        setHoveredProvince(null);
        layer.setStyle(style(feature));
      },
      click: () => {
        navigate(`/admin/snake-details/province/${feature.properties.name}`);
      }
    });
  };

  const style = (feature) => {
    const isSelected = selectedProvinces.includes(feature.properties.name);
    const isHovered = hoveredProvince === feature.properties.name;
    
    return {
      fillColor: isSelected ? '#2E7D32' : '#1976D2', // Darker, more accessible colors
      weight: isHovered ? 3 : 2,
      opacity: 1,
      color: 'white',
      dashArray: isHovered ? '' : '3',
      fillOpacity: isHovered ? 0.85 : 0.7,
      transition: 'all 0.3s ease'
    };
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="relative w-full h-[400px] md:h-[500px] rounded-lg shadow-lg overflow-hidden">
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
          className="transition-all duration-300 ease-in-out"
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
      
      {/* Enhanced Legend with better visual hierarchy and accessibility */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm md:text-base p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center" role="listitem" aria-label="Legend item for provinces with snakes">
          <div 
            className="w-5 h-5 mr-3 rounded transition-transform hover:scale-110" 
            style={{ backgroundColor: '#2E7D32', opacity: 0.8 }}
            aria-hidden="true"
          ></div>
          <span className="font-medium text-gray-800">Provinces with Snake Presence</span>
        </div>
        <div className="flex items-center" role="listitem" aria-label="Legend item for provinces without snakes">
          <div 
            className="w-5 h-5 mr-3 rounded transition-transform hover:scale-110" 
            style={{ backgroundColor: '#1976D2', opacity: 0.8 }}
            aria-hidden="true"
          ></div>
          <span className="font-medium text-gray-800">Provinces without Snake Presence</span>
        </div>
      </div>
      
      {/* Interactive Help Text */}
      <p className="text-center text-sm text-gray-600 italic">
        Hover over provinces for details • Click to view snake information
      </p>
    </div>
  );
};

export default ProvinceMap; 