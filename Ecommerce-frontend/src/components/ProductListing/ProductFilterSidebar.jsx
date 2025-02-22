import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import ColorFilter from "../ColorFilterOption/ColorFilter";

const ProductFilterSidebar = ({ filters, setFilters, applyFilters,resetSorting }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: false,
    price: true,
    size: true,
    rating: false,
    subcategory: true,
  });
  const { categoryParam } = useParams();
  const [selectedGender, setSelectedGender] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleCategory = () => {
    setIsCategoryOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://192.168.137.160:8081/api/categories");
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
    const categoryId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      const checkboxes = document.querySelectorAll(".form-checkbox");
      checkboxes.forEach((checkbox) => {
        if (checkbox.value !== categoryId) {
          checkbox.checked = false;
        }
      });
    }

    if (isChecked) {
      setSelectedCategory(categoryId);
      setFilters((prev) => ({
        ...prev,
        category: [categoryId],
      }));
    } else {
      setSelectedCategory(null);
      setFilters((prev) => ({
        ...prev,
        category: [],
      }));
    }
  };

  const filteredCategories = categories.filter((category) => {
    if (!selectedCategory) {
      return !filters.category?.includes(category.id);
    } else {
      return category.parent_id === parseInt(selectedCategory);
    }
  });

  const renderCategorySection = (parent) => {
    const children = groupedCategories[parent.id] || [];

    return (
      <div key={parent.id} className="py-2">
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

        {expandedSections[parent.id] && children.length > 0 && (
          <div className="py-2 pl-1">
            {children.map((child) => renderCategorySection(child))}
          </div>
        )}
      </div>
    );
  };

  const groupedCategories = categories.reduce((acc, category) => {
    const { parent_id } = category;
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
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleSection(section)}
      >
        <h3 className="text-dark sidebar-sub-option font-medium">{title}</h3>
        {expandedSections[section] ? (
          <FaChevronUp className="h-4 w-4 text-gray-600" style={{ width: "10px" }} />
        ) : (
          <FaChevronDown className="h-4 w-4 text-gray-600" style={{ width: "10px" }} />
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
          <FaChevronUp className="text-gray-600" style={{ width: "10px" }} />
        ) : (
          <FaChevronDown className="text-gray-600" style={{ width: "10px" }} />
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
              step="50"
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="thumb thumb-left"
            />
            <input
              type="range"
              min={0}
              max={10000}
              step="50"
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
              step="50"
              max={filters.priceRange[1] - 1}
              className="value-input"
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              min={filters.priceRange[0] + 1}
              max={10000}
              step="50"
              className="value-input"
            />
          </div>
        </div>
      )}
    </div>
  );

  const isAnyFilterSelected = () => {
    return (
      filters.category?.length > 0 ||
      filters.size?.length > 0 ||
      filters.rating?.length > 0 ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 10000
    );
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 10000],
      sizes: [],
      rating: [],
    });
    setSelectedCategory(null);
    setSelectedGender(null);

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll(".form-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    resetSorting();
  };

  return (
    <aside className="filters mt-3">
      <div className="px-4 py-2 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-dark">Filter Options</h2>
        {isAnyFilterSelected() && (
          <FaTimesCircle
            onClick={clearFilters}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
          />
        )}
      </div>
      <div className="px-4">
        {renderPriceFilter()}
        <div className="border-b border-gray-100 py-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("subcategory")}
          >
            <label className="text-dark sidebar-sub-option font-medium">Category</label>
            {expandedSections.subcategory ? (
              <FaChevronUp className="text-gray-600" style={{ width: "10px" }} />
            ) : (
              <FaChevronDown className="text-gray-600" style={{ width: "10px" }} />
            )}
          </div>
          {expandedSections.subcategory && (
            <div className="p-3">
              {groupedCategories[0]?.map((parent) => renderCategorySection(parent))}
            </div>
          )}
        </div>
        {renderFilterSection("Size", "sizes", ["S", "M", "L", "XL", "XXL"])}
        {renderFilterSection("Rating", "rating", ["⭐ and above", "⭐⭐ and above", "⭐⭐⭐ and above", "⭐⭐⭐⭐ and above", "⭐⭐⭐⭐⭐ only"])}
      </div>
    </aside>
  );
};

export default ProductFilterSidebar;