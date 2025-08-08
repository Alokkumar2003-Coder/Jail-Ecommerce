'use client';

import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  author?: { name: string };
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs')
      .then((res) => setBlogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      {/* Masonry layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {blogs.map((b) => (
          <Link
            key={b.id}
            href={`/blog/${b.slug}`}
            className="mb-4 break-inside-avoid block bg-white rounded-lg shadow hover:shadow-md transition"
          >
            {b.coverImage && (
              <img
                src={b.coverImage}
                alt={b.title}
                className="w-full h-auto object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-lg">{b.title}</h2>
              {b.excerpt && <p className="text-gray-600 mt-2 line-clamp-3">{b.excerpt}</p>}
              <div className="text-sm text-gray-500 mt-3">
                {b.publishedAt && new Date(b.publishedAt).toLocaleDateString()}
                {b.author?.name ? ` · ${b.author.name}` : ''}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
