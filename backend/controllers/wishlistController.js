const { Wishlist, Pizza } = require('../models');

// ➕ ADD
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pizzaId } = req.body;

    if (!pizzaId) {
      return res.status(400).json({ msg: 'pizzaId required' });
    }

    await Wishlist.create({
      UserId: userId,
      PizzaId: pizzaId
    });

    res.json({ msg: 'Added to wishlist' });

  } catch (err) {
    console.log("ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// 📥 GET (SAFE VERSION)
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await Wishlist.findAll({
      where: { UserId: userId },
      include: [Pizza]
    });

    const pizzas = data.map(w => w.Pizza);

    res.json(pizzas);

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// ❌ REMOVE
exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.destroy({
      where: {
        UserId: req.user.id,
        PizzaId: req.params.id
      }
    });

    res.json({ msg: 'Removed' });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};