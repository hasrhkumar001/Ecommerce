import React, { useState,useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import forgot_password_img from "../assets/login.jpg"; // Add an appropriate image

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const navigate = useNavigate();


  useEffect(() => {
    if (authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  // Validate email
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.137.160:8081/api/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      setErrors({});
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors || {});
        } else if (error.response.status === 404) {
          setMessage("User with this email does not exist.");
        } else {
          setMessage("An error occurred. Please try again.");
        }
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center checkout-container w-full px-5 sm:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div className="hidden md:block lg:w-1/2 m-auto">
          <img src={forgot_password_img} alt="Forgot Password" />
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Forgot Password?</p>
          <p className="text-sm text-gray-500 text-center mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Display message */}
          {message && (
            <p className={`text-center text-sm font-medium mt-4 ${
              message.includes("error") ? "text-red-600" : "text-green-600"
            }`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className={`text-gray-700 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: null });
                }}
                value={email}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mt-8">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                Send Reset Link
              </button>
            </div>

            <div className="mt-4 flex items-center w-full text-center">
              <a href="#" className="text-xs text-gray-500 capitalize text-center w-full">
                Remember your password?{" "}
                <span className="text-blue-700">
                  <Link to="/login">Login</Link>
                </span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;