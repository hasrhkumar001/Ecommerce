import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  return (
    <main className="py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out to us for inquiries, support, or just to say hello.
          </p>
        </section>

        {/* Contact Information */}
        <section className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-lg shadow-lg bg-gray-100">
            <FaPhone className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Phone
            </h3>
            <p className="text-gray-600">+1 (123) 456-7890</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-gray-100">
            <FaEnvelope className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Email
            </h3>
            <p className="text-gray-600">support@example.com</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-gray-100">
            <FaMapMarkerAlt className="text-3xl text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Location
            </h3>
            <p className="text-gray-600">123 Main Street, City, Country</p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Send Us a Message
          </h2>
          <form className="max-w-lg mx-auto bg-white shadow-lg p-6 rounded-lg">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
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
