import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi"; // Trash icon
import { Link } from "react-router-dom";
import axios from "axios";
import empty_cart from '../../assets/empty_cart_img.svg';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to update quantity
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
        `http://127.0.0.1:8000/api/cart/${id}`,
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        console.log(response.data.data); // Log actual data
        setCartItems(response.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  };

  // Function to delete item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length > 0 ? (
        <div>
          <h2 className="text-lg font-bold mb-4">Add To Cart</h2>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cart Table */}
            <div className="w-full md:w-3/4">
              <table className="w-full border-collapse">
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
                    <tr key={item.id} className="border-b hover:bg-gray-100 transition duration-200">
                      <td className="p-2 flex items-center gap-4">
                        <Link to={`/product/${item.product.id}`}>
                          <img
                            src={`http://127.0.0.1:8000/storage/${item.product.images[0].image_path}`}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </Link>
                        <div>
                          <Link to={`/product/${item.product.id}`}>
                            <p className="font-semibold">{item.product.name}</p>
                          </Link>
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                        </div>
                      </td>
                      <td className="p-2 text-center">₹{item.product.price}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
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
              </table>
            </div>

            {/* Summary Section */}
            <div className="w-full md:w-1/4">
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="flex justify-between mb-2">
                  <span>Sub Total</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </p>
                <p className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>₹0</span>
                </p>
                <hr className="my-2" />
                <p className="flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </p>
                <Link to={"/checkout"}>
                  <button className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-500">
                    Proceed To Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <img src={empty_cart} alt="Empty Cart" className="mx-auto w-64" />
          <p className="text-lg font-semibold">Your cart is empty!</p>
          <Link to="/" className="text-blue-600 underline">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartItems;
