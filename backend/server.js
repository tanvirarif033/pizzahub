const express = require('express');
const cors = require('cors');
require('dotenv').config();

// DB
const { connectDB, sequelize } = require('./config/db');

// Models (VERY IMPORTANT)
require('./models');

// Routes
const authRoutes = require('./routes/authRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const recommendRoutes = require('./routes/recommendRoutes');
const userRoutes =require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('PizzaHub API Running 🍕');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
// Port
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    // 1. Connect DB
    await connectDB();

    // 2. Sync Models
    await sequelize.sync();

    console.log('Tables created ✅');

    // 3. Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server Error:', error);
  }
};

startServer();