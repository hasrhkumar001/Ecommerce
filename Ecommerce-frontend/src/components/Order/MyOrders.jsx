import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrders(response.data || []);
        console.log(response.data);
      } catch (error) {
        setError("Error fetching order details. Please try again.");
        console.error("Error fetching order details:", error);
      }finally{
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    switch (activeTab) {
      case "Active":
        return orders.filter((order) =>
          ["Shipped", "Shipping", "Processing"].includes(order.status)
        );
      case "Cancelled":
        return orders.filter((order) => order.status === "Cancelled");
      case "Completed":
        return orders.filter((order) => order.status === "Delivered");
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container ">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b mb-6">
        {["Active", "Cancelled", "Completed"].map((tab) => (
          <button
            key={tab}
            className={`text-lg pb-2 ${
              activeTab === tab
                ? "border-b-2 border-black font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {isLoading ? (<>
        {[1, 2].map((_, index) => (
      <div className="border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton width={100} height={20} />
          <Skeleton width={150} height={15} style={{ marginTop: '8px' }} />
        </div>
        <div>
          <Skeleton width={120} height={15} />
          <Skeleton width={120} height={15} style={{ marginTop: '8px' }} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        <Skeleton width={70} height={15} />
        <Skeleton width={100} height={15} />
        <Skeleton width={50} height={15} />
        <Skeleton width={70} height={15} />
        <Skeleton width={120} height={15} />
      </div>
      <Skeleton width={120} height={36} />
    </div>))}
    </>):
    (<>
     {error && <p className="text-red-500">{error}</p>}
      {!error && filteredOrders.length === 0 && (
        <p className="text-gray-500">No orders found in this category.</p>
      )}

      {filteredOrders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold">Order no: #00{order.id}</p>
              <p className="text-sm text-gray-500">
                Order Date: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Order Status: <span className="font-medium">{order.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                Method: <span className="font-medium">{order.payment_method}</span>
              </p>
            </div>
            
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <p>Country: {order.shipping_detail.countryName}</p>
                <p>State: {order.shipping_detail.state}</p>
                <p>City: {order.shipping_detail.city}</p>
                <p>Zip Code: {order.shipping_detail.postal_code}</p>
                <p>Street Address: {order.shipping_detail.address}</p>
              </div>

          <button
            className="view-details-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleViewDetails(order)}
          >
            View Details
          </button>
        </div>
      ))}

      {/* Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Shipping Details:</h3>
              <p className="text-sm">
                {selectedOrder.shipping_detail.firstName}{" "}
                {selectedOrder.shipping_detail.lastName}
              </p>
              <p className="text-sm">
                {selectedOrder.shipping_detail.address},{" "}
                {selectedOrder.shipping_detail.city},{" "}
                {selectedOrder.shipping_detail.state},{" "}
                {selectedOrder.shipping_detail.postal_code},{" "}
                {selectedOrder.shipping_detail.countryName}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Products:</h3>
              {selectedOrder.order_details.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-4 mb-4"
                >
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.product.images[0]?.image_path}`}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-md"
                  />
                  <div>
                    <p className="font-medium">
                      {item.product.brand.name} {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}, Size: {item.size}
                    </p>
                    {/* <p className="text-sm text-gray-500">
                      Price: ${item.product.price.toFixed(2)}
                    </p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>)}

      
     
    </div>
  );
};

export default MyOrders;
