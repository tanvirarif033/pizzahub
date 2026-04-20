const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

const { register, login } = require('../controllers/authController');

// ── Email/Password ────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);

// ── Google OAuth ──────────────────────────────────────────────

// Step 1: Send user to Google
// Frontend calls: window.location.href = 'http://localhost:5000/api/auth/google'
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects back here
// This MUST match exactly what's in .env GOOGLE_CALLBACK_URL
// and in Google Cloud Console authorized redirect URIs
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET
    );

    const user = JSON.stringify(req.user);

    // Redirect frontend to the success page with token + user
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontendURL}/auth/google/success?token=${token}&user=${encodeURIComponent(user)}`
    );
  }
);

module.exports = router;