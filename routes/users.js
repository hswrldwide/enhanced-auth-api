const express = require('express');
const User = require('../models/User');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Get own profile
router.get('/me', authenticate, async (req, res) => {
  res.send(req.user);
});

// Update profile
router.patch('/me', authenticate, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'bio', 'phone', 'profilePhoto', 'isPublic'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get public profiles
router.get('/', authenticate, async (req, res) => {
  const users = await User.find({ isPublic: true });
  res.send(users);
});

// Get all profiles (admin only)
router.get('/all', authenticate, authorizeAdmin, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Get user profile by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || (!user.isPublic && !req.user.isAdmin)) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
