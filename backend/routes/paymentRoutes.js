const express = require('express');
const router = express.Router();

// 🔥 FIX: correct import
const { createPaymentIntent } = require('../controllers/paymentController');

const auth = require('../middleware/authMiddleware');

// 🔥 ROUTE
router.post('/create-payment-intent', auth, createPaymentIntent);

module.exports = router;