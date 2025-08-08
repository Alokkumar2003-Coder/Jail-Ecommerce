import db from '../models/index.js';
import cloudinary from '../utils/cloudinary.js';
import { Op } from 'sequelize';

const slugify = (str) =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getBlogs = async (req, res) => {
  try {
    const { search, all } = req.query;
    const where = {};

    // Public sees only published; admin may request all
    const isAdmin = req.user?.role === 'admin';
    if (!(all && isAdmin)) {
      where.published = true;
    }

    if (search && search.trim() !== '') {
      where[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { excerpt: { [Op.like]: `%${search.trim()}%` } },
        { content: { [Op.like]: `%${search.trim()}%` } },
        { tags: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const blogs = await db.Blog.findAll({
      where,
      include: [{ model: db.User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlog = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isNumeric = /^\d+$/.test(slugOrId);

    const where = isNumeric
      ? { id: Number(slugOrId) }
      : { slug: slugOrId.toLowerCase() };

    const blog = await db.Blog.findOne({
      where,
      include: [{ model: db.User, as: 'author', attributes: ['id', 'name'] }],
    });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Block viewing unpublished blogs unless admin
    if (!blog.published && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, images, tags, published } = req.body;

    let baseSlug = slugify(title || '');
    if (!baseSlug) return res.status(400).json({ message: 'Invalid title' });

    let finalSlug = baseSlug;
    const existing = await db.Blog.findOne({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now()}`;
    }

    const blog = await db.Blog.create({
      title,
      slug: finalSlug,
      excerpt: excerpt ?? null,
      content,
      coverImage: coverImage ?? null,
      images: images ?? null,
      tags: Array.isArray(tags) ? tags : undefined,
      published: !!published,
      publishedAt: published ? new Date() : null,
      authorId: req.user.id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const {
      title,
      excerpt,
      content,
      coverImage,
      images,
      tags,
      published,
    } = req.body;

    if (title && title !== blog.title) {
      const newSlug = slugify(title);
      if (newSlug && newSlug !== blog.slug) {
        const exists = await db.Blog.findOne({ where: { slug: newSlug } });
        blog.slug = exists ? `${newSlug}-${Date.now()}` : newSlug;
      }
      blog.title = title;
    }

    blog.excerpt = excerpt ?? blog.excerpt;
    blog.content = content ?? blog.content;
    blog.coverImage = coverImage ?? blog.coverImage;
    blog.images = images ?? blog.images;
    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : blog.tags;
    }

    if (typeof published === 'boolean') {
      // set publishedAt accordingly
      if (!blog.published && published) {
        blog.publishedAt = new Date();
      } else if (blog.published && !published) {
        blog.publishedAt = null;
      }
      blog.published = published;
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await blog.destroy();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    cloudinary.uploader
      .upload_stream({ folder: 'ecommerce/blogs' }, (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ url: result.secure_url });
      })
      .end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};