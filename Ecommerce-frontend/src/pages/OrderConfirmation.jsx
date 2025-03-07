import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom"; 

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://192.168.137.160:8081/api/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrder(response.data || null);
        console.log(response.data);
      } catch (error) {
        setOrder(null);
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
        <h2 className="text-2xl font-semibold mt-3">Thank You for Your Order!</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Your order has been successfully placed.</p>

        {order ? (
          <>
            {/* Order Details */}
            <div className="mt-3 text-left border-t border-gray-300 dark:border-gray-700 pt-3">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Payment Method:</strong> {order.payment_method}</p>
              <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>

            {/* Shipping Details */}
            <div className="mt-3 text-left border-t border-gray-300 dark:border-gray-700 pt-3">
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              {order.shipping_detail ? (
                <>
                  <p>{order.shipping_detail.firstName} {order.shipping_detail.lastName}</p>
                  <p>
                    {order.shipping_detail.address}, {order.shipping_detail.city}, {order.shipping_detail.state}, 
                    {order.shipping_detail.postal_code}, {order.shipping_detail.countryName}
                  </p>
                  <p><strong>Phone:</strong> {order.shipping_detail.phone}</p>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No shipping details available.</p>
              )}
            </div>

            {/* User Information */}
            <div className="mt-3 text-left border-t border-gray-300 dark:border-gray-700 pt-3">
              <h3 className="text-lg font-semibold">User Information</h3>
              {order.user ? (
                <>
                  <p><strong>Name:</strong> {order.user.name}</p>
                  <p><strong>Email:</strong> {order.user.email}</p>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No user information available.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-red-500 mt-3">Loading...</p>
        )}

        {/* Continue Shopping Button */}
        <Link
          to="/"
          className="mt-5 border p-2 inline-block "
          onClick={() => window.scrollTo(0, 0)}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
