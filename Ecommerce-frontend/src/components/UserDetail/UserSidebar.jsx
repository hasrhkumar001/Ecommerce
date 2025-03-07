import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaListAlt, FaHeart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";

  export const UserSidebar = ({ setSelectedPage }) => {
    const { logout } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState(null);
    const authToken = localStorage.getItem("authToken");
    const {page} = useParams();
    const [activePage, setActivePage] = useState(page); // Track active button

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("http://192.168.137.160:8081/api/users", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUserDetails(response.data[0]);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 w-60 rounded-md">
      <h2 className="text-xl font-semibold mb-2">{userDetails?.name || "User"}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">Welcome to your account.</p>
      <hr className="text-sm text-gray-500 mb-4" />
      <ul className="space-y-3">
        {[
          { id: "profile-details", label: "My Account", icon: <FaUser /> },
          { id: "orders", label: "My Orders", icon: <FaListAlt /> },
          { id: "wishlist", label: "Wishlist", icon: <FaHeart /> },
        ].map(({ id, label, icon }) => (
          <li key={id}>
            <Link to={`/account/${id}`}
              onClick={() => {
               
                setActivePage(id); // Set active button
              }}
              className={`flex items-center gap-3 user-sidebar-btn px-2 py-2 rounded-md w-full text-left 
                ${
                  activePage === id
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
            >
              {icon} {label}
            </Link>
          </li>
        ))}

        <li>
          {authToken ? (
            <Link
              onClick={logout}
              to="/login"
              className="flex items-center gap-3 user-sidebar-btn  text-dark px-2 py-2 rounded-md"
            >
              <FaSignOutAlt /> Sign Out
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 user-sidebar-btn  text-dark px-2 py-2 rounded-md"
            >
              <FaSignOutAlt /> Login
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};
