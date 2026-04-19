const express = require('express');
const router = express.Router();

const {
  createPizza,
  getPizzas,
  updatePizza,
  deletePizza,
  getMostOrdered,
  getTrending,
 // getRecommended
} = require('../controllers/pizzaController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');


// router.get('/recommended', auth, getRecommended);

// 🍕 PUBLIC
router.get('/', getPizzas);
router.get('/most-ordered', getMostOrdered);
router.get('/trending', getTrending);

// 🔐 ADMIN
router.post('/', auth, admin, upload.single('image'), createPizza);
router.put('/:id', auth, admin, upload.single('image'), updatePizza);
router.delete('/:id', auth, admin, deletePizza);

module.exports = router;