import express from 'express';
import passport from '../middleware/googleAuth.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    // For production, redirect to frontend with token as query param
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      token,
    });
  }
);

export default router;