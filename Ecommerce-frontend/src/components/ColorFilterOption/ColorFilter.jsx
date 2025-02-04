import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Color palette with names and hex values
const COLOR_PALETTE = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Teal', hex: '#008080' }
];

const ColorFilter = ({ onColorSelect }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleColorToggle = (color) => {
    const newSelectedColors = selectedColors.includes(color) 
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    setSelectedColors(newSelectedColors);

    // Optional: Call parent component's handler
    if (onColorSelect) {
      onColorSelect(newSelectedColors);
    }
  };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

  return (
    <div className="filter-group  p-2">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <label 
          htmlFor="color" 
          className=" text-gray text-base font-semibold "
        >
          Filter by Color
        </label>
        {isExpanded ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
      </div>
      
      {isExpanded && (
        <div 
          className="colors-list grid grid-cols-4 gap-2 mt-2 transition-all duration-300 ease-in-out"
        >
          {COLOR_PALETTE.map((color) => (
            <div 
              key={color.hex} 
              className="colors-item text-center flex flex-col items-center mt-2"
            >
              <label 
                className={`
                  w-5 h-5 rounded-full cursor-pointer 
                  border-2 flex items-center justify-center
                  ${selectedColors.includes(color.name) 
                    ? 'border-blue-500 ring-2 ring-blue-300' 
                    : 'border-gray-300'}
                `}
                style={{ backgroundColor: color.hex }}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedColors.includes(color.name)}
                  onChange={() => handleColorToggle(color.name)}
                />
                {selectedColors.includes(color.name) && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-white" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
              </label>
              <span className="text-xs text-gray-600 mt-1">{color.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorFilter;