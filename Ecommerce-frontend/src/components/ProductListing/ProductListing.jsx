import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductFilterSidebar from "./ProductFilterSidebar";
import { ProductCardImage } from "../Products/ProductCardImage";
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";


const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const {categoryParam} = useParams(); // if categoryParam is top-products then sort the products by rating
  
  const [filters, setFilters] = useState({
    category: categoryParam && categoryParam !== "top-products" ? [categoryParam] : [],
    sizes: [],
    priceRange: [0,10000],
    rating: [],
  });
  const [isLoading,setIsLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [sortOption, setSortOption] = useState("newest");
  const [isTopProductsSelected, setIsTopProductsSelected] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`http://192.168.137.160:8081/api/wishlists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const wishlistedProducts = response.data;
      const wishlistMap = wishlistedProducts.reduce((map, item) => {
        map[item.product_id] = true;
        return map;
      }, {});
      setWishlistStatus(wishlistMap);
    } catch (error) {
      console.error("Error checking wishlist status", error);
    }
  };
  

  const toggleWishlist = async (productId) => {
    try {
      const authToken = localStorage.getItem("authToken");
  
      // Check if user is authenticated
      if (!authToken) {
        toast("Please log in to manage your wishlist", {
          icon: "⚠️", // Add an icon for warning
          duration: 3000, // Duration in milliseconds
        });
        return;
      }
  
      if (wishlistStatus[productId]) {
        // Remove from wishlist
        await axios.delete(`http://192.168.137.160:8081/api/wishlists/${productId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setWishlistStatus((prev) => ({ ...prev, [productId]: false }));
        toast.success("Removed from wishlist", {
          duration: 3000, // Duration in milliseconds
        });
      } else {
        // Add to wishlist
        const response = await axios.post(
          `http://192.168.137.160:8081/api/wishlists`,
          { product_id: productId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        if (response.status === 201) {
          setWishlistStatus((prev) => ({ ...prev, [productId]: true }));
          toast.success("Added to wishlist", {
            duration: 3000, // Duration in milliseconds
          });
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized
        toast("Please log in to manage your wishlist", {
          icon: "⚠️", // Add an icon for warning
          duration: 3000, // Duration in milliseconds
        });
      } else {
        console.error("Error updating wishlist", error);
        toast.error("An error occurred while updating your wishlist. Please try again.", {
          duration: 3000, // Duration in milliseconds
        });
      }
    }
  };
 
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://192.168.137.160:8081/api/products", {
          params: {
            category: filters.category.join(","),
            sizes: filters.sizes.join(","),
            price_range: `${filters.priceRange[0]},${filters.priceRange[1]}`,
            rating: filters.rating.join(","),
          },
        });
        let fetchedProducts = response.data.data.products || [];

      // Apply sorting based on the selected option
      if (categoryParam === "top-products" && !isTopProductsSelected) {
        setSortOption('top_rated');
        setIsTopProductsSelected(true); // Set the flag to true after the first selection
      }
       if (sortOption) {
        fetchedProducts = [...fetchedProducts]; // Create a copy of the array to sort
        if (sortOption === "price_low_to_high") {
          fetchedProducts.sort((a, b) => a.discounted_price - b.discounted_price);
        } else if (sortOption === "price_high_to_low") {
          fetchedProducts.sort((a, b) => b.discounted_price - a.discounted_price);
        } else if (sortOption === "newest") {
          fetchedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortOption === "oldest") {
          fetchedProducts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        else if (sortOption === "top_rated") {
          fetchedProducts.sort((a, b) => b.average_rating - a.average_rating);
        }
      }

      setProducts(fetchedProducts);
        console.log(response.data.data.products);  
      }catch (error) {
        console.error("Error fetching products:", error);
      }finally{
        setIsLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchProducts, 1000);

    checkWishlistStatus();
    return () => clearTimeout(debounceFetch);

  }, [filters, sortOption,categoryParam]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const Pagination = ({ productsPerPage, totalProducts, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div className="product-listing-container container">
      <ProductFilterSidebar filters={filters} setFilters={setFilters} />
      <div>
      <div className="sorting-options my-3">
       
        <select
          className="form-select sorting-select text-black"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="top_rated">Top Rated</option>
          <option value="price_low_to_high">Price Low to High</option>
          <option value="price_high_to_low">Price High to Low</option>
        </select>
      </div>
       {/* Products Grid */}
       <main className="products">
         {isLoading ?(
           [...Array(8)].map((_, index) => (
         <div className="space-y-3 border shadow-md product-container">
         {/* Image Section */}
         <div className="product-img relative">
           <Skeleton height={224} className="rounded-md" />
           <div className="absolute top-2 right-2">
             <Skeleton circle={true} height={24} width={24} />
           </div>
         </div>
   
         {/* Content Section */}
         <div className="product-content p-4 space-y-3">
           {/* Title and Rating */}
           <div className="flex justify-between">
             <Skeleton width={100} height={20} />
             <div className="flex items-center space-x-2">
               <Skeleton width={30} height={20} />
               <Skeleton circle={true} height={16} width={16} />
             </div>
           </div>
   
           {/* Product Name */}
           <Skeleton width="80%" height={16} />
   
           {/* Category Name */}
           <Skeleton width="50%" height={16} />
   
           {/* Price Section */}
           <div className="flex justify-between items-center mt-4">
             <div className="flex items-center gap-2">
               <Skeleton width={50} height={20} />
               <Skeleton width={40} height={16} />
               <Skeleton width={60} height={16} />
             </div>
           </div>
         </div>
       </div>))):(
         
           currentProducts.length > 0 ? (
          
            currentProducts.map((data) => (
            
            <div
              
              key={data.id}
              className="space-y-3 border shadow-md product-container "
            >
             <div className="product-img">
              <Link to={`/product/${data.id}`}>
                {/* <ProductCardImage product_id={data.id} /> */}
                <img src={`http://192.168.137.160:8081/storage/${data.images[0]?.image_path}`} alt="Product-main-img" className="product-main-image" />
              </Link>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000, // Default duration for all toasts
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
              <div onClick={()=>toggleWishlist(data.id)} >
              {wishlistStatus[data.id] ? (
                  <FaHeart color="red" className="product-wishlist-icon" title="Remove from Wishlist" />
                ) : (
                  <FaRegHeart color="gray" className="product-wishlist-icon" title="Add to Wishlist" />
                )}
            </div>
              

              </div>
              <Link to={`/product/${data.id}`}>
              <div className="product-content p-4 ">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-left text-lg text-dark">{data.brand.name}</h3>
                  <div className="flex items-center px-2 py-1 rounded-full">
                      <span className="text-gray-800 font-medium mr-1">{data.average_rating}</span>
                      <FaStar className="text-yellow-400" />
                  </div>
                </div>
                <p className="text-left text-gray-500">
                  {data.name} 
                  {/* from <span className="text-gray-700 font-medium">{data.category.name}</span> */}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold  text-dark">₹{data.discounted_price}</span>
                    <span className="sidebar-sub-option text-gray-500 line-through">₹{data.price}</span>
                    <span className="sidebar-sub-option text-red-500">
                      ({Math.round(((data.price - data.discounted_price) / data.price) * 100)}% OFF)
                    </span>
                  </div>
                  
                </div>
              </div>

              </Link>
            </div>
            
          ))
      ) : (
        <p>No products found matching your filters.</p>
      ))}
        
          
      </main>
      <Pagination
          productsPerPage={productsPerPage}
          totalProducts={products.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default ProductListing;
