import React from "react";

const AboutUs = () => {
  return (
    <main className="py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are passionate about creating exceptional solutions for our clients. Our goal is to deliver innovation, excellence, and value.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-6 rounded-lg shadow-lg bg-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-600">
              To empower individuals and businesses with cutting-edge technology and tailored solutions that meet their unique needs.
            </p>
          </div>

          {/* Values */}
          <div className="p-6 rounded-lg shadow-lg bg-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Our Values
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Innovation</li>
              <li>Integrity</li>
              <li>Customer Satisfaction</li>
              <li>Collaboration</li>
            </ul>
          </div>
        </section>

        {/* Team Section */}
        <section className="mt-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Alice", "Bob", "Charlie"].map((name, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
                <p className="text-sm text-gray-500">Position</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUs;
