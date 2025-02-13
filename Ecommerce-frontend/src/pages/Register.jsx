import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signup_img from "../assets/signup.jpg";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const register = (token) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
    };

    useEffect(() => {
        if (authToken) {
            navigate("/");
        }
    }, [authToken, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!name) {
            newErrors.name = 'Name is required';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!address) {
            newErrors.address = 'Address is required';
        }

        if (!phoneNo) {
            newErrors.phoneNo = 'Phone number is required';
        } else if (!/^\d{10}$/.test(phoneNo)) {
            newErrors.phoneNo = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await axios.post('http://192.168.137.160:8081/api/signup', { email, password, name, address, phoneNo })
                .then((res) => {
                    if (res.status === 200) {
                        const { token } = res.data;
                        register(token);
                        console.log('Signup successful');
                        navigate('/'); // Redirect to the home page
                    } else {
                        console.log('Registration failed. Please try again.');
                        setMessage('Registration failed. Please try again.');
                    }
                })
                .catch((error) => {
                  if (error.response && error.response.status === 422) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "User already exists. Try logging in.",
                    }));
                } else {
                    setMessage('An error occurred. Please try again.');
                }
                });
        } catch (error) {
            console.error('There was a signup error!', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center checkout-container w-full px-5 sm:px-0">
            <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
                <div className="hidden md:block lg:w-1/2 m-auto">
                    <img src={signup_img} alt="" srcSet="" />
                </div>
                <div className="w-full p-8 lg:w-1/2">
                    <p className="text-xl text-gray-600 text-center">Signup</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                className={`text-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                                type="text" onChange={(e) => { setName(e.target.value); }} value={name}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email Address
                            </label>
                            <input
                                className={`text-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                                type="email" onChange={(e) => { setEmail(e.target.value); }} value={email}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                        </div>
                        <div className="mt-4 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                            </div>
                            <input
                                className={`text-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                                type="password" onChange={(e) => { setPassword(e.target.value); }} value={password}
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                        </div>
                        <div className="mt-4 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mobile No.
                                </label>
                            </div>
                            <input
                                className={`text-gray-700 border ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'} rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                                type="tel" onChange={(e) => { setPhoneNo(e.target.value); }} value={phoneNo}
                                required
                            />
                            {errors.phoneNo && <p className="text-red-500 text-xs italic">{errors.phoneNo}</p>}
                        </div>
                        <div className="mt-4 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Address
                                </label>
                            </div>
                            <input
                                className={`text-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700`}
                                type="text" onChange={(e) => { setAddress(e.target.value); }} value={address}
                                required
                            />
                            {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
                        </div>
                        <div className="mt-8">
                            <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                                Sign up
                            </button>
                        </div>
                        <div className="mt-4 flex items-center w-full text-center">
                            <a
                                href="#"
                                className="text-xs text-gray-500 capitalize text-center w-full"
                            >
                                Already have an account?
                                <span className="text-blue-700"><Link to="/login"> Login</Link></span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;