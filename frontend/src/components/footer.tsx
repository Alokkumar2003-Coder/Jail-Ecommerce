import React from 'react';
import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPinterestP,
} from 'react-icons/fa';

const Footer = () => {
  const socialMedia = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/jail.luxury',
      bg: 'bg-blue-600',
      icon: <FaFacebookF className="text-white text-sm" />,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/jail.luxury',
      bg: 'bg-[#E4405F]',
      icon: <FaInstagram className="text-white text-sm" />,
    },
    {
      name: 'Twitter',
      url: 'https://x.com/jailluxury',
      bg: 'bg-[#1DA1F2]',
      icon: <FaTwitter className="text-white text-sm" />,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/jail-luxury/',
      bg: 'bg-[#0077B5]',
      icon: <FaLinkedinIn className="text-white text-sm" />,
    },
    {
      name: 'Pinterest',
      url: 'https://pin.it/35X2dFOen',
      bg: 'bg-[#E60023]',
      icon: <FaPinterestP className="text-white text-sm" />,
    },
  ];

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
            <li><Link href="/termcondition" className="hover:underline">Terms and Conditions</Link></li>
            <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/returnrefund" className="hover:underline">Returns and Refunds Policy</Link></li>
            <li><Link href="/shippingpolicy" className="hover:underline">Shipping Policy</Link></li>
            <li><Link href="/deletepolicy" className="hover:underline">Cancellation Policy</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="lg:border-l-2 lg:pl-6 text-left sm:text-left md:text-center lg:text-left">
          <h3 className="text-lg font-bold mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/blog" className="hover:underline">Blogs</Link></li>
            <li><Link href="/news" className="hover:underline">News</Link></li>
          </ul>
        </div>

        {/* Shop Products */}
        <div className="lg:border-l-2 lg:pl-6 text-left sm:text-left md:text-center lg:text-left">
          <h3 className="text-lg font-bold mb-4">SHOPING</h3>
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
            {socialMedia.map((social, i) => (
              <li key={i}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:underline"
                >
                  <div className={`${social.bg} rounded-full w-6 h-6 flex items-center justify-center`}>
                    {social.icon}
                  </div>
                  <span className="hidden sm:inline">{social.name}</span>
                </a>
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
      <div className="mt-12 -mb-6 text-xs text-black flex flex-col items-start sm:items-center justify-center text-left sm:text-center">
        <p>Copyright © 2025 Jail Luxury. All rights reserved.</p>
        <p>
          Designed and Developed by {'{Himalaya Singh & Alok Kumar} '}
          <a href="#" className="underline text-blue-600">
            Six Technology Solution
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
