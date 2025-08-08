'use client';

import { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  published: boolean;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs', { params: { all: '1' } })
      .then((res) => setBlogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert('Failed to delete blog');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Blog
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{blog.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{blog.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{blog.published ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/blogs/${blog.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}