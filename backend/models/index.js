// models/index.js
const { sequelize } = require('../config/db'); // ✅ reuse same instance
const { DataTypes } = require('sequelize');

// import models
const User = require('./User')(sequelize, DataTypes);
const Pizza = require('./Pizza')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);

// ================== RELATIONS (EXPLICIT FKs) ==================

// User ↔ Order
User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: 'OrderId' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

// Pizza ↔ OrderItem
Pizza.hasMany(OrderItem, { foreignKey: 'PizzaId' });
OrderItem.belongsTo(Pizza, { foreignKey: 'PizzaId' });

// =============================================================

module.exports = {
  sequelize,
  User,
  Pizza,
  Order,
  OrderItem
};