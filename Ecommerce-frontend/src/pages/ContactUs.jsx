import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors

    let formValid = true;
    let validationErrors = {};

    // Name validation
    if (!formData.name) {
      formValid = false;
      validationErrors.name = "Name is required.";
    }

    // Email validation
    if (!formData.email) {
      formValid = false;
      validationErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formValid = false;
      validationErrors.email = "Please enter a valid email.";
    }

    // Message validation
    if (!formData.message) {
      formValid = false;
      validationErrors.message = "Message is required.";
    } else if (formData.message.length < 10) {
      formValid = false;
      validationErrors.message = "Message should be at least 10 characters long.";
    }

    if (formValid) {
      toast.success("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } else {
      Object.values(validationErrors).forEach((error) => toast.error(error));
    }

    setErrors(validationErrors);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <main className="container py-12">
      <div className="mx-auto px-6">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--toast-bg, #363636)",
              color: "var(--toast-color, #fff)",
            },
          }}
        />

        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out to us for inquiries, support, or just to say hello.
          </p>
        </section>

        {/* Contact Information */}
        <section className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: <FaPhone className="text-3xl text-green-600 mx-auto mb-3" />, label: "Phone", value: "+1 (123) 456-7890" },
            { icon: <FaEnvelope className="text-3xl text-blue-600 mx-auto mb-3" />, label: "Email", value: "support@example.com" },
            { icon: <FaMapMarkerAlt className="text-3xl text-red-600 mx-auto mb-3" />, label: "Location", value: "123 Main Street, City, Country" },
          ].map((item, index) => (
            <div key={index} className="p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
              {item.icon}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.label}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Contact Form */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white text-center mb-6">Send Us a Message</h2>
          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg p-6 rounded-lg"
          >
            {[
              { id: "name", label: "Name", type: "text", value: formData.name },
              { id: "email", label: "Email", type: "email", value: formData.email },
            ].map((field) => (
              <div key={field.id} className="mb-4">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={field.value}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors[field.id] ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
                {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
              </div>
            ))}

            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your message"
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
            >
              Submit
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ContactUs;
