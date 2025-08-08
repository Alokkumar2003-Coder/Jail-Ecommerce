import db from '../models/index.js';
import { Op } from 'sequelize';
import cloudinary from '../utils/cloudinary.js';
import { hashPassword } from '../utils/hash.js';

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

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'avatar', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 'dateOfBirth', 'gender', 'createdAt'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update current user profile
export const updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      currentPassword, 
      newPassword, 
      phone, 
      address, 
      city, 
      state, 
      zipCode, 
      country, 
      dateOfBirth, 
      gender 
    } = req.body;
    
    const user = await db.User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    // Update basic info
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (zipCode !== undefined) user.zipCode = zipCode;
    if (country !== undefined) user.country = country;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }
      
      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      user.password = await hashPassword(newPassword);
    }

    await user.save();
    
    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      createdAt: user.createdAt,
    };
    
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    cloudinary.uploader.upload_stream(
      { folder: 'ecommerce/avatars' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        
        try {
          const user = await db.User.findByPk(req.user.id);
          if (!user) return res.status(404).json({ message: 'User not found' });
          
          user.avatar = result.secure_url;
          await user.save();
          
          res.json({ avatar: result.secure_url });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    ).end(req.file.buffer);
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

