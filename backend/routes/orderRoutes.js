const router = require('express').Router();

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// 🔹 USER ROUTES
router.post('/', auth, placeOrder);
router.get('/', auth, getUserOrders);

// 🔹 ADMIN ROUTES
router.get('/all', auth, admin, getAllOrders);

// 🔥 THIS LINE YOU ASKED ABOUT
router.put('/:id', auth, admin, updateOrderStatus);

module.exports = router;