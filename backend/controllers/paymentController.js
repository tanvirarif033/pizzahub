const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🔥 CREATE PAYMENT INTENT
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ msg: 'Amount required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    console.log("❌ STRIPE ERROR:", err.message);
    res.status(500).json({ msg: 'Payment failed' });
  }
};

// 🔥 VERY IMPORTANT EXPORT
module.exports = {
  createPaymentIntent
};