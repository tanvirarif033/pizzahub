const express = require('express');
const router = express.Router();

const { getAllUsers, updateUserRole } = require('../controllers/adminController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// 🔐 Admin only
router.get('/users', auth, admin, getAllUsers);
router.put('/users/:id', auth, admin, updateUserRole);

module.exports = router;