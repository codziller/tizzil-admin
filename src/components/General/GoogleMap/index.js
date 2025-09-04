import React from "react";
import PropTypes from "prop-types";

const GoogleMap = ({
  lat = 6.5244,
  lng = 3.3792,
  zoom = 15,
  width = "100%",
  height = "200px",
  className = "",
  address = "",
}) => {
  // For now, we'll use a placeholder since Google Maps API setup requires API key
  // In a real implementation, you would:
  // 1. Install @googlemaps/react-wrapper or react-google-maps
  // 2. Configure Google Maps API key
  // 3. Implement actual Google Maps component

  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=${zoom}`;

  // Placeholder implementation
  const handleOpenInMaps = () => {
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div
      className={`bg-gray-100 rounded-md overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder Map */}
      <div
        className="w-full h-full relative bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gradient-to-br hover:from-blue-200 hover:to-green-200 transition-all"
        onClick={handleOpenInMaps}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {address || "Location"}
          </p>
          <p className="text-xs text-gray-500">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
          <p className="text-xs text-blue-600 mt-2 hover:underline">
            Click to open in Google Maps
          </p>
        </div>

        {/* Grid overlay to simulate map appearance */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// For actual Google Maps implementation, uncomment and use this:
/*
import { GoogleMap as GoogleMapComponent, LoadScript, Marker } from '@react-google-maps/api';

const GoogleMap = ({ lat, lng, zoom, width, height, className }) => {
  const mapStyles = {
    height,
    width
  };

  const defaultCenter = {
    lat,
    lng
  };

  return (
    <div className={className}>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMapComponent
          mapContainerStyle={mapStyles}
          zoom={zoom}
          center={defaultCenter}
        >
          <Marker position={defaultCenter} />
        </GoogleMapComponent>
      </LoadScript>
    </div>
  );
};
*/

GoogleMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  address: PropTypes.string,
};

export default GoogleMap;
