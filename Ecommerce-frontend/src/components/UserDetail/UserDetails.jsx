import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    countryName: "",
    address: "",
    houseNo: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      const response = await axios.get("http://127.0.0.1:8000/api/users", {
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
        "http://127.0.0.1:8000/api/shipping-details",
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
      await axios.delete(`http://127.0.0.1:8000/api/shipping-details/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/shipping-details",
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
        address: "",
        houseNo: "",
        city: "",
        state: "",
        postal_code: "",
        phone: "",
      });
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const handleUpdateUserProfile = async () => {
    try {
      await axios.patch(
        "http://127.0.0.1:8000/api/profile",
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
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
          <h2 className="text-xl font-semibold mb-4">Addresses</h2>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex justify-between items-center p-4 border-b">
              <div>
                <Skeleton height={20} width="30%" />
                <Skeleton height={20} width="50%" className="mt-1" />
                <Skeleton height={20} width="80%" className="mt-1" />
              </div>
              <Skeleton circle height={24} width={24} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      {error && <div className="text-red-500">{error}</div>}
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* User Profile */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={userDetails?.name || ""}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              className="block w-full p-2 border rounded my-2"
              placeholder="Name"
            />
            <input
              type="text"
              value={userDetails?.email || ""}
              readOnly
              className="block w-full p-2 border rounded my-2 bg-gray-100"
              placeholder="Email"
            />
            <input
              type="text"
              value={userDetails?.phone || ""}
              onChange={(e) =>
                setUserDetails({ ...userDetails, phone: e.target.value })
              }
              className="block w-full p-2 border rounded my-2"
              placeholder="Phone"
            />
            <input
              type="text"
          
              onChange={(e) =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
              className="block w-full p-2 border rounded my-2"
              placeholder="Password"
            />
            <button
              onClick={handleUpdateUserProfile}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 flex items-center"
            >
              <FiSave className="mr-2" /> Save
            </button>
          </div>
        ) : (
          <div>
            <p>Name: {userDetails?.name}</p>
            <p>Email: {userDetails?.email}</p>
            <p>Phone: {userDetails?.phone}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2 flex items-center"
            >
              <FiEdit className="mr-2" /> Edit
            </button>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Addresses</h2>
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex justify-between items-center p-4 border-b"
          >
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
        ))}

        {/* Add Address */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-3 border rounded"
              value={newAddress.firstName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-3 border rounded"
              value={newAddress.lastName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, lastName: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="Country"
            className="block w-full p-3 border rounded my-2"
            value={newAddress.countryName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, countryName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Address"
            className="block w-full p-3 border rounded my-2"
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress({ ...newAddress, address: e.target.value })
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="City"
              className="p-3 border rounded"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="State"
              className="p-3 border rounded"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="p-3 border rounded"
              value={newAddress.postal_code}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postal_code: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="Phone"
            className="block w-full p-3 border rounded my-2"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phone: e.target.value })
            }
          />
          <button
            onClick={handleAddAddress}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
