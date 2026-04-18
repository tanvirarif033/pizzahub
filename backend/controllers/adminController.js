const { User } = require('../models');

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch users' });
  }
};

// UPDATE ROLE
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    await User.update(
      { role },
      { where: { id: req.params.id } }
    );

    res.json({ msg: 'Role updated' });

  } catch (err) {
    res.status(500).json({ msg: 'Update failed' });
  }
};