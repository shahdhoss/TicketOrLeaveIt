const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const { createRefreshToken, verifyToken } = require('../utils/jwt');
const verifyRefreshToken = require('../middleware/verifyToken');
const router = express.Router();
require('dotenv').config();

router.get('/login', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/auth?` +
    `response_type=code&` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.REDIRECT_URI}&` +
    `scope=openid%20profile%20email`;

  res.json({ login_url: url });
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const { sub, email, name } = userResponse.data;

    let user = await User.findOne({ where: { google_sub: sub } });

    if (!user) {
      user = await User.create({
        google_sub: sub,
        email,
        name,
        role: 'user'
      });
    }

    const refreshToken = createRefreshToken({
      user_id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sub: user.google_sub
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });

    res.json({ message: 'Logged in' });

  } catch (err) {
    console.error('Google OAuth error:', err.response?.data || err.message);
    res.status(500).json({ error: 'OAuth callback failed' });
  }
});

router.get('/me', verifyRefreshToken, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  });
  res.json({ message: 'Logged out' });
});

module.exports = router;
