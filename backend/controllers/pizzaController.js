const { Pizza } = require('../models');

// ➕ Create Pizza (with image)
exports.createPizza = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const image = req.file.path; // Cloudinary URL

    const pizza = await Pizza.create({
      name,
      category,
      price,
      image
    });

    res.json(pizza);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get all pizzas
exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.findAll();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE
exports.updatePizza = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    await Pizza.update(updateData, {
      where: { id: req.params.id }
    });

    res.json({ msg: 'Pizza updated successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete pizza
exports.deletePizza = async (req, res) => {
  try {
    const { id } = req.params;

    await Pizza.destroy({
      where: { id }
    });

    res.json({ msg: 'Pizza deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};