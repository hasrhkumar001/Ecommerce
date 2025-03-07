import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../../assets/logo.png";

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
        const response = await axios.get("http://192.168.137.160:8081/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrders(response.data || []);
        console.log(response.data);
      } catch (error) {
        setOrders( []);
       
        console.error("Error fetching order details:", error);
      }finally{
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadInvoice = () => {
    const invoiceElement = document.getElementById("invoice-modal");
    if (!invoiceElement) return;

    // Select the scrollable container
    const scrollableContainer = document.querySelector(".overflow-x-auto");

    // Backup original styles
    const originalStyle = scrollableContainer?.style.cssText;

    // Remove overflow styles before capturing
    if (scrollableContainer) {
        scrollableContainer.style.overflow = "visible";
        scrollableContainer.style.maxHeight = "none";
    }

    // Hide excluded elements
    document.querySelectorAll(".exclude-from-pdf").forEach(el => el.style.display = "none");

    html2canvas(invoiceElement, { 
        scale: 2,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: invoiceElement.scrollHeight // Capture full content
    }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > 297) {  // If content overflows one page
            let position = 0;
            while (position < imgHeight) {
                pdf.addImage(imgData, "PNG", 0, position * -1, imgWidth, imgHeight);
                position += 297;
                if (position < imgHeight) pdf.addPage();
            }
        } else {
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }

        pdf.save(`invoice_${selectedOrder.id}.pdf`);

        // Restore excluded elements after capturing
        document.querySelectorAll(".exclude-from-pdf").forEach(el => el.style.display = "flex");

        // Restore original styles after PDF generation
        if (scrollableContainer) {
            scrollableContainer.style.cssText = originalStyle; // Restore styles
        }
    });
};


  
  const getFilteredOrders = () => {
    // console.log(orders);
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
    console.log(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };
  const handleCancelOrder = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
  
    try {
      const response = await axios.post(
        `http://192.168.137.160:8081/api/orders/cancel/${order.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === order.id ? { ...o, status: "Cancelled" } : o
          )
        );
        alert("Order cancelled successfully!");
      } else {
        alert("Failed to cancel order. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while cancelling the order.");
    }
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
              <p className="font-semibold mb-4">Order id: #{order.id}</p>
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
            Address: {" "}
          {order.shipping_detail.address},{" "}
                {order.shipping_detail.city},{" "}
                {order.shipping_detail.state},{" "}
                {order.shipping_detail.postal_code},{" "}
                {order.shipping_detail.countryName}
              </div>
             <div><p className="mb-4"> Products:</p> {" "}
             { order.order_details.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b pb-4 mb-4">
                    <img
                      src={`http://192.168.137.160:8081/storage/${item.product?.images[0]?.image_path}`}
                      alt={item.product?.name || "Product Image"}
                      className="w-12 h-12 rounded-md"
                    />
                    <div>
                      <p className="font-medium">
                        {item.product?.brand?.name || "Unknown Brand"} {item.product?.name || "Unknown Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}, Size: {item.size}
                      </p>
                    </div>
                  </div>
                ))}
                </div>
          <div class="flex justify-end gap-3  ">
          <button
            className="view-details-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleViewDetails(order)}
          >
            Invoice
          </button>
          {order.status !=="Cancelled" && order.status !== "Delivered" ? <button
            className="view-details-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => handleCancelOrder(order)}
          >
            Cancel

          </button> : <></> }
          
          </div>
        </div>
      ))}
{selectedOrder && (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto"
    onClick={closeModal}
  >
    <div 
      className="max-w-3xl w-full bg-white rounded-lg shadow-xl my-6 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      id="invoice-modal"
    >
      {/* Header with logo and company info */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={Logo}
              alt="company-logo"
              height="40"
              width="40"
              className="h-10 w-10"
            />
            <h2 className="text-2xl font-bold text-gray-800">UrbanAura</h2>
          </div>
          <div className="text-right">
            <p className="text-gray-600">info@urbanaura.com</p>
            <p className="text-gray-600 mt-1">+91-9879879870</p>
          </div>
        </div>
      </div>

      {/* Customer and invoice details */}
      <div className="px-6 py-5 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="font-semibold text-gray-700 mb-2">Bill to:</h3>
            <p className="text-gray-600">
              {selectedOrder.shipping_detail.firstName}{" "}
              {selectedOrder.shipping_detail.lastName}
            </p>
            <p className="text-gray-600 max-w-xs">
              {selectedOrder.shipping_detail.address},{" "}
              {selectedOrder.shipping_detail.city},{" "}
              {selectedOrder.shipping_detail.state},{" "}
              {selectedOrder.shipping_detail.postal_code},{" "}
              {selectedOrder.shipping_detail.countryName}
            </p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-gray-700 mb-2">Invoice Details:</h3>
            <p className="text-gray-600">
              Invoice #: <span className="font-medium">INV-{selectedOrder.id}</span>
            </p>
            <p className="text-gray-600">
              Date: <span className="font-medium">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Order details table */}
      <div className="px-6 py-4">
        <div className="overflow-x-auto" style={{ maxHeight: "150px", overflowY: "auto" }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedOrder.order_details?.length > 0 ? (
                selectedOrder.order_details.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="font-medium">{item.product?.brand?.name || "Unknown Brand"}</div>
                      <div className="text-gray-600">{item.product?.name || "Unknown Product"}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">₹{item.product.discounted_price}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-700">
                      ₹{(item.product.discounted_price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No items in this order</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary and totals */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-end">
          <div className="w-full md:w-64">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-800">₹{selectedOrder.price}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-800">₹0.00</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-gray-800">₹0.00</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-semibold border-t border-gray-300 mt-2 pt-2">
              <span className="text-gray-800">Total</span>
              <span className="text-gray-800">₹{selectedOrder.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 text-center text-gray-600 text-sm bg-gray-50">
        Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client portal.
      </div>

      {/* Action buttons */}
      <div className="exclude-from-pdf flex justify-end p-6">
  <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
  <button onClick={handleDownloadInvoice} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">Download</button>
</div>
    </div>
  </div>
)}
    
    </>)}

      
     
    </div>
  );
};

export default MyOrders;
