const express = require('express');
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

const auth = require('../middleware/authMiddleware');

// 🔥 IMPORTANT
router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlist);
router.delete('/:id', auth, removeFromWishlist);

module.exports = router;