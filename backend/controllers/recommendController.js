const { OrderItem, Pizza } = require('../models');

// 🤖 Recommendation
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // get user's ordered pizzas
    const orders = await OrderItem.findAll({
      include: [
        {
          model: Pizza
        },
        {
          model: require('../models').Order,
          where: { UserId: userId }
        }
      ]
    });

    if (orders.length > 0) {
      // personalized (return unique pizzas)
      const pizzas = [...new Set(orders.map(o => o.Pizza))];
      return res.json(pizzas);
    }

    // fallback → popular pizzas
    const popular = await OrderItem.findAll({
      include: [Pizza],
      limit: 5
    });

    const pizzas = popular.map(p => p.Pizza);

    res.json(pizzas);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};