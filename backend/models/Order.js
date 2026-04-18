module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    totalPrice: DataTypes.DOUBLE,
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'OrderId',
      as: 'OrderItems'       // 🔥 alias
    });
  };

  return Order;
};