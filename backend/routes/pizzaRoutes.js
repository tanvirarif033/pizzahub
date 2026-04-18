const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  getPizzas,
  createPizza,
  updatePizza,
  deletePizza
} = require('../controllers/pizzaController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', getPizzas);


router.post('/', auth, admin, upload.single('image'), createPizza);

router.put('/:id', auth, admin, upload.single('image'), updatePizza);

router.delete('/:id', auth, admin, deletePizza);

module.exports = router;