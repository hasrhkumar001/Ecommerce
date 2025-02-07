import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiSave, FiPlus } from "react-icons/fi";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import toast, { Toaster } from "react-hot-toast";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    fetchUserDetails();
    fetchAddresses();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("http://192.168.137.160:8081/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setUserDetails(response.data[0]);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details.");
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
      setAddresses(response.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`http://192.168.137.160:8081/api/shipping-details/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setAddresses(addresses.filter((address) => address.id !== id));
      toast.error("Address deleted successfully.");
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newAddress.firstName) errors.firstName = "First Name is required.";
    if (!newAddress.lastName) errors.lastName = "Last Name is required.";
    if (!newAddress.countryName) errors.countryName = "Country is required.";
    if (!newAddress.address) errors.address = "Address is required.";
    if (!newAddress.houseNo) errors.houseNo = "House No is required.";
    if (!newAddress.city) errors.city = "City is required.";
    if (!newAddress.state) errors.state = "State is required.";
    if (!newAddress.postal_code) errors.postal_code = "Postal Code is required.";
    if (!newAddress.phone) errors.phone = "Phone is required.";
    if (newAddress.phone && !/^\+?[1-9][0-9]{7,14}$/.test(newAddress.phone))
      errors.phone = "Invalid phone number.";
    if (newAddress.postal_code && !/^\d{6}$/.test(newAddress.postal_code))
      errors.postal_code = "Invalid postal code.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://192.168.137.160:8081/api/shipping-details",
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setAddresses([...addresses, response.data]);
      setNewAddress({
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
      toast.success("Address added successfully.");
      setShowAddressForm(false);
      setError("");
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const handleUpdateUserProfile = async () => {
    const errors = {};

  // Validate Name
  if (!userDetails?.name.trim()) {
    errors.username = "Name is required.";
  }

  // Validate Phone
  if (!userDetails?.phone.trim()) {
    errors.userphone = "Phone number is required.";
  } else if (!/^\+?[1-9][0-9]{7,14}$/.test(userDetails.phone)) {
    errors.userphone = "Invalid phone number. Must be 10 digits.";
  }

  // Validate Password (if present)
  if (userDetails?.password && userDetails.password.length < 6) {
    errors.userpassword = "Password must be at least 6 characters long.";
  }

  setFormErrors(errors);

  // If there are validation errors, return early
  if (Object.keys(errors).length > 0) return;
    try {
      await axios.patch(
        "http://192.168.137.160:8081/api/profile",
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <Skeleton height={25} width="70%" />
          <Skeleton height={25} width="50%" className="mt-2" />
          <Skeleton height={25} width="60%" className="mt-2" />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Addresses</h2>
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex justify-between items-center p-4 border-b">
              <div>
                <Skeleton height={25} width="30%" />
                <Skeleton height={25} width="50%" className="mt-1" />
                <Skeleton height={25} width="80%" className="mt-1" />
              </div>
              <Skeleton circle height={24} width={24} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* User Profile */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-6">
      <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000, // Default duration for all toasts
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Profile</h2>
        <div className="space-y-4">
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-600 font-medium">Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={userDetails?.name || ""}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your name"
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm">{formErrors.username}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-600 font-medium">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="email"
                  value={userDetails?.email || ""}
                  readOnly
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-600 font-medium">Phone</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="phone"
                value={userDetails?.phone || ""}
                onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Phone number"
              />
            </div>
            {formErrors.userphone && (
                  <p className="text-red-500 text-sm">{formErrors.userphone}</p>
                )}
          </div>

          {/* Address Field */}
          <div className="flex flex-col">
            <label htmlFor="address" className="text-gray-600 font-medium">Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="address"
                value={userDetails?.address || ""}
                onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your address"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-600 font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="New password"
              />
              {formErrors.userpassword && (
                  <p className="text-red-500 text-sm">{formErrors.userpassword}</p>
                )}
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdateUserProfile}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center text-lg font-semibold hover:bg-blue-700 transition-all"
          >
            <FiSave className="mr-2" /> Update Profile
          </button>
        </div>
      </div>

      {/* Shipping Addresses */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Shipping Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-gray-500">No address found.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p>
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.phone}</p>
                <p>
                  {address.address}, {address.city}, {address.state},{" "}
                  {address.postal_code}, {address.countryName}
                </p>
              </div>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash />
              </button>
            </div>
          ))
        )}

        {/* Add Address Button */}
        <button
          onClick={() => setShowAddressForm(!showAddressForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 flex items-center justify-end"
        >
          <FiPlus className="mr-2" /> Add New Address
        </button>

        {/* Add Address Form */}
        {showAddressForm && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Add New Address</h3>
            {error && <div className="text-red-500">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 border rounded"
                  value={newAddress.firstName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, firstName: e.target.value })
                  }
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 border rounded"
                  value={newAddress.lastName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, lastName: e.target.value })
                  }
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Company Name (optional)"
                className="w-full p-3 border rounded my-2"
                value={newAddress.companyName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, companyName: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Country"
                className="w-full p-3 border rounded my-2"
                value={newAddress.countryName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, countryName: e.target.value })
                }
              />
              {formErrors.countryName && (
                <p className="text-red-500 text-sm">{formErrors.countryName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="House No"
                className="w-full p-3 border rounded my-2"
                value={newAddress.houseNo}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, houseNo: e.target.value })
                }
              />
              {formErrors.houseNo && (
                <p className="text-red-500 text-sm">{formErrors.houseNo}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border rounded my-2"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm">{formErrors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="City"
                  className="w-full p-3 border rounded"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                {formErrors.city && (
                  <p className="text-red-500 text-sm">{formErrors.city}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="State"
                  className="w-full p-3 border rounded"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                {formErrors.state && (
                  <p className="text-red-500 text-sm">{formErrors.state}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="w-full p-3 border rounded"
                  value={newAddress.postal_code}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postal_code: e.target.value })
                  }
                />
                {formErrors.postal_code && (
                  <p className="text-red-500 text-sm">{formErrors.postal_code}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Phone"
                className="w-full p-3 border rounded my-2"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm">{formErrors.phone}</p>
              )}
            </div>
            <button
              onClick={handleAddAddress}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;