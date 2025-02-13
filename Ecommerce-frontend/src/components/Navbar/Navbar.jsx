import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import { FiShoppingCart, FiUser, FiHeart, FiSearch } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Products",
    link: "/products",
  },
  {
    id: 3,
    name: "Kids",
    link: "/products/kids",
  },
  {
    id: 4,
    name: "Mens",
    link: "/products/mens",
  },
  {
    id: 5,
    name: "Womens",
    link: "/products/womens",
  },
];

function Navbar() {
  const { authToken, logout, login } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    kids: [],
    mens: [],
    womens: [],
  });
  const location = useLocation(); // Get current location


  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://192.168.137.160:8081/api/products/search", {
          params: { query: searchQuery },
        });
        setSearchResults(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://192.168.137.160:8081/api/categories");
        const allCategories = response.data;

           // Find the IDs for "Kids", "Mens", and "Womens" dynamically
           const kidsCategory = allCategories.find((cat) => cat.slug.toLowerCase() === "kids");
           const mensCategory = allCategories.find((cat) => cat.slug.toLowerCase() === "mens");
           const womensCategory = allCategories.find((cat) => cat.slug.toLowerCase() === "womens");
     
           // Get the IDs of these categories
           const kidsId = kidsCategory?.id;
           const mensId = mensCategory?.id;
           const womensId = womensCategory?.id;
     
           // Filter subcategories based on parent_id
           const kids = allCategories.filter((cat) => cat.parent_id === kidsId);
           const mens = allCategories.filter((cat) => cat.parent_id === mensId);
           const womens = allCategories.filter((cat) => cat.parent_id === womensId);

        setCategories(allCategories);
        setDropdownData({ kids, mens, womens });
      } catch (error) {
        console.error("Error fetching the Categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const groupedCategories = categories.reduce((acc, category) => {
    const { parent_id } = category;
    if (!acc[parent_id]) acc[parent_id] = [];
    acc[parent_id].push(category);
    return acc;
  }, {});

  const CategoryList = ({ categories, level = 1 }) => {
    const baseFontSize = 16; // Starting font size in px
    const fontSize = Math.max(baseFontSize - (level * 2), 12);
    const basePadding = 8;
    
    return (
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/products/${category.slug}`}
              className={`inline-block w-full rounded-md ${
                location.pathname === `/products/${category.slug}`
                  ? "active-navlink"
                  : ""
              }`}
              style={{ fontSize: `${fontSize}px`,
          }}
            >
              {category.name}
            </Link>
  
            {/* Recursive Rendering for Subcategories */}
            <div className="">
            {groupedCategories[category.id]?.length > 0 && (
              <CategoryList categories={groupedCategories[category.id]} level={level + 1} />
            )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="shadow-md navbar-top duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="py-2">
        <div className="container flex justify-between items-center">
          <div>
            <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Logo" className="w-10" />
              UrbanAura
            </Link>
          </div>
          
          <div className="flex justify-center">
          <div className="sm:flex nav-links items-center">
            {Menu.map((menuItem) => (
              <div key={menuItem.id} className="group  relative cursor-pointer">
                {/* Top-level menu link */}
                <Link
                  to={menuItem.link}
                  className={`inline-block w-full p-2 ${
                    location.pathname === menuItem.link ? "active-navlink" : ""
                  }`}
                >
                  {menuItem.name}
                </Link>

                {/* Mega Menu Dropdown */}
                {["Kids", "Mens", "Womens"].includes(menuItem.name) &&  dropdownData[menuItem.name.toLowerCase()]?.length > 0 &&  (
                  <div className="absolute z-[9999] hidden transition-all ease-in-out delay-100 group-hover:block bg-white border w-auto mega-menu p-4 " >
                    <div className="grid grid-cols-3 gap-4">
                      {dropdownData[menuItem.name.toLowerCase()].map((subCat) => (
                        <div key={subCat.id}>
                          <Link to={`/products/${subCat.slug}`} className="font-bold text-black mb-2">{subCat.name}</Link>

                          {/* Render Recursive Subcategories */}
                          {groupedCategories[subCat.id]?.length > 0 && (
                            <CategoryList categories={groupedCategories[subCat.id]} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>



       
          </div>

          

          {/* Search Bar and Icons */}
          <div className="flex justify-between items-center">
            <div className="relative group hidden sm:block">
              <div
                className={`absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isHovered
                    ? "opacity-100 scale-100 w-[200px] mr-2"
                    : "opacity-0 scale-95 w-0"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search by name, brand, or price..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  style={{fontSize:" 12px",
                   }}
                  className={`w-full transition-all z-0 duration-300 rounded-full ${isHovered ? "pl-2":""}  focus:cursor-pointer border border-gray-300  py-1 focus:outline-none focus:border-primary dark:border-gray-500 dark:bg-gray-800`}
                />
              </div>
              <FiSearch
                size={20}
                onClick={() => setIsHovered(!isHovered)}
                className={`text-gray-500 mr-3 transition-colors duration-300 cursor-pointer ${
                  isHovered ? "text-primary" : "text-gray-500"
                }`}
                style={{ zIndex: 99999 }}
              />
            {isSearchOpen && (
  <div className="absolute search-results z-50 mt-2 bg-white border border-gray-300 rounded shadow-md">
    {isLoading ? (
      <div className="p-3 text-center">Loading...</div>
    ) : searchResults.length > 0 ? (
      searchResults.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="block px-4 py-2 hover:bg-gray-100"
        >
          <div>
            <p>{product.name}</p>
            <p className="text-sm text-gray-500">
              {product.brand.name} - ₹{product.discounted_price}
            </p>
          </div>
        </Link>
      ))
    ) : (
      <div className="p-3 text-center text-gray-500">No products found</div>
    )}
  </div>
)}
            </div>

            <div className="flex">
              <Link to="/cart" className="">
                <FiShoppingCart size={20} title="Cart" className="cursor-pointer mr-3" />
              </Link>
              <Link to="/account/wishlist" className="">
                <FiHeart size={20} title="Wishlist" className="mr-3" />
              </Link>
            </div>

            
            <button className="mr-3"><Link  to="/account/profile-details">
                            <FiUser size={20} className="cursor-pointer" />
                          </Link>
              
            </button>

            {/* Darkmode Switch */}
            <div>
              <DarkMode />
            </div>
          </div>
          <div className="sm:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          {isMobileMenuOpen && (
        <div className="sm:hidden mobile-menu">
          <div className="flex flex-col items-center">
            {Menu.map((menuItem) => (
              <Link
                key={menuItem.id}
                to={menuItem.link}
                className="block p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {menuItem.name}
              </Link>
            ))}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
