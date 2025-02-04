import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import empty_wishlist from "../assets/empty-wishlist-image.png";

const Wishlist = () => {
    
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [stock,setStock] = useState("Out of stock")

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  

      
        const fetchWishlistProducts = async () => {
          setLoading(true);
          try {
            const response = await axios.get("http://127.0.0.1:8000/api/wishlists",{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            const wishlistData = (response.data || []).map((item) => ({
              ...item,
              stock: item.product?.variants?.length > 0 ? "In stock" : "Out of stock",
            }));

            setWishlistItems(wishlistData || []);

        // Ensure product and variants exist before accessing
        const hasVariants = wishlistItems.some(
          (item) => item.product && item.product.variants && item.product.variants.length > 0
        );

        if (hasVariants) {
          setStock("In  stock");
        }
            console.log(response.data);
            // console.log(wishlistItems);
          
          } catch (error) {
            console.error("Error fetching products:", error);
        
          }  finally {
            setLoading(false);
          }
        };
        
        useEffect(() => {
          fetchWishlistProducts();
        }, []);

        const handleRemove = async (id) => {
          try {
            await axios.delete(`http://127.0.0.1:8000/api/wishlists/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            });
      
            // Call fetch function to refresh the wishlist
            fetchWishlistProducts();
          } catch (error) {
            console.error("Error removing product:", error);
          }
        };

 

    

    return (
      <div>    
           {loading ? (
         
         <div className="    container">
            <h2 className="cart-heading mb-4">Your Wishlist</h2>
            <div className="">
            {/* Left Section */}
            <div className="w-full ">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-2 text-left">
                      <Skeleton width={120} />
                    </th>
                    
                    <th className="p-2">
                      <Skeleton width={70} />
                    </th>
                    <th className="p-2">
                      <Skeleton width={90} />
                    </th>
                    <th className="p-2">
                      <Skeleton width={60} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 flex items-center gap-4">
                        <Skeleton width={100} height={100} />
                        <div>
                          <p>
                            <Skeleton width={150} />
                          </p>
                          <p>
                            <Skeleton width={100} />
                          </p>
                        </div>
                      </td>
                      
                      <td className="p-2 text-center">
                        <Skeleton width={90} />
                      </td>
                      <td className="p-2 text-center">
                        <Skeleton width={80} />
                      </td>
                      <td className="p-2 text-center">
                        <Skeleton width={30} height={30} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>

         
       </div>
       </div>
     ) : wishlistItems.length > 0 ? 
            (
              <div className=" container">

                <h2 className="cart-heading mb-4">Your Wishlist</h2>
                <div className="flex flex-col items-start md:flex-row gap-8">
                  <div className="w-full ">
                    <table className="w-full border-collapse shadow">
                      <thead>
                        <tr className="bg-gray-800 text-white">
                          <th className="p-2 text-left">Product Details</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Stock Status</th>                         
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlistItems.map(item  => (
                          <tr key={item.id} className="border-b hover:bg-gray-100">
                            <td className="p-2 flex items-center gap-4">
                              <Link to={`/product/${item.product.id}`}>
                                <img
                                  src={`http://127.0.0.1:8000/storage/${item.product.images[0]?.image_path}`}
                                  alt={item.product.name}
                                  className="cart_item_image  rounded"
                                />
                              </Link>
                              <div>
                                <Link to={`/product/${item.product.id}`}>
                                  <p className="font-semibold">{item.product.brand.name}</p>
                                </Link>
                                <p className="text-sm text-gray-500">
                                {item.product.name}
                                </p>
                                
                              </div>
                            </td>
                            <td className="p-2 text-center">₹{item.product.discounted_price}</td>
                            
                            <td className="p-2 text-center">
                              {item.stock }
                            </td>
                            <td className="p-2 text-center">
                              <button className="btn remove" onClick={() => handleRemove(item.product.id)}>
                                  <FiTrash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  </div>
                
                
        </div> ):
        (<div className="  container">
              <div className="empty-cart-img">
                <img src={empty_wishlist}  alt="" className="object-fit-cover empty-wishlist-image" />
              </div>
              <div className="empty-cart-msg w-full flex flex-col justify-center items-center">
                <p className="text-4xl text-center font-semibold text-outerspace mt-5">
                  Your wishlist is empty
                </p>
                <p className="mt-5 text-gray italic">Save items that you like in your wishlist. review them anything and easily move them to the bag.</p>
                <Link to="/" className="btn-continue">
                  Shop Now
                </Link>
              </div>
            </div>)}
        </div>
   
    )};

export default Wishlist;
