'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../../utils/axios';
import ProductCard from '../../components/ProductCard';
import SearchInput from '../../components/SearchInput';
import ProductFilters from '../../components/ProductFilters';

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
  category?: Category;
  categoryId?: number; // Add this as backup
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        console.log('Raw products data:', productsResponse.data);
        console.log('Categories data:', categoriesResponse.data);
        
        // Process products to ensure category data is properly structured
        const processedProducts = productsResponse.data.map((product: any) => {
          // Log each product's category data
          console.log(`Product ${product.id}:`, {
            title: product.title,
            category: product.category,
            categoryId: product.categoryId
          });
          
          return {
            ...product,
            // Ensure category data is properly structured
            category: product.category || null,
            categoryId: product.categoryId || null
          };
        });
        
        setProducts(processedProducts);
        setCategories(categoriesResponse.data);
        
        // Set initial price range
        if (productsResponse.data.length > 0) {
          const maxProductPrice = Math.ceil(Math.max(...productsResponse.data.map((p: Product) => p.price)));
          setPriceRange({ min: 0, max: maxProductPrice });
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    console.log('=== FILTERING PROCESS ===');
    console.log('Total products to filter:', filtered.length);
    console.log('Selected category ID:', selectedCategory);
    console.log('Search term:', search);
    console.log('Price range:', priceRange);

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
      console.log('After search filter:', filtered.length);
    }

    // Category filter - Multiple approaches to handle different data structures
    if (selectedCategory) {
      console.log('Applying category filter for category ID:', selectedCategory);
      
      filtered = filtered.filter(product => {
        // Try multiple ways to get category ID
        let productCategoryId = null;
        
        // Method 1: Check if category object exists and has id
        if (product.category && product.category.id) {
          productCategoryId = product.category.id;
        }
        // Method 2: Check if categoryId exists directly on product
        else if (product.categoryId) {
          productCategoryId = product.categoryId;
        }
        
        console.log(`Product ${product.id} category check:`, {
          productCategoryId,
          selectedCategory,
          categoryObject: product.category,
          directCategoryId: product.categoryId
        });
        
        // Convert both to strings for comparison
        const match = productCategoryId && productCategoryId.toString() === selectedCategory;
        console.log(`Product ${product.id} category match:`, match);
        
        return match;
      });
      
      console.log('After category filter:', filtered.length);
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    console.log('After price filter:', filtered.length);

    // Sort products
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating_desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
        // Default sorting (newest first)
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }

    console.log('Final filtered products:', filtered.length);
    console.log('=== END FILTERING PROCESS ===');
    
    return filtered;
  }, [products, search, selectedCategory, sortBy, priceRange]);

  const handleSearchChange = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log('Category changed to:', categoryId);
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setPriceRange(range);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSortBy('');
    setPriceRange({ min: 0, max: maxPrice });
    setSearch('');
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
      
      {/* Debug Info */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
        <p><strong>Debug Info:</strong></p>
        <p>Total Products: {products.length}</p>
        <p>Selected Category: {selectedCategory || 'None'}</p>
        <p>Filtered Products: {filteredAndSortedProducts.length}</p>
        <p>Categories Available: {categories.length}</p>
        <p>Categories: {categories.map(c => `${c.name} (${c.id})`).join(', ')}</p>
        <details className="mt-2">
          <summary className="cursor-pointer">Product Category Data (First 3)</summary>
          <div className="mt-2 text-xs">
            {products.slice(0, 3).map(product => (
              <div key={product.id} className="mb-1">
                Product {product.id}: {product.title} - Category: {JSON.stringify(product.category)} - CategoryId: {product.categoryId}
              </div>
            ))}
          </div>
        </details>
      </div> */}
      
      {/* Search Bar */}
      <div className="mb-6">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full max-w-md"
          debounceMs={500}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="lg:w-1/4">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            maxPrice={maxPrice}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
            {filteredAndSortedProducts.length !== products.length && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Loading indicator for subsequent loads */}
          {loading && products.length > 0 && (
            <div className="text-center text-gray-500 mb-4">Updating...</div>
          )}
          
          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* No products found */}
          {!loading && filteredAndSortedProducts.length === 0 && !error && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg mb-2">No products found.</p>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
              <button
                onClick={handleClearFilters}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}