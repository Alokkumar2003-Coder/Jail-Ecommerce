'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/axios';

export default function NewCarouselItemPage() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string>('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    
    try {
      const response = await api.post('/carousel/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(response.data.url);
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/carousel', {
        title,
        image,
        link: link || null,
        description: description || null,
        active,
        order: parseInt(order.toString()),
      });
      router.push('/admin/carousel');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create carousel item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Carousel Item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-3 rounded"
            required
          />
          {image && (
            <img src={image} alt="Preview" className="mt-2 w-full max-w-md h-32 object-cover rounded" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link (optional)
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border p-3 rounded"
            placeholder="https://example.com or /products"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full border p-3 rounded"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="active">Active</label>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Carousel Item'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}