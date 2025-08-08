'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../utils/axios';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string[] | null;
  publishedAt: string | null;
  author?: { name: string };
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/blogs/${slug}`)
      .then((res) => setBlog(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Blog not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {blog.coverImage && (
        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover rounded-lg mb-6" />
      )}
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-gray-500 mb-6">
        {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString()}
        {blog.author?.name ? ` · ${blog.author.name}` : ''}
      </div>

      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{blog.content}</p>
      </div>

      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {blog.tags.map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}