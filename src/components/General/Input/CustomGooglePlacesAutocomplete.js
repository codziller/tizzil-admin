import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";

const CustomGooglePlacesAutocomplete = ({
  apiKey,
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Start typing your address...",
  className = "",
  error = null,
}) => {
  const inputRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      window.google.maps.places.AutocompleteService
    ) {
      setScriptLoaded(true);
      return;
    }

    // Load Google Maps JavaScript API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait for Places library to be fully available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds total (50 * 100ms)

      const checkPlacesReady = () => {
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.places &&
          window.google.maps.places.AutocompleteService
        ) {
          setScriptLoaded(true);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkPlacesReady, 100);
        } else {
          console.error("Google Maps Places library failed to load after 5 seconds");
        }
      };
      checkPlacesReady();
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };

    document.head.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    if (!scriptLoaded) return;

    // Ensure Google Maps Places library is fully loaded
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places ||
      !window.google.maps.places.AutocompleteService ||
      !window.google.maps.places.PlacesService
    ) {
      console.error("Google Maps Places library not fully loaded");
      return;
    }

    try {
      // Initialize AutocompleteService and PlacesService
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    } catch (error) {
      console.error("Error initializing Google Places services:", error);
    }
  }, [scriptLoaded]);

  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setSelectedIndex(-1);

      if (onChange) {
        onChange(newValue);
      }

      if (!newValue || newValue.length < 3) {
        setPredictions([]);
        setShowPredictions(false);
        return;
      }

      // Get predictions using AutocompleteService
      if (autocompleteServiceRef.current) {
        autocompleteServiceRef.current.getPlacePredictions(
          {
            input: newValue,
            types: ["address"],
          },
          (predictionsResult, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              predictionsResult
            ) {
              setPredictions(predictionsResult);
              setShowPredictions(true);
            } else {
              setPredictions([]);
              setShowPredictions(false);
            }
          }
        );
      }
    },
    [onChange]
  );

  const handlePredictionClick = useCallback(
    (prediction) => {
      setInputValue(prediction.description);
      setShowPredictions(false);
      setPredictions([]);

      // Get place details using PlacesService
      if (placesServiceRef.current) {
        placesServiceRef.current.getDetails(
          {
            placeId: prediction.place_id,
            fields: [
              "formatted_address",
              "geometry",
              "address_components",
              "place_id",
            ],
          },
          (placeDetails, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              // Extract lat/lng
              const lat = placeDetails.geometry.location.lat();
              const lng = placeDetails.geometry.location.lng();

              // Extract address components
              let country = "";
              let countryCode = "";
              let state = "";
              let city = "";
              let postalCode = "";

              if (placeDetails.address_components) {
                placeDetails.address_components.forEach((component) => {
                  const types = component.types;

                  if (types.includes("country")) {
                    country = component.long_name;
                    countryCode = component.short_name;
                  }
                  if (types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                  }
                  if (
                    types.includes("locality") ||
                    types.includes("administrative_area_level_2")
                  ) {
                    if (!city) city = component.long_name;
                  }
                  if (types.includes("postal_code")) {
                    postalCode = component.long_name;
                  }
                });
              }

              // Call the onPlaceSelect callback with all the data
              if (onPlaceSelect) {
                onPlaceSelect({
                  formattedAddress: placeDetails.formatted_address,
                  lat,
                  lng,
                  country,
                  countryCode,
                  state,
                  city,
                  postalCode,
                  placeId: placeDetails.place_id,
                });
              }
            }
          }
        );
      }
    },
    [onPlaceSelect]
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setPredictions([]);
    setShowPredictions(false);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    if (onChange) {
      onChange("");
    }
    if (onPlaceSelect) {
      onPlaceSelect(null);
    }
  }, [onChange, onPlaceSelect]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!showPredictions || predictions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < predictions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < predictions.length) {
            handlePredictionClick(predictions[selectedIndex]);
          }
          break;
        case "Escape":
          setShowPredictions(false);
          setPredictions([]);
          break;
        default:
          break;
      }
    },
    [showPredictions, predictions, selectedIndex, handlePredictionClick]
  );

  // Close predictions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!scriptLoaded) {
    return (
      <div className="relative h-11 w-full flex items-center font-normal outline-none transition-all duration-300 ease-in-out text-base leading-relaxed border border-solid px-3 bg-transparent border-[#BBBBBB]">
        <span className="text-gray-400">Loading address search...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (predictions.length > 0) {
            setShowPredictions(true);
          }
        }}
        placeholder={placeholder}
        className={`relative h-11 w-full flex items-center font-normal outline-none transition-all duration-300 ease-in-out text-base leading-relaxed border border-solid px-3 pr-10 ${
          inputValue
            ? "bg-white border-[#111111] shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)]"
            : "bg-transparent border-[#BBBBBB] hover:border-[#111111] hover:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] hover:bg-white focus:border-[#111111] focus:shadow-[0px_0px_0px_2.5px_rgba(8,8,8,0.1)] focus:bg-white"
        } ${className}`}
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Predictions dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              onClick={() => handlePredictionClick(prediction)}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              } border-b border-gray-100 last:border-b-0`}
            >
              <div className="text-sm text-gray-900">
                {prediction.structured_formatting?.main_text || ""}
              </div>
              <div className="text-xs text-gray-500">
                {prediction.structured_formatting?.secondary_text || ""}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
    </div>
  );
};

CustomGooglePlacesAutocomplete.propTypes = {
  apiKey: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onPlaceSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default CustomGooglePlacesAutocomplete;
