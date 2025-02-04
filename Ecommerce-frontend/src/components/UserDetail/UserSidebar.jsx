import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaListAlt, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';


export const UserSidebar = ({ setSelectedPage }) => {
    const { authToken, logout, login } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(()=>{
      fetchUserDetails();
    },[])
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setUserDetails(response.data[0]); 
        // console.log(userDetails)
      } catch (err) {
        console.error("Error fetching user details:", err);
        
      }
    };
    return (
      <div className="bg-gray-100 p-4 w-60 rounded-md">
        <h2 className="text-xl font-semibold mb-2">{userDetails?.name || 'User'}</h2>
        <p className="text-sm text-gray-600 mb-4">Welcome to your account.</p>
        <hr className="text-sm text-gray-500 mb-4"/>
        <ul className="space-y-5">
          <li>
            <button
              onClick={() => setSelectedPage("profile-details")}
              className="flex items-center gap-3 user-sidebar-btn"
            >
              <FaUser className="user-sidebar-btn-icon" /> My Account
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedPage("orders")}
              className="flex items-center gap-3 user-sidebar-btn "
            >
              <FaListAlt className="user-sidebar-btn-icon" /> My Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedPage("wishlist")}
              className="flex items-center gap-3 user-sidebar-btn"
            >
              <FaHeart className="user-sidebar-btn-icon" /> Wishlist
            </button>
          </li>
          <li>
            
            
            {authToken ? (
                <>
                <Link
                onClick={logout}
                to="/login"
                className="flex items-center gap-3 user-sidebar-btn"
                >
                <FaSignOutAlt className="user-sidebar-btn-icon" /> Sign Out
                </Link>
                </>
              ) : (
                <>
                  <Link  to="/login" className="flex items-center gap-3 user-sidebar-btn"
                >
                <FaSignOutAlt className="user-sidebar-btn-icon" />Login</Link>
                </>
              )}
          </li>
        </ul>
      </div>
    );
  };
