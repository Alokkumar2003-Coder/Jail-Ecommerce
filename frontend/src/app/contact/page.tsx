'use client';

import React from 'react';

export default function Contact() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start bg-[#f2efe9] text-[#2c2c2c] rounded-2xl p-5 md:p-10 my-10 mx-5 md:mx-20 gap-8">
      
      {/* Left Section */}
      <div className="w-full md:w-1/2 ">
        <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-black">Head Office</h2>
        <p className="text-sm mb-3 text-gray-600 dark:text-gray-900">
          3633 prabhash complex | mukundopur bhagwanpur - 24 south pargana / kolkata 700150
        </p>

        <h2 className="text-lg font-bold mb-3 mt-6 text-gray-900 dark:text-black">Stay In Touch</h2>
        <p className="text-sm mb-3 text-gray-600 dark:text-gray-900">
          We believe in the transformative power of elegance. Our journey began with a passion for curating the finest in luxury, bringing together a collection that...
        </p>

        <h2 className="text-lg font-bold mb-3 mt-6 text-gray-900 dark:text-black">Customer Service</h2>
        <p className="text-sm mb-1 text-gray-600 dark:text-gray-900">📧 support@jail.luxury</p>
        <p className="text-sm mb-1 text-gray-600 dark:text-gray-900">📞 +91 88777 72277</p>
        <p className="text-sm text-gray-600 dark:text-gray-900">🕒 Mon-Sat: 10:00 AM - 05:00 PM</p>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 ">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-black">Got Any Questions?</h2>
        <form className="flex flex-col gap-4 font-semibold">
          <input
            type="text"
            placeholder="Name"
            className="bg-[#f2efe9] text-black w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-[#f2efe9] text-black w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <textarea
            rows={4}
            placeholder="Comment or Message"
            className="bg-[#f2efe9] text-black w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
