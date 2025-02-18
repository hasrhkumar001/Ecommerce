import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import empty_cart from "../assets/empty_cart_img.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast, { Toaster } from "react-hot-toast";
import { MdDeleteSweep } from "react-icons/md";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [pendingUpdates, setPendingUpdates] = useState({});

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const updateQuantity = async (id, delta) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    console.log(delta);

    setCartItems(updatedCartItems);

   

    try {
      // Make API call to update quantity in the database
      const response = await axios.put(
        `http://192.168.137.160:8081/api/cart/${id}`,
        {
          quantity: updatedCartItems.find((item) => item.id === id).quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to update quantity in the database.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  const handleRemoveAll = async () => {
    if (!window.confirm("Are you sure you want to remove all items?")) {
      return; // If user cancels, exit early
    }
  
    
    try {
      const response = await axios.delete(
        "http://192.168.137.160:8081/api/clear-cart",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      toast.success("All items removed successfully!");
    } catch (error) {
      console.error("Error removing items:", error);
      toast.error("Failed to remove items. Please try again.");
    } finally {
      
      fetchProducts();
    }
  };
  


  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://192.168.137.160:8081/api/cart", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCartItems(response.data.data || []);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`http://192.168.137.160:8081/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.product.discounted_price * item.quantity,
      0
    );
  };

  return (
    <div className="cart-wishlist-container  container">
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        {loading ? (
         
            <div className="   ">
            <h2 className="cart-heading mb-4">Your Cart</h2>
            <div className="flex flex-col md:flex-row gap-8">
            {/* Left Section */}
            <div className="w-full md:w-3/4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-2 text-left">
                      <Skeleton width={120} />
                    </th>
                    <th className="p-2">
                      <Skeleton width={50} />
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
                        <Skeleton width={64} height={64} />
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
                        <Skeleton width={50} />
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

            {/* Right Section */}
            <div className="w-full md:w-1/4">
              <div className=" p-4 bg-gray-100 rounded-lg">
                <p className="flex justify-between mb-2">
                  <span>
                    <Skeleton width={80} />
                  </span>
                  <span>
                    <Skeleton width={60} />
                  </span>
                </p>
                <p className="flex justify-between mb-2">
                  <span>
                    <Skeleton width={80} />
                  </span>
                  <span>
                    <Skeleton width={60} />
                  </span>
                </p>
                <hr className="my-2" />
                <p className="flex justify-between font-bold text-lg">
                  <span>
                    <Skeleton width={100} />
                  </span>
                  <span>
                    <Skeleton width={80} />
                  </span>
                </p>
                <button className="w-full mt-4">
                  <Skeleton width="100%" height={40} />
                </button>
              </div>
            </div>
          </div>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="">
            <h2 className="cart-heading mb-4">Your Cart</h2>
            <div className="flex flex-col items-start md:flex-row gap-8">
              <div className="w-full md:w-3/4">
                <table className="w-full border-collapse shadow">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="p-2 text-left">Product Details</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Quantity</th>
                      <th className="p-2">Subtotal</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2 flex items-center gap-4">
                          <Link to={`/product/${item.product.id}`}>
                            <img
                              src={`http://192.168.137.160:8081/storage/${item.product.images[0]?.image_path}`}
                              alt={item.product.name}
                              className="cart_item_image  rounded"
                            />
                          </Link>
                          <div>
                            <Link to={`/product/${item.product.id}`}>
                              <p className="font-semibold">{item.product.name}</p>
                            </Link>
                            <p className="text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          </div>
                        </td>
                        <td className="p-2 text-center">₹{item.product.discounted_price}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-gray-200 text-gray-600 rounded"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-gray-200 text-gray-600 rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          ₹{(item.product.discounted_price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <button
                    variant="danger" 
                    onClick={handleRemoveAll} 
                    disabled={loading} 
                    className="flex items-center gap-2 p-3 "
                  >
                    {loading ? <></> : <MdDeleteSweep size={20} />}
                    {loading ? "Removing..." : "Remove All"}
                  </button>
                </table>
              </div>
              <div className="w-full md:w-1/4">
                <div className=" p-4 bg-gray-100 rounded-lg">
                  <h2 className="font-bold text-lg mb-3 text-center">Cart Summary</h2>
                  <hr></hr>
                  <p className="flex justify-between my-2">
                    <span>Sub Total</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span className="text-gray-500">Free</span>
                  </p>
                  <hr className="my-2" />
                  <p className="flex justify-between font-bold text-md">
                    <span>Grand Total</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </p>
                  <Link to="/checkout">
                    <button className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-500">
                      Proceed To Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className=" m-3 ">
            <div className="flex items-center justify-center flex-col">
              <div className="empty-cart-img">
                <img src={empty_cart} alt="" className="w-[300]  rounded object-fit-cover" />
              </div>
              <div className="empty-cart-msg w-full flex flex-col justify-center items-center">
                <p className="text-4xl text-center font-semibold text-outerspace mt-5">
                  Your cart is empty and sad :(
                </p>
                <p className=" mt-5 text-gray italic">Add something to fill it!</p>
                <Link to="/" className="btn-continue">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;