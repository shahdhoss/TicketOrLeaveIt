const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const { createAccessToken, createRefreshToken, verifyToken } = require('../utils/jwt');
const verifyAccessToken = require('../middleware/verifyToken');
const { publishMessage } = require('../messaging/messagePublisher');
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

    const accessTokenGoogle = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessTokenGoogle}`
      }
    });

    const { sub, email, name } = userResponse.data;

    let user = await User.findOne({ where: { google_sub: sub } });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        google_sub: sub,
        email,
        name,
        role: 'user'
      });
      isNewUser = true;
    }

    const payload = {
      user_id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sub: user.google_sub
    };

    const access_token = createAccessToken(payload);
    const refresh_token = createRefreshToken(payload);

    // Send message to user service about login
    await publishMessage({
      type: isNewUser ? 'USER_CREATED' : 'USER_LOGGED_IN',
      data: {
        user_id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        access_token,
        refresh_token
      }
    });

    res.json({
      message: 'Logged in',
      access_token,
      refresh_token
    });

  } catch (err) {
    console.error('Google OAuth error:', err.response?.data || err.message);
    res.status(500).json({ error: 'OAuth callback failed' });
  }
});

// user info
router.get('/me', verifyAccessToken, (req, res) => {
  res.json({ user: req.user });
});

// Refresh access token
router.post('/token', (req, res) => {
  const refresh_token = req.body.refresh_token || req.query.token;

  if (!refresh_token) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }

  const payload = verifyToken(refresh_token);
  if (!payload) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }

  const access_token = createAccessToken(payload);
  res.json({ access_token });
});

// Update user role to admin and generate new tokens
router.post('/adminme', verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    // Create new payload with updated role
    const payload = {
      user_id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sub: user.google_sub
    };

    // Generate new tokens
    const access_token = createAccessToken(payload);
    const refresh_token = createRefreshToken(payload);

    // Send message to user service
    await publishMessage({
      type: 'ROLE_UPDATED',
      data: {
        user_id: user.id,
        new_role: user.role,
        access_token,
        refresh_token
      }
    });

    res.json({
      message: 'Role updated to admin',
      access_token,
      refresh_token
    });

  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

router.post('/logout', (req, res) => {

  res.json({ message: 'Logged out (client should delete tokens)' });
});

module.exports = router;
