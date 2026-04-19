// controllers/userController.js

const { User } = require('../models');
const bcrypt = require('bcryptjs');

// ─────────────────────────────────────────
// GET /users/me
// ─────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('GET PROFILE ERROR:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ─────────────────────────────────────────
// PUT /users/me  (name / password update)
// ─────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await User.update(updateData, { where: { id: req.user.id } });

    // ✅ FIX 2: Return the full updated user (excluding password)
    // so the frontend can sync localStorage immediately
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ msg: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
    res.status(500).json({ msg: 'Update failed' });
  }
};

// ─────────────────────────────────────────
// PUT /users/me/photo  (profile picture)
// ─────────────────────────────────────────
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // multer-storage-cloudinary puts the URL in req.file.path
    const imageUrl = req.file.path;

    // ✅ FIX 3: profilePic column now exists in the model,
    // so this update actually persists to the database
    await User.update(
      { profilePic: imageUrl },
      { where: { id: req.user.id } }
    );

    // ✅ FIX 4: Return the full updated user so frontend
    // can store it in localStorage and state together
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      msg: 'Profile picture updated',
      imageUrl,
      user: updatedUser   // ← frontend uses this to update localStorage
    });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ msg: 'Upload failed' });
  }
};

// ─────────────────────────────────────────
// PUT /admin/users/:id  (role change)
// ─────────────────────────────────────────
exports.updateUserRole = async (req, res) => {
  try {
    await User.update(
      { role: req.body.role },
      { where: { id: req.params.id } }
    );
    res.json({ msg: 'Role updated' });
  } catch (err) {
    console.error('ROLE UPDATE ERROR:', err);
    res.status(500).json({ msg: 'Failed to update role' });
  }
};