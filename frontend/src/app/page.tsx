'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '../utils/axios';
import Carousel from '@/components/Carousel';

interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
}

const BAG_CATEGORIES = [
  {
    title: "DUFFLE",
    subtitle: "BAGS",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image8.png",
    imageAlt: "Duffle Bag",
    textAlignment: "left",
    lineJustify: "flex-start",
    justifyContent: "start",
  },
  {
    title: "SLING",
    subtitle: "BAGS",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image7.png",
    imageAlt: "Sling Bag",
    textAlignment: "left",
    lineJustify: "flex-end",
    justifyContent: "end",
  },
  {
    title: "WALLETS",
    subtitle: "",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image6.png",
    imageAlt: "Premium wallets",
    textAlignment: "left",
    lineJustify: "flex-start",
    justifyContent: "start",
  },
  {
    title: "TROLLEY",
    subtitle: "",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image5.png",
    imageAlt: "Trolley",
    textAlignment: "left",
    lineJustify: "flex-end",
    justifyContent: "end",
  },
  {
    title: "JACKETS",
    subtitle: "",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image4.png",
    imageAlt: "Jackets",
    textAlignment: "left",
    lineJustify: "flex-start",
    justifyContent: "start",
  },
  {
    title: "GLOVES",
    subtitle: "",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image3.png",
    imageAlt: "Gloves",
    textAlignment: "left",
    lineJustify: "flex-end",
    justifyContent: "end",
  },
  {
    title: "SHOES",
    subtitle: "",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image2.png",
    imageAlt: "Shoes",
    textAlignment: "left",
    lineJustify: "flex-start",
    justifyContent: "start",
  },
  {
    title: "BELTS",
    subtitle: "",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image1.png",
    imageAlt: "Belts",
    textAlignment: "left",
    lineJustify: "flex-end",
    justifyContent: "end",
  },
];

const MEN_PRODUCTS = [
  {
    title: "Leather Bag",
    price: "₹12,500",
    image: "/image7.png",
    colors: ["bg-black", "bg-gray-500"],
  },
  {
    title: "Steamer Carryon",
    price: "₹4,000",
    image: "/image5.png",
    colors: ["bg-blue-700", "bg-red-700"],
  },
];

const WOMEN_PRODUCTS = [
  {
    title: "Women Jacket",
    price: "₹1,999",
    image: "/image4.png",
    colors: ["bg-red-600", "bg-pink-300"],
  },
  {
    title: "Premium Wallets",
    price: "₹1,800",
    image: "/image6.png",
    colors: ["bg-black", "bg-brown-600"],
  },
];


export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("MEN");

  const displayedProducts = selectedTab === "MEN" ? MEN_PRODUCTS : WOMEN_PRODUCTS;

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mx-auto w-full">
      {/* Carousel */}
      <div className="w-full">
        <Carousel />
      </div>

      {/* Categories Section (Shop By Categories) */}
      <div className="mb-8 mt-4 flex flex-col">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          SHOP BY CATEGORIES
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 w-full">
            {categories.map((category) => (
              <div key={category.id} className="flex justify-center items-center">
                <Link
                  href={`/categories/${category.id}`}
                  className="group relative w-20 h-20 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={80} // Explicit width and height are recommended for better performance
                      height={80} // This matches the parent's w-20 h-20 (80px x 80px)
                      className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-full">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 transition">
                    <h3 className="text-white text-lg font-semibold text-center px-2">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-gray-600">No categories available yet.</p>
          </div>
        )}
      </div>

      {/* Feature Cards Section */}
      <div className="mb-12 mt-8 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Travel Essentials */}
          <Link href="/collections/travel-essentials">
            <div className="h-96 overflow-hidden rounded-lg shadow-lg group">
              <img
                src="/travel.jpg"
                alt="Travel Essentials"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className=" inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-6">
                <div className="self-start">
                  <h3 className="text-2xl font-bold text-white mb-2">TRAVEL ESSENTIALS</h3>
                  <span className="text-sm text-white border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors cursor-pointer">
                    VIEW COLLECTION
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Hydro Collection */}
          <Link href="/collections/hydro-collection">
            <div className="h-96 overflow-hidden rounded-lg shadow-lg group">
              <img
                src="/hydro.png"
                alt="Hydro Collection"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className=" inset-0 bg-black bg-opacity-40 flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">HYDRO COLLECTION</h3>
                  <span className="text-sm text-white border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors cursor-pointer">
                    VIEW COLLECTION
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* New Arrival */}
          <Link href="/collections/new-arrivals">
            <div className="h-96 overflow-hidden rounded-lg shadow-lg group">
              <img
                src="/new.png"
                alt="New Arrival"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="inset-0 bg-black bg-opacity-40 flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">NEW ARRIVAL</h3>
                  <span className="text-sm text-white border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors cursor-pointer">
                    VIEW COLLECTION
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* FOR HIM / HER Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* For Him */}
          <Link href="/for-him">
            <div className="h- overflow-hidden rounded-lg shadow-lg group">
              <img
                src="/him.jpg"
                alt="For Him"
                sizes="(max-width: 768px) 100vw, 50vw"
                height="auto"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className=" inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                {/* <h3 className="text-3xl font-bold text-white">FOR HIM</h3> */}
              </div>
            </div>
          </Link>

          {/* For Her */}
          <Link href="/for-her">
            <div className="h-103 overflow-hidden rounded-lg shadow-lg group">
              <img
                src="/her.jpg"
                alt="For Her"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className=" inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">FOR HER</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Our Best Seller Section */}
      <div className="my-12 px-4 md:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          OUR BEST SELLER
        </h2>
        <div className="border-2 border-yellow-300 rounded-sm p-4">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-4">
              <button
                onClick={() => handleTabChange("MEN")}
                className={`px-4 py-2 font-semibold text-black text-lg ${selectedTab === "MEN" ? 'border-b-2 border-black' : 'text-gray-500'}`}
              >
                MEN
              </button>
              <button
                onClick={() => handleTabChange("WOMEN")}
                className={`px-4 py-2 font-semibold text-black text-lg ${selectedTab === "WOMEN" ? 'border-b-2 border-black' : 'text-gray-500'}`}
              >
                WOMEN
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {displayedProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                <img src={product.image} alt={product.title} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-gray-500">MRP {product.price}</p>
                  <div className="flex justify-center mt-2 space-x-2">
                    {product.colors.map((color, i) => (
                      <div key={i} className={`w-4 h-4 ${color} rounded-full border border-gray-300`}></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 px-8 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors">
            EXPLORE BEST SELLERS
          </button>
        </div>
      </div>

      {/* Bag Categories Section */}
      <div className="max-w-full mx-auto py-5 ">
        {BAG_CATEGORIES.map((category, index) => (
          <div
            key={index}
            className={`flex items-center mb-6 w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
          >
            {/* Image Section */}
            <div className="flex-1 flex justify-start">
              <img
                src={category.image}
                alt={category.imageAlt}
                className="w-full max-w-[200vh]"
              />
            </div>

            {/* Text Section */}
            <div className="flex-1 flex flex-col justify-center items-center ">
              <h1
                className=" mx-2 font-['Playfair_Display'] text-2xl sm:text-4xl md:text-6xl text-center"
              >
                {category.title}
              </h1>

              {category.subtitle && (
                <h1
                  className="mx-2 font-['Playfair_Display'] text-2xl sm:text-4xl md:text-6xl text-center"
                >
                  {category.subtitle}
                </h1>
              )}

              <p
                className="mt-2 mx-2 text-gray-600 hidden sm:block w-4/5 text-center"
              >
                {category.description}
              </p>

              <div className={`mt-4 flex ${category.lineJustify === "flex-start" ? 'justify-start' : 'justify-end'} w-4/5`}>
                <div className="w-20 h-0.5 bg-black"></div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-0 px-0.5 -my-4">
          <img
            src="/fashionCouple.png"
            alt="Fashion Couple"
            className="w-full max-w-full"
          />
        </div>
      </div>

      {/* Featured Products CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>
        <p className="text-gray-600 mb-8">
          Check out our latest and most popular products
        </p>
        <Link
          href="/products"
          className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Products
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}