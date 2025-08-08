'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/axios';

interface CarouselItem {
  id: number;
  title: string;
  image: string;
  link?: string;
  description?: string;
  active: boolean;
  order: number;
}

export default function Carousel() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      const response = await api.get('/carousel');
      setCarouselItems(response.data);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carouselItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [carouselItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCarouselClick = (item: CarouselItem) => {
    if (item.link) {
      // If it's an external link
      if (item.link.startsWith('http')) {
        window.open(item.link, '_blank');
      } else {
        // If it's an internal route
        router.push(item.link);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (carouselItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative h-96">
      {/* Carousel Images */}
      <div className=" w-full h-full relative">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`h-full w-full absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => handleCarouselClick(item)}
            />
            {/* Overlay with title and description */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white text-lg font-semibold mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-white/90 text-sm">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows
      {carouselItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )} */}

      {/* Dots Indicator */}
      {carouselItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}