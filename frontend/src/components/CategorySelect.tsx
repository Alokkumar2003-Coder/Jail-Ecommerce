'use client';

import { useEffect, useState } from 'react';
import api from '../utils/axios';

interface Category {
  id: number;
  name: string;
  image?: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CategorySelect({ 
  value, 
  onChange, 
  placeholder = "Select Category",
  className = ""
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  if (loading) {
    return (
      <select 
        disabled 
        className={`border border-gray-300 p-2 rounded-lg bg-gray-100 ${className}`}
      >
        <option>Loading categories...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select 
        disabled 
        className={`border border-red-300 p-2 rounded-lg bg-red-50 ${className}`}
      >
        <option>Error loading categories</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      <option value="">{placeholder}</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
