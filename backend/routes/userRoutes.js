const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadProfilePic
} = require('../controllers/userController');

const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // multer/cloudinary

// 🔹 PROFILE
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

// 🔥 PHOTO UPLOAD
router.put('/me/photo', auth, upload.single('image'), uploadProfilePic);

module.exports = router;