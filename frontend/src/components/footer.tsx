import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#f2efe9] text-[#2c2c2c] py-16 px-6 sm:px-10 md:px-16 lg:px-24 font-serif">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-x-8 gap-y-12">
        {/* Company Info */}
        <div className="lg:col-span-2 flex flex-col space-y-3 text-left sm:text-left md:text-center lg:text-left">
          <div className="flex items-center space-x-2">
            <span className="p-1 text-3xl font-bold text-gray-900">JAIL</span>
          </div>
          <p className="text-sm">
            Jail is a luxury e-commerce store <br />
            which sells premium leather products
          </p>
          <div className="text-sm">
            <p>Mobile: +91-0658585856</p>
            <p>Email: support@jail.luxury</p>
          </div>
        </div>

        {/* Help */}
        <div className="lg:border-l-2 lg:pl-6 text-left sm:text-left md:text-center lg:text-left">
          <h3 className="text-lg font-bold mb-4">HELP</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:underline">Terms and Conditions</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/returns" className="hover:underline">Returns and Refunds Policy</Link></li>
            <li><Link href="/shipping" className="hover:underline">Shipping Policy</Link></li>
            <li><Link href="/cancellation" className="hover:underline">Cancellation Policy</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="lg:border-l-2 lg:pl-6 text-left sm:text-left md:text-center lg:text-left">
          <h3 className="text-lg font-bold mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/blogs" className="hover:underline">Blogs</Link></li>
            <li><Link href="/news" className="hover:underline">News</Link></li>
          </ul>
        </div>

        {/* Shop Products */}
        <div className="lg:border-l-2 lg:pl-6 text-left sm:text-left md:text-center lg:text-left">
          <h3 className="text-lg font-bold mb-4">SHOP PRODUCTS</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products/bags" className="hover:underline">Bags</Link></li>
            <li><Link href="/products/belts" className="hover:underline">Belts</Link></li>
            <li><Link href="/products/duffle-bags" className="hover:underline">Duffle Bags</Link></li>
            <li><Link href="/products/gloves" className="hover:underline">Gloves</Link></li>
            <li><Link href="/products/jackets" className="hover:underline">Jackets</Link></li>
            <li><Link href="/products/shoes" className="hover:underline">Shoes</Link></li>
            <li><Link href="/products/trolley" className="hover:underline">Trolley</Link></li>
            <li><Link href="/products/wallets" className="hover:underline">Wallets</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="lg:border-l-2 lg:pl-6 text-left sm:text-left md:text-center lg:text-left">
          <h3 className="text-lg font-bold mb-4">SOCIAL MEDIA</h3>
          <ul className="flex flex-col items-start sm:items-start md:items-center lg:items-start space-y-3">
            {[
              { bg: 'bg-blue-600' },
              { bg: 'bg-[#E4405F]' },
              { bg: 'bg-[#1DA1F2]' },
              { bg: 'bg-[#0077B5]' },
              { bg: 'bg-[#E60023]' },
            ].map((icon, i) => (
              <li key={i}>
                <Link href="#" className="flex items-center space-x-2 text-sm hover:underline">
                  <div className={`${icon.bg} rounded-full w-6 h-6 flex items-center justify-center`}>
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Location */}
        <div className="lg:border-l-2 lg:pl-6 text-left sm:text-left md:text-center lg:text-left">
          <h3 className="text-lg font-bold mb-4">LOCATION</h3>
          <p className="text-sm">
            3633 Prabhash Complex<br />
            Mukundopur Bhagwanpur – 24<br />
            South Pargana<br />
            Kolkata 700150<br />
            India
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 text-xs text-black flex flex-col items-start sm:items-center justify-center text-left sm:text-center">
        <p>Copyright © 2025 Jail Luxury. All rights reserved.</p>
        <p>Designed and Developed by <a href="#" className="underline text-blue-600">Sands Technology Solution</a></p>
      </div>
    </footer>
  );
};

export default Footer;
