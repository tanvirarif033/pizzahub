import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  // 🔼 Increase quantity
  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  // 🔽 Decrease quantity
  const decreaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  // ❌ Remove item
  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  // 💰 Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🧾 Place Order
  const placeOrder = async () => {
    try {
      alert('Payment Successful 💳');

      const items = cart.map(item => ({
        pizzaId: item.id,
        quantity: item.quantity
      }));

      await API.post('/orders', { items });

      alert('Order placed successfully 🎉');

      localStorage.removeItem('cart');
      setCart([]);

      navigate('/orders');

    } catch {
      alert('Order failed ❌');
    }
  };

  return (
    <div className="container">

      <h2 className="mb-4 fw-bold text-center">🛒 Your Cart</h2>

      {/* 🔥 EMPTY CART */}
      {cart.length === 0 && (
        <div className="text-center mt-5">
          <h4>No items in cart 😢</h4>
          <button
            className="btn btn-dark mt-3"
            onClick={() => navigate('/')}
          >
            Go to Menu 🍕
          </button>
        </div>
      )}

      {/* 🔥 CART ITEMS */}
      {cart.map(item => (
        <div
          key={item.id}
          className="card shadow-sm border-0 rounded-4 mb-3 p-3"
        >
          <div className="d-flex justify-content-between align-items-center">

            {/* LEFT */}
            <div className="d-flex align-items-center">
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
              />

              <div className="ms-3">
                <h5 className="mb-1">{item.name}</h5>
                <small className="text-muted">
                  {item.price} Tk × {item.quantity}
                </small>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-end">

              {/* 🔥 QUANTITY */}
              <div className="d-flex align-items-center justify-content-end mb-2">

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => decreaseQty(item.id)}
                >
                  −
                </button>

                <span className="mx-3 fw-bold">
                  {item.quantity}
                </span>

                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => increaseQty(item.id)}
                >
                  +
                </button>
              </div>

              {/* PRICE */}
              <div className="fw-bold text-success mb-2">
                {item.price * item.quantity} Tk
              </div>

              {/* REMOVE */}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeItem(item.id)}
              >
                Remove ❌
              </button>

            </div>

          </div>
        </div>
      ))}

      {/* 🔥 TOTAL + CHECKOUT */}
      {cart.length > 0 && (
        <div className="card shadow-lg border-0 p-4 mt-4">

          <div className="d-flex justify-content-between align-items-center">
            <h4>Total</h4>
            <h3 className="text-success">{total} Tk</h3>
          </div>

          <button
            className="btn btn-success w-100 mt-3"
            onClick={placeOrder}
          >
            Checkout & Place Order 🚀
          </button>

        </div>
      )}

    </div>
  );
};

export default Cart;