const { Pizza, OrderItem, Order, Sequelize } = require('../models');
const { Op } = require('sequelize');

// ================= CREATE =================
exports.createPizza = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const image = req.file ? req.file.path : null;

    const pizza = await Pizza.create({
      name,
      category,
      price,
      image
    });

    res.json(pizza);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL =================
exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE =================
exports.updatePizza = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const pizza = await Pizza.findByPk(req.params.id);

    if (!pizza) {
      return res.status(404).json({ msg: 'Pizza not found' });
    }

    let image = pizza.image;

    if (req.file) {
      image = req.file.path;
    }

    await pizza.update({
      name,
      category,
      price,
      image
    });

    res.json({ msg: 'Updated successfully' });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deletePizza = async (req, res) => {
  try {
    await Pizza.destroy({
      where: { id: req.params.id }
    });

    res.json({ msg: 'Deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= MOST ORDERED =================
exports.getMostOrdered = async (req, res) => {
  try {
    const items = await OrderItem.findAll();

    if (!items.length) return res.json([]);

    const countMap = {};

    items.forEach(item => {
      if (!item.PizzaId) return;
      countMap[item.PizzaId] =
        (countMap[item.PizzaId] || 0) + item.quantity;
    });

    const sorted = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const ids = sorted.map(x => x[0]);

    const pizzas = await Pizza.findAll({
      where: { id: ids }
    });

    // 🔥 maintain order
    const ordered = ids.map(id =>
      pizzas.find(p => p.id == id)
    );

    res.json(ordered);

  } catch (err) {
    console.log("🔥 MOST ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= TRENDING =================
exports.getTrending = async (req, res) => {
  try {
    const items = await OrderItem.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (!items.length) return res.json([]);

    const countMap = {};

    items.forEach(item => {
      if (!item.PizzaId) return;
      countMap[item.PizzaId] =
        (countMap[item.PizzaId] || 0) + item.quantity;
    });

    const sorted = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const ids = sorted.map(x => x[0]);

    const pizzas = await Pizza.findAll({
      where: { id: ids }
    });

    const ordered = ids.map(id =>
      pizzas.find(p => p.id == id)
    );

    res.json(ordered);

  } catch (err) {
    console.log("🔥 TREND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= RECOMMENDED =================
// exports.getRecommended = async (req, res) => {
//   try {
//     // 🔐 safety check
//     if (!req.user) {
//       return res.json([]); // guest user fallback
//     }

//     const userId = req.user.id;

//     const orders = await OrderItem.findAll({
//       include: [{
//         model: Order,
//         where: { UserId: userId }
//       }]
//     });

//     if (!orders.length) {
//       return res.json([]);
//     }

//     const pizzaIds = [...new Set(
//       orders.map(o => o.PizzaId).filter(Boolean)
//     )];

//     const pizzas = await Pizza.findAll({
//       where: { id: pizzaIds },
//       limit: 6
//     });

//     res.json(pizzas);

//   } catch (err) {
//     console.log("🔥 RECOMMEND ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };