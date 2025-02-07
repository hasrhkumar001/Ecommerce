import React, { useState, useEffect } from "react";
import axios from "axios";
import Img1 from "../../assets/women/women.png";
import { useParams } from "react-router-dom";

import { ProductImages } from "./ProductImages";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf, BsStarFill, BsStar } from "react-icons/bs";
import { ProductCardImage } from "./ProductCardImage";
import Review from "../Review/Review";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast, { Toaster } from "react-hot-toast"; // Import Toaster from react-hot-toast
import RecentlyViewedProducts from "./RecentlyViewedProducts";

export const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [productLoading, setProductLoading] = useState(true);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [sizesStock, setSizesStock] = useState({});

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`http://192.168.137.160:8081/api/wishlists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const wishlistedProducts = response.data;

      const isProductInWishlist = wishlistedProducts.some(
        (item) => item.product_id === product.id
      );

      // Set the wishlist status based on the condition
      setIsWishlisted(isProductInWishlist);
    } catch (error) {
      console.error("Error checking wishlist status", error);
    }
  };

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        // If the product is already wishlisted, remove it
        await axios.delete(
          `http://192.168.137.160:8081/api/wishlists/${product.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        // If the product is not wishlisted, add it
        await axios.post(
          `http://192.168.137.160:8081/api/wishlists`,
          {
            product_id: product.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized
        toast.error("Please log in to manage your wishlist");
      } else {
        console.error("Error updating wishlist", error);
        toast.error("An error occurred while updating your wishlist. Please try again.");
      }
    }
  };

  const fullStars = Math.floor(averageRating); // Number of full stars
  const hasHalfStar = averageRating % 1 >= 0.5; // Check if there is a half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

  const updateQuantity = (action) => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }

    let newQuantity = quantity;

    if (action === "increment" && newQuantity < sizesStock[selectedSize]) {
      newQuantity++;
    } else if (action === "decrement" && newQuantity > 1) {
      newQuantity--;
    } else if (action === "increment") {
      toast.error("You cannot select a quantity greater than the stock!");
      return;
    }

    setQuantity(newQuantity);
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
    } else {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = total / reviews.length;
      setAverageRating(average.toFixed(1)); // round to 1 decimal place
    }
  };

  const addToCart = async () => {
    const authToken = localStorage.getItem("authToken");
  
      // Check if user is authenticated
      if (!authToken) {
        toast.error("Please log in to manage your cart");
        return;
      }
    if (!selectedSize) {
      toast.error("Please select a size before adding to the cart!");
      return;
    }
    try {
      const response = await axios.post(
        "http://192.168.137.160:8081/api/cart",
        {
          product_id: product.id,
          quantity: quantity,
          size: selectedSize,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Add to cart logic here
      toast.success(`Product added to cart successfully!`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://192.168.137.160:8081/api/product/${id}`
      );

      setProduct(response.data);
      
      setSizesStock(response.data.sizes);
      //  console.log(response.data.sizes);
    } catch (error) {
      console.error("Error fetching the product data:", error);
    } finally {
      setProductLoading(false);
    }
  };
  const addToRecentlyViewed = async () => {
    
      const response = await axios.post(
        `http://192.168.137.160:8081/api/recently-viewed`,{
          product_id: product.id,
         
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

  };
 
  useEffect(() => {
    fetchProduct();
  }, [id]);
  
  useEffect(() => {
    if (product) {
      calculateAverageRating(product.reviews);
      setReviews(product.reviews);
      
      checkWishlistStatus();
      addToRecentlyViewed();
     
    }
  }, [product]);

  return (
    <div className="container mt-20">
      <div className="card product-detail-container md:grid-cols-2">
        {!productLoading ? (
          <>
            <div className="card-image">
              {<ProductImages images={product.images} />}
            </div>
            <div className="card-right">
              <h5 className="item-brand">
                {product.brand.name}
              </h5>
              <div className="flex justify-between items-baseline">
                <h5 className="item-title">{product.name}</h5>
                <div
                  onClick={toggleWishlist}
                  style={{ cursor: "pointer", fontSize: "24px" }}
                >
                  {isWishlisted ? (
                    <FaHeart color="red" title="Remove from Wishlist" />
                  ) : (
                    <FaRegHeart color="gray" title="Add to Wishlist" />
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {/* Render full stars */}
                {Array(fullStars)
                  .fill(0)
                  .map((_, index) => (
                    <BsStarFill key={`full-${index}`} size={18} color="gold" />
                  ))}

                {/* Render half star if applicable */}
                {hasHalfStar && <BsStarHalf size={18} color="gold" />}

                {/* Render empty stars */}
                {Array(emptyStars)
                  .fill(0)
                  .map((_, index) => (
                    <BsStar key={`empty-${index}`} size={18} color="#d1d1d1" />
                  ))}

                {/* Average rating and reviews */}
                <span style={{ marginLeft: "10px", fontSize: "1rem" }}>
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
              <p className="item-desc">{product.description}</p>

              <div>
                <p className="item-size-text">SIZE*</p>
              </div>
              <div className="size-btns">
                <button
                  className={`btn-size ${
                    (!sizesStock["S"] || sizesStock["S"] === 0
                      ? "disabled-btn"
                      : "") + (selectedSize === "S" ? " selected-size" : "")
                  }`}
                  onClick={() => setSelectedSize("S")}
                  disabled={!sizesStock["S"] || sizesStock["S"] === 0}
                >
                  S
                </button>
                <button
                  className={`btn-size btn-middle ${
                    (!sizesStock["M"] || sizesStock["M"] === 0
                      ? "disabled-btn"
                      : "") + (selectedSize === "M" ? " selected-size" : "")
                  }`}
                  onClick={() => setSelectedSize("M")}
                  disabled={!sizesStock["M"] || sizesStock["M"] === 0}
                >
                  M
                </button>
                <button
                  className={`btn-size ${
                    (!sizesStock["L"] || sizesStock["L"] === 0
                      ? "disabled-btn"
                      : "") + (selectedSize === "L" ? " selected-size" : "")
                  }`}
                  onClick={() => setSelectedSize("L")}
                  disabled={!sizesStock["L"] || sizesStock["L"] === 0}
                >
                  L
                </button>
                <button
                  className={`btn-size ${
                    (!sizesStock["XL"] || sizesStock["XL"] === 0
                      ? "disabled-btn"
                      : "") + (selectedSize === "XL" ? " selected-size" : "")
                  }`}
                  onClick={() => setSelectedSize("XL")}
                  disabled={!sizesStock["XL"] || sizesStock["XL"] === 0}
                >
                  XL
                </button>
                <button
                  className={`btn-size ${
                    (!sizesStock["XXL"] || sizesStock["XXL"] === 0
                      ? "disabled-btn"
                      : "") + (selectedSize === "XXL" ? " selected-size" : "")
                  }`}
                  onClick={() => setSelectedSize("XXL")}
                  disabled={!sizesStock["XXL"] || sizesStock["XXL"] === 0}
                >
                  XXL
                </button>
              </div>
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

              <div className="pt-2">
                <p className="item-size-text">QUANTITY</p>
                <div className="flex gap-1 items-center pt-2">
                  <button
                    onClick={() => updateQuantity("decrement")}
                    className="btn-size"
                  >
                    -
                  </button>
                  <p className="btn-quantity">{quantity}</p>
                  <button
                    onClick={() => updateQuantity("increment")}
                    className="btn-size"
                  >
                    +
                  </button>
                </div>
                <div className="item-price flex items-baseline gap-2">
                  <span className="">₹{product.discounted_price}</span>
                  <span className=" text-gray-500 text-sm line-through">
                    ₹{product.price}
                  </span>
                  <span className=" text-red-500 text-sm">
                    (
                    {Math.round(
                      ((product.price - product.discounted_price) /
                        product.price) *
                        100
                    )}
                    % OFF)
                  </span>
                </div>
                <button className="btn-add" onClick={addToCart}>
                  <b>ADD TO CART</b>
                </button>
              </div>
            </div>
           
          </>
        ) : (
          <>
            
            <div className="product-carousel">
            <div className="thumbnails ">
                             
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                height={75}
                width={75}
                style={{ borderRadius: "10px" }}
              />
            ))}
            </div>
            <div className="main-image-container">
                    <Skeleton width={600}  height={600}/>
                    </div>
            </div>
            <div>
            <div className="flex justify-between items-baseline">
              <h5 className="item-title">
                <Skeleton width={200} height={24} />
              </h5>
              <div style={{ fontSize: "24px" }}>
                <Skeleton circle width={24} height={24} />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton
                width={100}
                height={18}
                style={{ marginRight: "10px" }}
              />
              <Skeleton width={60} height={18} />
            </div>
            <p className="item-desc">
              <Skeleton count={2} />
            </p>
            
            <div>
              <p className="item-size-text">
                <Skeleton width={50} height={20} />
              </p>
            </div>
            <div className="size-btns">
              {["S", "M", "L", "XL", "XXL"].map((size, index) => (
                <Skeleton
                  key={index}
                  width={50}
                  height={30}
                  style={{ margin: "0 5px" }}
                />
              ))}
            </div>
            <div className="pt-2">
              <p className="item-size-text">
                <Skeleton width={80} height={20} />
              </p>
              <div className="flex gap-1 items-center pt-2">
                <Skeleton width={30} height={30} />
                <Skeleton width={50} height={30} />
                <Skeleton width={30} height={30} />
              </div>
              <p className="item-price">
              <Skeleton width={100} height={20} />
            </p>
              <button className="btn-add p-0 border-none">
                <Skeleton width={150} height={40} />
              </button>
            </div>
            
            </div>
          </>
        )}
         <div className="review-container">
              <Review productId={id} />
            </div>
      </div>
            <RecentlyViewedProducts />
    </div>
  );
};