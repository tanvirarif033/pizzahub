const router = require('express').Router();

const {
  getUsers,
  updateUserRole,
  getProfile,
  updateProfile,
  uploadProfilePic
} = require('../controllers/userController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

// 🔹 Profile routes (User + Admin both)
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.put('/me/photo', auth, upload.single('image'), uploadProfilePic);

// 🔹 Admin routes
router.get('/', auth, admin, getUsers);
router.put('/:id', auth, admin, updateUserRole);

module.exports = router;