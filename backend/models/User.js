// models/User.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },

    // ✅ FIX 1: profilePic column added so it actually gets saved to the DB
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: 'UserId' });
  };

  return User;
};