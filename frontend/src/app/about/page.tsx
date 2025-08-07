"use client";

import React from "react";

const About: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-serif">
      {/* Title Section */}
      <h1 className="text-center font-bold text-gray-900 text-3xl sm:text-4xl mb-4">
        Welcome <br /> To Jail Luxury, where heritage meets innovation!
      </h1>
      <p className="text-center text-gray-700 text-base sm:text-lg mb-8">
        Founded in 1972 by Shri Ramani Mohan Singh in the heart of Banka, Bihar, Jail Luxury began as a humble leather shop on Jail Road, a name that quickly became synonymous with quality craftsmanship. What started as a small family venture has grown into a global brand, celebrated for its exquisite leather products that blend traditional craftsmanship with contemporary design.
        At Jail Luxury, every product is a testament to our rich legacy and commitment to excellence. From handbags to jackets, wallets to accessories, our collections are crafted with precision and passion, ensuring that each piece carries the unmistakable mark of luxury.
      </p>

      {/* Section Wrapper */}
      <div className="space-y-8">

        {/* Our Journey */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-[#f2efe9] text-[#2c2c2c] rounded-xl shadow-md">
          <h2 className="flex-1 min-w-[200px] font-bold text-xl md:text-left text-center mb-4 md:mb-0">
            Our Journey
          </h2>
          <p className="flex-[2] text-sm md:text-base text-center md:text-left">
            The story of Jail Luxury is one of resilience and renewal. After the passing of our founder in 1984, the brand was shepherded by his third son, Mr. Rajesh Ranjan Singh, who expanded the business across Bhagalpur, Patna, and Kolkata. The brand’s influence grew, and Jail became a dominant name in the leather industry. However, the global financial crisis of 2008 posed an immense challenge, leading to the closure of our stores and pushing the brand into obscurity. But the spirit of Jail was far from extinguished. In 2016, Aditya Kumar, the nephew of Mr. Rajesh Ranjan Singh, took the reins, breathing new life into the brand. With a modern vision and a commitment to the family legacy, he revitalized Jail Luxury, transforming it into a private limited company in 2023. Today, our headquarters in Kolkata, West Bengal, serves as the heart of our global operations, with a presence in the USA, France, Germany, Russia, and Canada.
          </p>
        </div>

        {/* Our Philosophy */}
        <div className="bg-[#f2efe9] text-[#2c2c2c] flex flex-col md:flex-row items-center justify-between p-4  rounded-xl shadow-md">
          <p className="flex-[2] text-sm md:text-base text-center md:text-right md:order-1">
            At Jail Luxury, we believe that true luxury lies in the details. Our products are crafted with care, using the finest materials sourced from around the world. We are proud to operate state-of-the-art manufacturing facilities in Kolkata and Kanpur, where our skilled artisans bring our designs to life. Our collaborations with renowned designers from Seattle and Paris have allowed us to push the boundaries of leather craftsmanship, creating unique and luxurious products that resonate with modern sensibilities while honouring our rich heritage.
          </p>
          <h2 className="flex-1 min-w-[200px] font-bold text-xl md:text-right text-center mb-4 md:mb-0 md:order-2">
            Our Philosophy
          </h2>
        </div>

        {/* Our Products */}
        <div className="bg-[#f2efe9] text-[#2c2c2c] flex flex-col md:flex-row items-center justify-between p-4  rounded-xl shadow-md">
          <h2 className="flex-1 min-w-[200px] font-bold text-xl md:text-left text-center mb-4 md:mb-0">
            Our Products
          </h2>
          <div className="flex-[2] text-center md:text-left">
            <p className="text-sm md:text-base">
              We offer a wide range of leather goods, including:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm md:text-base text-left">
              <li>Handbags</li>
              <li>Briefcases</li>
              <li>Laptop Bags</li>
              <li>Travel Bags</li>
              <li>Wallets</li>
              <li>Accessories</li>
              <li>Belts</li>
              <li>Jackets</li>
              <li>Footwear</li>
            </ul>
          </div>
        </div>

        {/* Why Jail? */}
        <div className="flex flex-col items-center p-4 bg-[#f2efe9] text-[#2c2c2c] rounded-xl shadow-md">
          <h2 className="min-w-[200px] font-bold text-xl text-center mb-4">
            Why Jail?
          </h2>
          <p className="text-sm md:text-base text-center">
            The name “Jail” is more than just a brand; it’s a nod to our roots. The original shop was located on Jail Road in Banka, and the name was born out of the simplicity of directions—“Jail Road, Jail Road.” Today, it stands as a symbol of our journey, from a small shop in Bihar to a luxury brand that resonates with customers around the world.


          </p>
        </div>

        {/* Join Us */}
        <div className="flex flex-col items-center p-4 bg-[#f2efe9] text-[#2c2c2c] rounded-xl shadow-md">
          <h2 className="min-w-[200px] font-bold text-xl text-center mb-4">
            Join Us on Our Journey
          </h2>
          <p className="text-sm md:text-base text-center">
           As we continue to expand and innovate, we invite you to be part of our journey. Explore our collections, discover the story behind each piece, and experience the unparalleled luxury that only Jail can offer.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;
