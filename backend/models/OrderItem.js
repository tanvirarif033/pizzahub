module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantity: DataTypes.INTEGER
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'OrderId'
    });

    OrderItem.belongsTo(models.Pizza, {
      foreignKey: 'PizzaId',
      as: 'Pizza'           // 🔥 alias
    });
  };

  return OrderItem;
};

