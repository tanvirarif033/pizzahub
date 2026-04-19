const { User } = require('../models');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
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



// 📸 Upload profile picture
exports.uploadProfilePic = async (req, res) => {
  try {
    console.log("USER ID:", req.user.id);

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // 🔥 যদি multer-cloudinary use করো
    const imageUrl = req.file.path;

    await User.update(
      { profilePic: imageUrl },
      { where: { id: req.user.id } }
    );

    // 🔥 UPDATED USER RETURN
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      msg: 'Profile picture updated',
      imageUrl,
      user: updatedUser
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: 'Upload failed' });
  }
};
// 🔹 Admin: update role
exports.updateUserRole = async (req, res) => {
  await User.update(
    { role: req.body.role },
    { where: { id: req.params.id } }
  );

  res.json({ msg: 'Role updated' });
};