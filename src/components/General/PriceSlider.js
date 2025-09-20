import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PriceSlider = ({
  min = 0,
  max = 1000000,
  value = [0, 1000000],
  onChange,
  step = 1000,
  formatValue = (val) => val.toString(),
  className = "",
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= maxValue) {
      setMinValue(newMin);
      onChange && onChange(newMin, maxValue);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= minValue) {
      setMaxValue(newMax);
      onChange && onChange(minValue, newMax);
    }
  };

  const getMinPercent = () => ((minValue - min) / (max - min)) * 100;
  const getMaxPercent = () => ((maxValue - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Range Display */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-600">
          {formatValue(minValue)}
        </span>
        <span className="text-sm text-gray-600">
          {formatValue(maxValue)}
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative h-6">
        {/* Track */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full" />

        {/* Active Track */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-[#690007] rounded-full"
          style={{
            left: `${getMinPercent()}%`,
            width: `${getMaxPercent() - getMinPercent()}%`,
          }}
        />

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          step={step}
          onChange={handleMinChange}
          className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 1 }}
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          step={step}
          onChange={handleMaxChange}
          className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 2 }}
        />
      </div>

      {/* CSS Styles for the slider thumbs */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #690007;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #690007;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-webkit-slider-track {
          background: transparent;
        }

        .slider-thumb::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

PriceSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  step: PropTypes.number,
  formatValue: PropTypes.func,
  className: PropTypes.string,
};

export default PriceSlider;