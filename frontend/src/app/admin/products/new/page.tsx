'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/axios';

interface Category {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Specifications
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [warranty, setWarranty] = useState('');
  const [customSpecs, setCustomSpecs] = useState<Array<{key: string, value: string}>>([]);
  
  const router = useRouter();

  useState(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    
    try {
      const res = await api.post('/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages([...images, res.data.url]);
    } catch (err) {
      alert('Failed to upload image');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addCustomSpec = () => {
    setCustomSpecs([...customSpecs, { key: '', value: '' }]);
  };

  const removeCustomSpec = (index: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== index));
  };

  const updateCustomSpec = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...customSpecs];
    updated[index][field] = value;
    setCustomSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convert custom specs to object
      const specifications = customSpecs.reduce((acc, spec) => {
        if (spec.key && spec.value) {
          acc[spec.key] = spec.value;
        }
        return acc;
      }, {} as Record<string, string>);

      await api.post('/products', {
        title,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        images,
        brand: brand || null,
        model: model || null,
        weight: weight || null,
        dimensions: dimensions || null,
        color: color || null,
        material: material || null,
        warranty: warranty || null,
        specifications: Object.keys(specifications).length > 0 ? specifications : null,
      });
      router.push('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
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
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-3 rounded"
              rows={4}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border p-3 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border p-3 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specifications */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border p-3 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full border p-3 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full border p-3 rounded"
                  placeholder="e.g., 2.5 kg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full border p-3 rounded"
                  placeholder="e.g., 10 x 5 x 2 inches"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full border p-3 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full border p-3 rounded"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full border p-3 rounded"
                  placeholder="e.g., 1 year manufacturer warranty"
                />
              </div>
            </div>

            {/* Custom Specifications */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium">Custom Specifications</h4>
                <button
                  type="button"
                  onClick={addCustomSpec}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Add Spec
                </button>
              </div>
              
              {customSpecs.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateCustomSpec(index, 'key', e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder="Specification name"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateCustomSpec(index, 'value', e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder="Specification value"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomSpec(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border p-3 rounded"
            />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 cursor-pointer w-full text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 w-full cursor-pointer text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}