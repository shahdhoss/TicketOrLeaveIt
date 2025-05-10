const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  usersPOST,
  usersIdGET,
  usersIdPATCH,
  usersIdDELETE
} = require('../services/DefaultService');

// Public route for OAuth user creation/update
router.post('/', usersPOST);

// Protected routes
router.get('/:id', verifyToken, usersIdGET);
router.patch('/:id', verifyToken, usersIdPATCH);
router.delete('/:id', verifyToken, usersIdDELETE);

module.exports = router;