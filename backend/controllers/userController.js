import db from '../models/index.js';
import { Op } from 'sequelize';

// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.role = role;
    await user.save();
    
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    console.log('Getting user statistics...');
    
    const totalUsers = await db.User.count();
    console.log('Total users:', totalUsers);
    
    const adminUsers = await db.User.count({ where: { role: 'admin' } });
    console.log('Admin users:', adminUsers);
    
    const regularUsers = await db.User.count({ where: { role: 'user' } });
    console.log('Regular users:', regularUsers);
    
    // Get users registered in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    console.log('Thirty days ago:', thirtyDaysAgo);
    
    const newUsers = await db.User.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });
    console.log('New users:', newUsers);

    const stats = {
      totalUsers,
      adminUsers,
      regularUsers,
      newUsers,
      userGrowth: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : '0.0'
    };
    
    console.log('Final stats:', stats);
    res.json(stats);
  } catch (err) {
    console.error('Error in getUserStats:', err);
    res.status(500).json({ message: err.message });
  }
};

