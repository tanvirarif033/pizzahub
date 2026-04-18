const { Order, OrderItem, Pizza, User } = require('../models');

// =============================
// 🔥 PLACE ORDER (USER)
// =============================
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'No items provided' });
    }

    let total = 0;

    // calculate total
    for (let i of items) {
      const pizza = await Pizza.findByPk(i.pizzaId);

      if (!pizza) {
        return res.status(404).json({ msg: 'Pizza not found' });
      }

      total += pizza.price * i.quantity;
    }

    // create order
    const order = await Order.create({
      totalPrice: total,
      status: 'pending',
      UserId: req.user.id
    });

    // create order items
    for (let i of items) {
      await OrderItem.create({
        OrderId: order.id,
        PizzaId: i.pizzaId,
        quantity: i.quantity
      });
    }

    res.json({
      msg: 'Order placed successfully',
      order
    });

  } catch (error) {
    console.error('PLACE ORDER ERROR:', error);
    res.status(500).json({ msg: 'Order failed' });
  }
};


// =============================
// 🔥 GET USER ORDERS
// =============================
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id }, // ✅ IMPORTANT
      include: [
        {
          model: OrderItem,
          as: 'OrderItems', // 🔥 must match alias
          include: [
            {
              model: Pizza,
              as: 'Pizza'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);

  } catch (error) {
    console.error('GET USER ORDERS ERROR:', error);
    res.status(500).json({ msg: 'Failed to fetch orders' });
  }
};


// =============================
// 🔥 ADMIN - GET ALL ORDERS
// =============================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          include: [
            {
              model: Pizza
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);

  } catch (error) {
    console.error("🔥 ADMIN ORDERS ERROR:", error);
    res.status(500).json({ msg: 'Failed to fetch orders' });
  }
};


// =============================
// 🔥 UPDATE ORDER STATUS (ADMIN)
// =============================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ['pending', 'delivered', 'cancelled'];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      msg: 'Order status updated',
      order
    });

  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error);
    res.status(500).json({ msg: 'Status update failed' });
  }
};