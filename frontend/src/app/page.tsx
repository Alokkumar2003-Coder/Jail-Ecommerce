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

interface Product {
  title: string;
  price: string;
  image: string;
  colors: string[];
}

interface BagCategory {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface Collection {
  title: string;
  image: string;
  href: string;
}

const BAG_CATEGORIES: BagCategory[] = [
  {
    title: "DUFFLE",
    subtitle: "BAGS",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image8.png",
    imageAlt: "Duffle Bag",
  },
  {
    title: "SLING",
    subtitle: "BAGS",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image7.png",
    imageAlt: "Sling Bag",
  },
  {
    title: "WALLETS",
    subtitle: "",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image6.png",
    imageAlt: "Premium wallets",
  },
  {
    title: "TROLLEY",
    subtitle: "",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image5.png",
    imageAlt: "Trolley",
  },
  {
    title: "JACKETS",
    subtitle: "",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image4.png",
    imageAlt: "Jackets",
  },
  {
    title: "GLOVES",
    subtitle: "",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image3.png",
    imageAlt: "Gloves",
  },
  {
    title: "SHOES",
    subtitle: "",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image2.png",
    imageAlt: "Shoes",
  },
  {
    title: "BELTS",
    subtitle: "",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "/image1.png",
    imageAlt: "Belts",
  },
];

const PRODUCTS = {
  MEN: [
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
  ],
  WOMEN: [
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
  ],
};

const COLLECTIONS: Collection[] = [
  {
    title: "TRAVEL ESSENTIALS",
    image: "/travel.jpg",
    href: "/collections/travel-essentials"
  },
  {
    title: "HYDRO COLLECTION",
    image: "/hydro.png",
    href: "/collections/hydro-collection"
  },
  {
    title: "NEW ARRIVAL",
    image: "/new.png",
    href: "/collections/new-arrivals"
  }
];

const FOR_SECTIONS = [
  {
    title: "FOR HIM",
    image: "/him.jpg",
    href: "/for-him",
    showTitle: true
  },
  {
    title: "FOR HER",
    image: "/her.jpg",
    href: "/for-her",
    showTitle: true
  }
];

// Component for loading state
const LoadingSpinner = () => (
  <div className="text-center py-8">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <p className="mt-2 text-gray-600">Loading categories...</p>
  </div>
);

// Component for empty state
const EmptyState = ({ message, icon }: { message: string; icon: JSX.Element }) => (
  <div className="text-center py-8">
    {icon}
    <p className="text-gray-600">{message}</p>
  </div>
);

// Component for category item
const CategoryItem = ({ category }: { category: Category }) => (
  <div className="flex flex-col justify-center items-center space-y-2">
    <Link
      href={`/categories/${category.id}`}
      className="group relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          width={112}
          height={112}
          className="object-cover w-full h-full rounded-full group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-full">
          <svg
            className="w-10 h-10 text-gray-400"
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
    </Link>
    <h3 className="text-center text-sm sm:text-base font-medium text-gray-800">
      {category.name}
    </h3>
  </div>
);

// Component for collection card
const CollectionCard = ({ collection }: { collection: Collection }) => (
  <Link href={collection.href}>
    <div className="overflow-hidden group">
      <img
        src={collection.image}
        alt={collection.title}
        className="h-[60vh] sm:h-[70vh] md:h-[80vh] w-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="relative -mt-24 sm:-mt-28 md:-mt-32 z-50 flex flex-col justify-between p-4 sm:p-6">
        <div className="self-start">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">{collection.title}</h3>
          <span className="text-xs sm:text-sm text-black bg-white px-3 py-2 sm:px-4 sm:py-2 hover:bg-white hover:text-black transition-colors cursor-pointer">
            VIEW COLLECTION
          </span>
        </div>
      </div>
    </div>
  </Link>
);

// Component for gender section
const GenderSection = ({ section }: { section: typeof FOR_SECTIONS[0] }) => (
  <Link href={section.href}>
    <div className="overflow-hidden group">
      <img
        src={section.image}
        alt={section.title}
        className="h-[60vh] sm:h-[80vh] md:h-[90vh] w-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      {section.showTitle && (
        <div className="flex items-center justify-center relative bottom-56 -mt-20 sm:-mt-24 md:-mt-28 z-50">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{section.title}</h3>
        </div>
      )}
    </div>
  </Link>
);

// Component for product card
const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <div key={index} className="overflow-hidden group">
    <img
      src={product.image}
      alt={product.title}
      className="w-full h-64 sm:h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold">{product.title}</h3>
      <p className="text-sm sm:text-base text-gray-500">MRP {product.price}</p>
    </div>
  </div>
);

// Component for bag category row
const BagCategoryRow = ({ category, index }: { category: BagCategory; index: number }) => (
  <div className={`flex items-center mb-6 w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
    <div className="flex-1 flex justify-start">
      <img
        src={category.image}
        alt={category.imageAlt}
        className="w-full max-w-[200vh]"
      />
    </div>
    <div className="flex-1 flex flex-col justify-center items-center">
      <h1 className="mx-2 font-['Playfair_Display'] text-2xl sm:text-4xl md:text-6xl text-center">
        {category.title}
      </h1>
      {category.subtitle && (
        <h1 className="mx-2 font-['Playfair_Display'] text-2xl sm:text-4xl md:text-6xl text-center">
          {category.subtitle}
        </h1>
      )}
      <p className="mt-2 mx-2 text-gray-600 hidden sm:block w-4/5 text-center">
        {category.description}
      </p>
      <div className={`mt-4 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} w-4/5`}>
        <div className="w-20 h-0.5 bg-black"></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'MEN' | 'WOMEN'>('MEN');

  const displayedProducts = PRODUCTS[selectedTab];

  const handleTabChange = (tab: 'MEN' | 'WOMEN') => {
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

  const categoryIcon = (
    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  return (
    <div className="mx-auto w-full">
      {/* Carousel */}
      <div className="w-full">
        <Carousel />
      </div>

      {/* Categories Section */}
      <div className="mb-10 mt-10 flex flex-col">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
          SHOP BY CATEGORIES
        </h2>

        {loading ? (
          <LoadingSpinner />
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 sm:gap-8 px-4 sm:px-6 md:px-10">
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState message="No categories available yet." icon={categoryIcon} />
        )}
      </div>

      {/* Featured Products CTA */}
      <div className="text-center p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Featured Products</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">Check out our latest and most popular products</p>
        <Link
          href="/products"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Products
          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Feature Cards Section */}
      <div className="mb-12 mt-8 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS.map((collection, index) => (
            <CollectionCard key={index} collection={collection} />
          ))}
        </div>

        {/* FOR HIM / HER Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {FOR_SECTIONS.map((section, index) => (
            <GenderSection key={index} section={section} />
          ))}
        </div>
      </div>

      {/* Our Best Seller Section */}
      <div className="my-12 px-4 md:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">OUR BEST SELLER</h2>
        <div className="border-2 border-yellow-300 rounded-sm p-4">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-4">
              {(['MEN', 'WOMEN'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 font-semibold text-lg ${selectedTab === tab
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {displayedProducts.map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </div>

          <button className="mt-8 px-8 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors">
            EXPLORE BEST SELLERS
          </button>
        </div>
      </div>

      {/* Bag Categories Section */}
      <div className="max-w-full mx-auto py-3 sm:py-5 px-2 sm:px-4">
        {BAG_CATEGORIES.map((category, index) => (
          <BagCategoryRow key={index} category={category} index={index} />
        ))}
        <div className="mt-0 px-0.5 -my-4">
          <img src="/fashionCouple.png" alt="Fashion Couple" className="w-full max-w-full" />
        </div>
      </div>

      <div className=' sm:p-4 mt-8 mb-8'>
        <div className='border border-gray-200 w-full rounded-none md:rounded-lg p-0 sm:p-8 md:p-10 bg-gray-200 shadow-sm'>
          <h1 className='text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900'>
            JAIL LUXURY
          </h1>
          <div className='flex flex-col lg:flex-row w-full gap-6 sm:gap-8'>
            <div className='w-full lg:w-1/2'>
              <div className='h-96 sm:h-80  md:h-96 overflow-hidden'>
                <video
                  src="/JailLuxuryPromoVid.mp4"
                  muted
                  autoPlay
                  loop
                  playsInline
                  className='w-full h-full object-cover'
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div className='w-full lg:w-1/2 flex flex-col justify-center px-2 sm:px-4'>
              <h2 className='font-bold text-lg sm:text-xl md:text-2xl mb-4 text-center lg:text-left text-gray-900'>
                Why Jail?
              </h2>
              <p className='text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 text-center lg:text-left'>
                The name "Jail" is more than just a brand. It's a nod to our roots. The
                original shop was located on Jail Road in Banka, and the name was born
                out of the simplicity of directions—"Jail Road, Jail Road." Today, it
                stands as a symbol of our journey, from a small shop in Bihar to a
                luxury brand that resonates with customers around the world.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}