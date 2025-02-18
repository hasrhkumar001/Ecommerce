import React from "react";
import user_img from "../assets/userplaceholder.jpg";

const AboutUs = () => {
  return (
    <main className="py-12 container bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto px-6">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">About Us</h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            We are passionate about creating exceptional solutions for our clients. Our goal is to deliver innovation, excellence, and value.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To empower individuals and businesses with cutting-edge technology and tailored solutions that meet their unique needs.
            </p>
          </div>

          {/* Values */}
          <div className="p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Our Values</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Innovation</li>
              <li>Integrity</li>
              <li>Customer Satisfaction</li>
              <li>Collaboration</li>
            </ul>
          </div>
        </section>

        {/* Team Section */}
        <section className="mt-12 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Alice", "Bob", "Charlie"].map((name, index) => (
              <div
                key={index}
                className="p-4 shadow-lg rounded-lg flex flex-col items-center bg-white dark:bg-gray-800"
              >
                 <img 
                  src={user_img} 
                  alt={`${name}'s photo`} 
                  className="w-20 h-20 rounded-full mb-4 bg-gray-300 dark:bg-gray-700" 
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUs;