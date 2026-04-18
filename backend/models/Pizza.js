module.exports = (sequelize, DataTypes) => {
  const Pizza = sequelize.define('Pizza', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.STRING
  });

  Pizza.associate = (models) => {
    Pizza.hasMany(models.OrderItem, {
      foreignKey: 'PizzaId'
    });
  };

  return Pizza;
};