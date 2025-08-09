import express from 'express';
import passport from '../middleware/googleAuth.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: (process.env.FRONTEND_URL || '') + '/login',
  }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontendURL =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      process.env.NEXT_PUBLIC_FRONTEND_URL;

    if (frontendURL) {
      const redirectUrl = `${frontendURL.replace(/\/$/, '')}/callback?token=${encodeURIComponent(token)}`;
      return res.redirect(302, redirectUrl);
    }

    // Fallback only if no frontend URL is configured
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