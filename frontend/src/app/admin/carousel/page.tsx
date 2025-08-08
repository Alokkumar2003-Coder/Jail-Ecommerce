'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../utils/axios';

interface CarouselItem {
  id: number;
  title: string;
  image: string;
  link?: string;
  description?: string;
  active: boolean;
  order: number;
}

export default function AdminCarouselPage() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      const response = await api.get('/carousel/all');
      setCarouselItems(response.data);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this carousel item?')) return;
    
    try {
      await api.delete(`/carousel/${id}`);
      setCarouselItems(carouselItems.filter(item => item.id !== id));
    } catch (error) {
      alert('Failed to delete carousel item');
    }
  };

  const toggleActive = async (id: number, currentActive: boolean) => {
    try {
      await api.put(`/carousel/${id}`, { active: !currentActive });
      setCarouselItems(carouselItems.map(item => 
        item.id === id ? { ...item, active: !currentActive } : item
      ));
    } catch (error) {
      alert('Failed to update carousel item');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Carousel</h1>
        <Link
          href="/admin/carousel/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Carousel Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carouselItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  item.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {item.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              )}
              {item.link && (
                <p className="text-blue-600 text-sm mb-3">Link: {item.link}</p>
              )}
              <p className="text-gray-500 text-xs mb-4">Order: {item.order}</p>
              
              <div className="flex space-x-2">
                <Link
                  href={`/admin/carousel/${item.id}/edit`}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleActive(item.id, item.active)}
                  className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                    item.active 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {item.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}