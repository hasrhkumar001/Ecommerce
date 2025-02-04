import React, { useEffect, useState } from "react";
import Img1 from "../../assets/shirt/shirt.png";
import Img2 from "../../assets/shirt/shirt2.png";
import Img3 from "../../assets/shirt/shirt3.png";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ProductCardImage } from "../Products/ProductCardImage";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Skeleton from "react-loading-skeleton"; // Add this if using a library
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton styles

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Casual Wear",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    img: Img2,
    title: "Printed shirt",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    img: Img3,
    title: "Women shirt",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const TopProducts = ({ handleOrderPopup }) => {

  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState({});

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/top");
        const allProducts = response.data.products;
    
  
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching the Products data:", error);
      }finally{
        setLoading(false);
      }
    };
    checkWishlistStatus();
    fetchProducts();
  }, []);
  
  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/wishlists`, {
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
        await axios.delete(`http://127.0.0.1:8000/api/wishlists/${productId}`, {
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
          `http://127.0.0.1:8000/api/wishlists`,
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
  
  
  return (
    <div>
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          {/* <p data-aos="fade-up" className="text-sm text-primary">
            Recent Products for you
          </p> */}
          <h1 data-aos="fade-up" className="text-3xl font-bold">
           Best Products
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
            asperiores modi Sit asperiores modi
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-stretch gap-5">
          {loading
        ? // Render skeleton loaders while loading
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-3 border shadow-md product-container">
              <div className="product-img">
                <Skeleton height={250} style={{ objectFit: "cover" }} />
              </div>
              <div className="product-content p-4">
                <Skeleton width="60%" height={20} />
                <Skeleton width="80%" height={15} />
                <Skeleton width="40%" height={15} style={{ marginTop: "10px" }} />
              </div>
            </div>
          ))
        :
            products.map((data) => (
              <div
              
              key={data.id}
              className="space-y-3 border shadow-md product-container "
            >
             <div className="product-img">
              <Link to={`/product/${data.id}`}>
                {/* <ProductCardImage product_id={data.id} /> */}
                <img src={`http://127.0.0.1:8000/storage/${data.images[0]?.image_path}`} alt="Product-main-img" className="product-main-image" />
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
                      <span className="text-gray-800 font-medium mr-1">{Math.round((data.average_rating ?? 0) * 100) / 100}</span>
                      <FaStar className="text-yellow-400" />
                  </div>
                </div>
                <p className="text-left text-gray-500">
                  {data.name} from <span className="text-gray-700 font-medium">{data.category.name}</span>
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
              
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center">
            <Link to={"/products/top-products"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
