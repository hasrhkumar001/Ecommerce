import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import login_img from "../assets/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", { email, password });
      if (response.status === 200) {
        const { token } = response.data;
        login(token);
        console.log("Login successful");
        navigate("/"); // Redirect to the home page
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Validation errors from the API
        setErrors(error.response.data.errors || {});
      } else {
        // Generic error message
        setMessage("Invalid credentials. Please try again.");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/google", {
        token: credentialResponse.credential,
      });
      const { token, user } = response.data;
      login(token); // Update auth context
  
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login error");
  };

  return (
    <div className="flex items-center justify-center checkout-container w-full px-5 sm:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div className="hidden md:block lg:w-1/2 m-auto">
          <img src={login_img} alt="Login" />
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>

          {/* Display generic error message */}
          {message && (
            <p className="text-red-600 text-center text-sm font-medium mt-2">{message}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                className={`text-gray-700 border ${errors.email ? "border-red-500" : "border-gray-300"} 
                  rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: null }); // Clear email error when typing
                }}
                value={email}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                className={`text-gray-700 border ${errors.password ? "border-red-500" : "border-gray-300"} 
                  rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: null }); // Clear password error when typing
                }}
                value={password}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div className="mt-8">
              <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                Login
              </button>
            </div>
            <div className="flex gap-1 justify-center mt-3">
              <p className="text-center fw-bold mx-2">or</p>
            </div>
            <div className="mt-3">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </div>

            <div className="mt-4 flex items-center w-full text-center">
              <a href="#" className="text-xs text-gray-500 capitalize text-center w-full">
                Don&apos;t have an account yet?{" "}
                <span className="text-blue-700">
                  <Link to="/signup"> Sign Up</Link>
                </span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
