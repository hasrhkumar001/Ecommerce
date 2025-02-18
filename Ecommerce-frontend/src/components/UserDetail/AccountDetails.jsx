import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wishlist from "../../pages/Wishlist";
import MyOrders from "../Order/MyOrders";
import UserDetails from "./UserDetails";

import { UserSidebar } from "./UserSidebar";


const AccountDetails = () => {
    const {page} = useParams();
    const [selectedPage, setSelectedPage] = useState(page || "MyAccount"); // Default page
    const authToken = localStorage.getItem("authToken");
    const navigate = useNavigate();
    
  
    useEffect(() => {
      if (!authToken) {
        navigate("/login");
      }
    }, [authToken, navigate]);

 

    // Dynamic rendering based on selectedPage
    const renderContent = () => {
      switch (selectedPage) {
        case "profile-details":
          return <UserDetails />;
        case "orders":
          return <MyOrders />;
        case "wishlist":
          return <Wishlist />;
       
        
        default:
          return <UserDetails />;
      }
    };
  
    return (
      <div className="userdetails-container container   flex items-start gap-3">
        {/* Sidebar */}
        <UserSidebar setSelectedPage={setSelectedPage} />
  
        {/* Main Content */}
        <div className="flex-1  rounded-md ">
          {renderContent()}
        </div>
      </div>
    );
  };
  


export default AccountDetails




  


