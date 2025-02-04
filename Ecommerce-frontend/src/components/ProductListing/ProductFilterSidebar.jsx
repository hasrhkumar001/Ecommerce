import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ColorFilter from "../ColorFilterOption/ColorFilter";

const ProductFilterSidebar = ({ filters, setFilters, applyFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: false,
    price: true,
    size: true,
    rating: false,
    subcategory:true,
  });
  const {categoryParam} = useParams();
  const [selectedGender, setSelectedGender] = useState(null);
  const [categories,setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleCategory = () => {
    setIsCategoryOpen((prev) => !prev);
  };

  
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories");
        const allCategories = response.data;
        console.log(response.data);
        setCategories(allCategories);
        if (categoryParam) {
          const matchingCategory = allCategories.find(
            (cat) => cat.id === parseInt(categoryParam) || cat.name.toLowerCase() === categoryParam.toLowerCase()
          );

          if (matchingCategory) {
            setSelectedCategory(matchingCategory.name.toString());
            setFilters((prev) => ({
              ...prev,
              category: [matchingCategory.name.toString()],
            }));
          }
        }
        
      } catch (error) {
        console.error("Error fetching the Categories:", error);
      }
    };

    fetchCategories();
  

  }, [categoryParam, setFilters]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value; // Get the selected category ID
    const isChecked = e.target.checked; // Check if the checkbox is checked
  
    // Ensure only one checkbox is selected at a time
    if (isChecked) {
      // Deselect all other checkboxes
      const checkboxes = document.querySelectorAll(".form-checkbox");
      checkboxes.forEach((checkbox) => {
        if (checkbox.value !== categoryId) {
          checkbox.checked = false; // Uncheck all other checkboxes
        }
      });
    }
  
    // Update state and filters
    if (isChecked) {
      setSelectedCategory(categoryId); // Set the selected category in state
      console.log("Selected category ID:", categoryId);
  
      setFilters((prev) => ({
        ...prev,
        category: [categoryId], // Update filters with the selected category
      }));
    } else {
      setSelectedCategory(null); // Clear the selected category
      console.log("No category selected");
  
      setFilters((prev) => ({
        ...prev,
        category: [], // Clear the category filter
      }));
    }
  };
  
  // Filter categories based on selected category logic
  const filteredCategories = categories.filter((category) => {
    if (!selectedCategory) {
      // If no category is selected, show all except those already in the filters
      return !filters.category?.includes(category.id);
    } else {
      // Show only categories with parent_id equal to the selected category
      return category.parent_id === parseInt(selectedCategory);
    }
  });



  const renderCategorySection = (parent) => {
    const children = groupedCategories[parent.id] || [];
  
    return (
      <div key={parent.id} className=" py-2">
        {/* Parent Dropdown */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection(parent.id)}
        >
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              value={parent.slug}
              name={parent.name}
              className="form-checkbox text-primary"
              
              onChange={(e) => handleCategoryChange(e, parent)}
            />
            <h3 className="text-dark sidebar-sub-option">{parent.name}</h3>
          </label>
          {children.length > 0 && (
            <>
              {expandedSections[parent.id] ? (
                <FaChevronUp className="h-2 w-2 text-gray-500" />
              ) : (
                <FaChevronDown className="h-2 w-2 text-gray-500" />
              )}
            </>
          )}
        </div>
  
        {/* Children Dropdown */}
        {expandedSections[parent.id] && children.length > 0 && (
          <div className=" py-2 pl-1">
            {children.map((child) => renderCategorySection(child))}
          </div>
        )}
      </div>
    );
  };
  
  // Group categories by parent_id
  const groupedCategories = categories.reduce((acc, category) => {
    const { parent_id } = category;
    // console.log(parent_id);
    if (!acc[parent_id]) acc[parent_id] = [];
    acc[parent_id].push(category);
    return acc;
  }, {});

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

 

  

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (e, filterType) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter((item) => item !== value),
    }));
  };

  const handlePriceChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: type === "min"
        ? [Math.min(Number(value), prev.priceRange[1] - 1), prev.priceRange[1]]
        : [prev.priceRange[0], Math.max(Number(value), prev.priceRange[0] + 1)],
    }));
  };

  
  const renderFilterSection = (title, section, options) => (
    <div className="border-b border-gray-100 py-4">
      <div
        className="flex justify-between items-center cursor-pointer "
        onClick={() => toggleSection(section)}
      >
        <h3 className="text-dark sidebar-sub-option font-medium">{title}</h3>
        {expandedSections[section] ? (
          <FaChevronUp className="h-4 w-4 text-gray-600"  style={{ width: "10px"}}/>
        ) : (
          <FaChevronDown className="h-4 w-4 text-gray-600"  style={{ width: "10px"}} />
        )}
      </div>
      {expandedSections[section] && (
        <div className="space-y-2 p-3">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-1">
              <input
                type="checkbox"
                id={`${section}-${option}`}
                value={option}
                checked={filters[section]?.includes(option)}
                onChange={(e) => handleCheckboxChange(e, section)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label
                htmlFor={`${section}-${option}`}
                className="ml-2 sidebar-sub-option text-dark"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPriceFilter = () => (
    <div className="border-b border-gray-100 py-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleSection("price")}
      >
        <label className="text-dark sidebar-sub-option font-medium">Price</label>
        {expandedSections.price ? (
          <FaChevronUp className="  text-gray-600"  style={{ width: "10px"}}   />
        ) : (
          <FaChevronDown className="  text-gray-600"  style={{ width: "10px"}}  />
        )}
      </div>
      {expandedSections.price && (
        <div className="dual-range-container p-3">
          <div className="slider">
          <div
            className="slider-range"
            style={{
              left: `${(filters.priceRange[0] / 10000) * 100}%`,
              width: `${((filters.priceRange[1] - filters.priceRange[0]) / 10000) * 100}%`,
            }}
          ></div>
            <input
              type="range"
              min={0}
              max={10000}
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="thumb thumb-left"
            />
            <input
              type="range"
              min={0}
              max={10000}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="thumb thumb-right"
            />
          </div>
          <div className="values">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              min={0}
              max={filters.priceRange[1] - 1}
              className="value-input"
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              min={filters.priceRange[0] + 1}
              max={10000}
              className="value-input"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <aside className="filters mt-3">
      <div className="px-4 py-2 border-b">
      <h2 className="text-lg font-semibold text-dark">Filter Options</h2>
      </div>
      <div className="px-4">
      
        {/* {renderFilterSection("Gender", "category", ["Mens", "Womens", "Kids"], handleGenderChange)} */}
        {renderPriceFilter()}
        <div className="border-b border-gray-100 py-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("subcategory")}
        >
          <label className="text-dark sidebar-sub-option font-medium">Category</label>
          {expandedSections.subcategory ? (
            <FaChevronUp className=" text-gray-600"  style={{ width: "10px"}} />
          ) : (
            <FaChevronDown className="  text-gray-600"  style={{ width: "10px"}}   />
          )}
        </div>
        {expandedSections.subcategory && (
          <div className="p-3">
      {groupedCategories[0]?.map((parent) => renderCategorySection(parent))}
        </div>)}
        </div>
        {/* {renderCategorySection(
          "Category",
          "subcategory",
          filteredCategories.map((category) => category.name)
        )} */}
        {renderFilterSection("Size", "sizes", ["S", "M", "L", "XL", "XXL"])}
        {renderFilterSection("Rating", "rating", ["⭐ and above", "⭐⭐ and above", "⭐⭐⭐ and above", "⭐⭐⭐⭐ and above", "⭐⭐⭐⭐⭐ only"])}
      </div>

    </aside>

    
  );
};

export default ProductFilterSidebar;
