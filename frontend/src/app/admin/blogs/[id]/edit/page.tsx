'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../../../utils/axios';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string[] | null;
  published: boolean;
}

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Blog | null>(null);
  const [tagsText, setTagsText] = useState('');

  useEffect(() => {
    // GET supports numeric id
    api.get(`/blogs/${id}`).then((res) => {
      const blog: Blog = res.data;
      setForm(blog);
      setTagsText(blog.tags?.join(', ') || '');
    });
  }, [id]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !form) return;
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await api.post('/blogs/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, coverImage: res.data.url });
    } catch {
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await api.put(`/blogs/${id}`, {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage,
        tags,
        published: form.published,
      });
      router.push('/admin/blogs');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update blog');
    }
  };

  if (!form) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-3 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={form.excerpt || ''}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full border p-3 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border p-3 rounded"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="w-full border p-3 rounded" />
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover" className="mt-4 w-full max-w-md h-48 object-cover rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full border p-3 rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="published">Published</label>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Update Blog
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}