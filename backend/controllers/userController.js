const { User } = require('../models');
const bcrypt = require('bcryptjs');

// 🔹 Get my profile
exports.getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  res.json(user);
};

// 🔹 Update profile (email change allowed না)
exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;

  const updateData = {};

  if (name) updateData.name = name;

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updateData.password = hash;
  }

  await User.update(updateData, {
    where: { id: req.user.id }
  });

  res.json({ msg: 'Profile updated' });
};

// 🔹 Upload profile picture
exports.uploadProfilePic = async (req, res) => {
  const imageUrl = req.file.path;

  await User.update(
    { profilePic: imageUrl },
    { where: { id: req.user.id } }
  );

  res.json({ msg: 'Profile picture updated', imageUrl });
};

// 🔹 Admin: get all users
exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

// 🔹 Admin: update role
exports.updateUserRole = async (req, res) => {
  await User.update(
    { role: req.body.role },
    { where: { id: req.params.id } }
  );

  res.json({ msg: 'Role updated' });
};