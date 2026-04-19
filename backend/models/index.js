const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// models
const User = require('./User')(sequelize, DataTypes);
const Pizza = require('./Pizza')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);
const Wishlist = require('./Wishlist')(sequelize, DataTypes);

// ================= RELATIONS =================

// User ↔ Order
User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: 'OrderId' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

// Pizza ↔ OrderItem
Pizza.hasMany(OrderItem, { foreignKey: 'PizzaId' });
OrderItem.belongsTo(Pizza, {
  foreignKey: 'PizzaId',
  as: 'Pizza'
});

// 🔥 Wishlist relations (VERY IMPORTANT)
User.belongsToMany(Pizza, {
  through: Wishlist,
  foreignKey: 'UserId',
  otherKey: 'PizzaId'
});

Pizza.belongsToMany(User, {
  through: Wishlist,
  foreignKey: 'PizzaId',
  otherKey: 'UserId'
});

// 🔥 MUST HAVE
Wishlist.belongsTo(Pizza, { foreignKey: 'PizzaId' });
Wishlist.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
  sequelize,
  User,
  Pizza,
  Order,
  OrderItem,
  Wishlist
};