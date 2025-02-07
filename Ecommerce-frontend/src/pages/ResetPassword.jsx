import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setError("");
    } catch (err) {
      setError(err.response.data.errors);
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{JSON.stringify(error)}</p>}
        <input
          type="password"
          className="block w-full p-2 border rounded my-2"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="block w-full p-2 border rounded my-2"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
