import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi"; // Trash icon
import { Link } from "react-router-dom";

const Checkout = () => {
  const [showForm, setShowForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    
    fetchCartItems();
    fetchAddresses();
  }, []);
  
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://192.168.137.160:8081/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        "http://192.168.137.160:8081/api/shipping-details",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setAddresses(response.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.product.discounted_price * item.quantity,
      0
    );
  };

  const handlePayNow = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const orderData = {
      shipping_address_id: selectedAddress,
      payment_method: paymentMethod,
      price: calculateSubtotal(),
      status: "Processing",
    };

    try {
      const response = await axios.post(
        "http://192.168.137.160:8081/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      alert("Order placed successfully!");
      console.log("Order Response:", response.data);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryName: "",
    companyName: "",
    address: "",
    houseNo: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First Name is required.";
    if (!formData.lastName) errors.lastName = "Last Name is required.";
    if (!formData.countryName) errors.countryName = "Country is required.";
    if (!formData.address) errors.address = "Address is required.";
    if (!formData. houseNo) errors. houseNo = "Apt, suite, house no is required.";
    if (!formData.city) errors.city = "City is required.";
    if (!formData.state) errors.state = "State is required.";
    if (!formData.postal_code) errors.postal_code = "Postal Code is required.";
    if (!formData.phone) errors.phone = "Phone is required.";
    if (formData.phone && !/^\+?[1-9][0-9]{7,14}$/.test(formData.phone))
      errors.phone = "Invalid phone number.";
    if (formData.postal_code && !/^\d{6}$/.test(formData.postal_code))
      errors.postal_code = "Invalid postal code.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://192.168.137.160:8081/api/shipping-details",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const newAddressId = response.data.id;
      setSelectedAddress(newAddressId);
      setFormSubmitted(true);
      setFormErrors({});
      setFormData({  // Reset form fields to their initial state
        firstName: "",
        lastName: "",
        countryName: "",
        companyName: "",
        address: "",
        houseNo: "",
        city: "",
        state: "",
        postal_code: "",
        phone: "",
      });
      
      alert("Shipping details submitted successfully!");
      fetchAddresses();
    } catch (error) {
      console.error("Error submitting shipping details:", error);
      alert("Failed to submit shipping details.");
    }
  };

  return (
    <div className=" container  checkout-container">
      <h1 className="text-2xl font-semibold mb-6">Check Out</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Billing Details */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          {addresses.map((item) => (
            <div key={item.id} className="mb-4 border-b">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`address_${item.id}`}
                  name="address"
                  value={item.id}
                  onClick={() => setShowForm(false)}
                  onChange={() => setSelectedAddress(item.id)}
                  className="mr-2"
                />
                <label htmlFor={`address_${item.id}`} className="text-gray-700 font-medium">
                  {item.houseNo} {item.address}
                </label>
              </div>
              <div className="text-sm text-gray-600  pl-5 p-3 rounded-lg">
                <p><strong>Name:</strong> {item.firstName} {item.lastName}</p>
                <p><strong>City:</strong> {item.city}</p>
                <p><strong>State:</strong> {item.state}</p>
                <p><strong>Postal Code:</strong> {item.postal_code}</p>
                <p><strong>Phone:</strong> {item.phone}</p>
              </div>
            </div>
          ))}
          <div className="mb-4">
            <input
              type="radio"
              id="newaddress"
              name="address"
              onClick={() => setShowForm(true)}
            />
            <label htmlFor="newaddress" className="ml-2">
              Add new address
            </label>
          </div>
          {showForm && (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 shadow rounded-lg"
              onSubmit={handleSubmit}
            >
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="countryName"
                  placeholder="Country / Region*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.countryName}
                  onChange={handleInputChange}
                />
                {formErrors.countryName && (
                  <p className="text-red-500 text-sm">{formErrors.countryName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name (optional)"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm">{formErrors.address}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="houseNo"
                  placeholder="Apt, suite, house no*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.houseNo}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {formErrors.city && (
                  <p className="text-red-500 text-sm">{formErrors.city}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="state"
                  placeholder="State*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                {formErrors.state && (
                  <p className="text-red-500 text-sm">{formErrors.state}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="postal_code"
                  placeholder="Postal Code*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                />
                {formErrors.postal_code && (
                  <p className="text-red-500 text-sm">{formErrors.postal_code}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone*"
                  className="p-3 border border-gray-300 rounded-md w-full"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm">{formErrors.phone}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white mt-4 py-2 px-4 rounded-md md:col-span-2 hover:bg-green-600 transition duration-300"
              >
                Submit
              </button>
            </form>
          )}
          
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Checkout Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{item.product.name} ({item.size}) x {item.quantity}</span>
                <span>₹{item.product.discounted_price * item.quantity}</span>
              </div>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Savings</span>
            <span>-₹0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>-₹0.00</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <div className="space-y-4">
          <div>
            <input
              type="radio"
              id="cod"
              name="payment"
              value="Cash on Delivery"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cod" className="ml-2">
              Cash on Delivery
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="credit"
              name="payment"
              value="Credit Card"
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled
            />
            <label htmlFor="credit" className="ml-2">
              Credit Card
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="paypal"
              name="payment"
              value="UPI"
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled
            />
            <label htmlFor="UPI" className="ml-2">
              UPI
            </label>
          </div>
        </div>
        <button
          onClick={handlePayNow}
          className="bg-blue-500 text-white mt-4 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Checkout;