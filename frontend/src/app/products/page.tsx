'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '../../utils/axios';
import ProductCard from '../../components/ProductCard';
import SearchInput from '../../components/SearchInput';
import CategorySelect from '../../components/CategorySelect';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  stock: number;
  rating: number;
  category: Category;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');



  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      
      try {
        const params: any = {};
        if (categoryId) params.categoryId = categoryId;
        if (search) params.search = search;
        
        console.log('Fetching products with params:', params); // Debug log
        
        const response = await api.get('/products', { params });
        setProducts(response.data);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, search]);

  const handleCategoryChange = (categoryId: string) => {
    setCategoryId(categoryId);
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <CategorySelect
          value={categoryId}
          onChange={handleCategoryChange}
          placeholder="All Categories"
          className="min-w-[200px]"
        />
        
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="flex-1"
          debounceMs={500}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading indicator for subsequent loads */}
      {loading && products.length > 0 && (
        <div className="text-center text-gray-500 mb-4">Updating...</div>
      )}
      
      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* No products found */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-8">
          <p className="text-lg mb-2">No products found.</p>
          <p className="text-sm">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}