module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'user' }
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'UserId'
    });
  };

  return User;
};