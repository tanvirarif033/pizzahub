// models/User.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true, // allow null for edge cases
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Google users won't have a password
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // NEW: store Google OAuth ID
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: 'UserId' });
  };

  return User;
};