const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('BODY:', req.body); // 👈 input check

    const { name, email, password } = req.body;

    const bcrypt = require('bcryptjs'); // 👈 ensure import

    const hash = await bcrypt.hash(password, 10);

    const { User } = require('../models'); // 👈 ensure correct import

    const user = await User.create({
      name,
      email,
      password: hash
    });

    res.json(user);

  } catch (error) {
    console.error('🔥 REGISTER ERROR:', error); // 👈 THIS IS KEY
    res.status(500).json({ msg: error.message });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(400).json({ msg: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: 'Wrong password' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};