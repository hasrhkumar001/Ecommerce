import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    
    fetchCartItems();
    fetchWishlistProducts();
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    fetchCartItems();
    fetchWishlistProducts();
  };
  const fetchWishlistProducts = async () => {
   
    try {
      const response = await axios.get("http://192.168.137.160:8081/api/wishlists",{
          headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
      });
   
      
      const wishlistData = (response.data || []);

      setWishlistItems(wishlistData );


    } catch (error) {
      console.error("Error fetching products:", error);
  
    } 
  };
  
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://192.168.137.160:8081/api/cart", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const items = response.data.data || [];
      setCartItems(items);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCartItems([]);
    setWishlistItems([]);
    setAuthToken(null);
    
  };

  return (
    <AuthContext.Provider value={{ authToken, logout, login,wishlistItems,setWishlistItems,fetchWishlistProducts,fetchCartItems,setCartItems,cartItems}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
