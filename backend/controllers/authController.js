import db from '../models/index.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await db.User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await hashPassword(password);
    const user = await db.User.create({ name, email, password: hashed });
    const token = generateToken(user);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};