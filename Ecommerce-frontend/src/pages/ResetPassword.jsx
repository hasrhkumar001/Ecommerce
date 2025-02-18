import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import login_img from "../assets/login.jpg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    if (authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Password confirmation is required";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.137.160:8081/api/reset-password",
        {
          email: searchParams.get("email"),
          token: searchParams.get("token"),
          password,
          password_confirmation: passwordConfirmation,
        }
      );

      setMessage(response.data.message);
      setErrors({});
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          // Validation errors from the API
          setErrors(error.response.data.errors || {});
        } else {
          // Generic error message
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
          <img src={login_img} alt="Reset Password" />
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Reset Your Password</p>

          {/* Display generic message */}
          {message && (
            <p className="text-green-600 text-center text-sm font-medium mt-2">{message}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
              <input
                className={`text-gray-700 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: null }); // Clear password error when typing
                }}
                value={password}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                className={`text-gray-700 border ${
                  errors.passwordConfirmation ? "border-red-500" : "border-gray-300"
                } rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                type="password"
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  setErrors({ ...errors, passwordConfirmation: null }); // Clear confirmation error when typing
                }}
                value={passwordConfirmation}
                required
              />
              {errors.passwordConfirmation && (
                <p className="text-red-500 text-xs mt-1">{errors.passwordConfirmation}</p>
              )}
            </div>

            <div className="mt-8">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;