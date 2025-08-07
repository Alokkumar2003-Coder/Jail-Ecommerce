import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js';
import dotenv from 'dotenv';
import { generateToken } from '../utils/jwt.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await db.User.findOne({ where: { googleId: profile.id } });
        if (!user) {
          user = await db.User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: 'GOOGLE_OAUTH',
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await db.User.findByPk(id);
  done(null, user);
});

export default passport;