'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/axios';

export default function NewBlogPage() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [tagsText, setTagsText] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await api.post('/blogs/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCoverImage(res.data.url);
    } catch {
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await api.post('/blogs', {
        title,
        excerpt,
        content,
        coverImage: coverImage || null,
        tags,
        published,
      });

      router.push('/admin/blogs');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border p-3 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-3 rounded"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="w-full border p-3 rounded" />
            {coverImage && (
              <img src={coverImage} alt="Cover" className="mt-4 w-full max-w-md h-48 object-cover rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full border p-3 rounded"
              placeholder="e.g. sale, tips, news"
            />
          </div>

          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="published">Published</label>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 cursor-pointer w-full text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Blog'}
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