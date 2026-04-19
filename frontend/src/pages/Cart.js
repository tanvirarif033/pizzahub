import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';



const Cart = () => {
  const navigate = useNavigate();
  // const [cart, setCart] = useState(
  //   JSON.parse(localStorage.getItem('cart')) || []
  // );
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(false);

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const decreaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const grandTotal = total + deliveryFee;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map(item => ({ pizzaId: item.id, quantity: item.quantity }));
      await API.post('/orders', { items });
      localStorage.removeItem('cart');
      setCart([]);
      navigate('/orders');
    } catch {
      alert('Order failed ❌ Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-cart-root {
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'Nunito', sans-serif;
          padding: 32px 0 80px;
        }

        .ph-cart-header {
          text-align: center;
          margin-bottom: 36px;
          animation: fadeDown 0.4s ease both;
        }

        .ph-cart-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 48px;
          letter-spacing: 3px;
          color: #fff;
          line-height: 1;
        }

        .ph-cart-title span {
          background: linear-gradient(135deg, #ff5000, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ph-cart-subtitle {
          color: #555;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          margin-top: 4px;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* EMPTY CART */
        .ph-empty-cart {
          text-align: center;
          padding: 80px 20px;
          animation: fadeDown 0.5s ease both;
        }

        .ph-empty-emoji {
          font-size: 80px;
          display: block;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .ph-empty-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 36px;
          color: #fff;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .ph-empty-sub {
          color: #555;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 28px;
        }

        /* ITEM CARD */
        .ph-cart-item {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          padding: 20px 24px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          transition: border-color 0.2s, transform 0.2s;
          animation: slideIn 0.35s ease both;
        }

        .ph-cart-item:hover {
          border-color: rgba(255,80,0,0.25);
          transform: translateX(4px);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .ph-item-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 14px;
          flex-shrink: 0;
          border: 2px solid #2a2a2a;
        }

        .ph-item-info {
          flex: 1;
          min-width: 0;
        }

        .ph-item-name {
          color: #fff;
          font-size: 17px;
          font-weight: 800;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ph-item-unit-price {
          color: #555;
          font-size: 13px;
          font-weight: 600;
        }

        .ph-item-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .ph-qty-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 50px;
          padding: 6px 14px;
        }

        .ph-qty-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
        }

        .ph-qty-btn.minus { color: #ff5000; }
        .ph-qty-btn.minus:hover { color: #ff2200; }
        .ph-qty-btn.plus { color: #22cc66; }
        .ph-qty-btn.plus:hover { color: #00ff88; }

        .ph-qty-num {
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          min-width: 20px;
          text-align: center;
        }

        .ph-item-subtotal {
          color: #ff8c00;
          font-size: 16px;
          font-weight: 900;
        }

        .ph-remove-btn {
          background: rgba(255,50,50,0.1);
          border: 1px solid rgba(255,50,50,0.2);
          border-radius: 8px;
          color: #ff6b6b;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 5px 12px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .ph-remove-btn:hover {
          background: rgba(255,50,50,0.2);
          border-color: rgba(255,50,50,0.4);
        }

        /* SUMMARY CARD */
        .ph-summary-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 24px;
          padding: 28px;
          margin-top: 8px;
          animation: fadeUp 0.4s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ph-summary-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 24px;
          letter-spacing: 2px;
          color: #fff;
          margin-bottom: 20px;
        }

        .ph-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .ph-summary-label {
          color: #666;
          font-size: 14px;
          font-weight: 700;
        }

        .ph-summary-value {
          color: #aaa;
          font-size: 14px;
          font-weight: 700;
        }

        .ph-summary-divider {
          height: 1px;
          background: #2a2a2a;
          margin: 16px 0;
        }

        .ph-summary-total-label {
          color: #fff;
          font-size: 18px;
          font-weight: 900;
        }

        .ph-summary-total-value {
          color: #ff5000;
          font-size: 24px;
          font-weight: 900;
        }

        .ph-checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff5000, #ff2200);
          border: none;
          border-radius: 14px;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 17px;
          font-weight: 800;
          padding: 16px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 10px 30px rgba(255,80,0,0.35);
          margin-top: 20px;
          letter-spacing: 0.3px;
        }

        .ph-checkout-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(255,80,0,0.5);
        }

        .ph-checkout-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ph-back-btn {
          background: transparent;
          border: 1.5px solid #2a2a2a;
          border-radius: 12px;
          color: #888;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 12px 20px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .ph-back-btn:hover {
          border-color: #ff5000;
          color: #ff5000;
        }

        .ph-guarantee-row {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .ph-guarantee-chip {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 10px;
          text-align: center;
          color: #555;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .ph-guarantee-chip span {
          display: block;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .ph-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .ph-back-btn-text {
          display: inline-block;
          background: transparent;
          border: 1.5px solid #2a2a2a;
          border-radius: 12px;
          color: #888;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 12px 20px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          text-decoration: none;
        }

        .ph-back-btn-text:hover { border-color: #ff5000; color: #ff5000; }
      `}</style>

      <div className="ph-cart-root">
        <div className="container" style={{ maxWidth: '720px' }}>

          <div className="ph-cart-header">
            <div className="ph-cart-title">Your <span>Cart</span></div>
            <div className="ph-cart-subtitle">
              {cart.length > 0
                ? `${cart.reduce((s, i) => s + i.quantity, 0)} items ready to order`
                : 'Nothing in here yet'}
            </div>
          </div>

          {/* EMPTY */}
          {cart.length === 0 && (
            <div className="ph-empty-cart">
              <span className="ph-empty-emoji">🍕</span>
              <div className="ph-empty-title">Your cart is empty</div>
              <div className="ph-empty-sub">Looks like you haven't added any pizzas yet!</div>
              <button className="ph-checkout-btn" style={{ maxWidth: 260, margin: '0 auto' }}
                onClick={() => navigate('/')}>
                Browse Menu 🍕
              </button>
            </div>
          )}

          {/* ITEMS */}
          {cart.length > 0 && (
            <>
              <button className="ph-back-btn" onClick={() => navigate('/')}>
                ← Add more items
              </button>

              {cart.map((item, i) => (
                <div
                  className="ph-cart-item"
                  key={item.id}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <img src={item.image} alt={item.name} className="ph-item-img" />

                  <div className="ph-item-info">
                    <div className="ph-item-name">{item.name}</div>
                    <div className="ph-item-unit-price">{item.price} Tk each</div>
                  </div>

                  <div className="ph-item-controls">
                    <div className="ph-qty-row">
                      <button className="ph-qty-btn minus" onClick={() => decreaseQty(item.id)}>−</button>
                      <span className="ph-qty-num">{item.quantity}</span>
                      <button className="ph-qty-btn plus" onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                    <div className="ph-item-subtotal">{item.price * item.quantity} Tk</div>
                    <button className="ph-remove-btn" onClick={() => removeItem(item.id)}>Remove ✕</button>
                  </div>
                </div>
              ))}

              {/* SUMMARY */}
              <div className="ph-summary-card">
                <div className="ph-summary-title">Order Summary</div>

                <div className="ph-summary-row">
                  <span className="ph-summary-label">Subtotal</span>
                  <span className="ph-summary-value">{total} Tk</span>
                </div>
                <div className="ph-summary-row">
                  <span className="ph-summary-label">Delivery Fee</span>
                  <span className="ph-summary-value">{deliveryFee} Tk</span>
                </div>

                <div className="ph-summary-divider"></div>

                <div className="ph-summary-row">
                  <span className="ph-summary-total-label">Total</span>
                  <span className="ph-summary-total-value">{grandTotal} Tk</span>
                </div>

                <button className="ph-checkout-btn" onClick={placeOrder} disabled={loading}>
                  {loading
                    ? <><span className="ph-spinner"></span>Placing Order...</>
                    : '🚀 Checkout & Place Order'}
                </button>

                <div className="ph-guarantee-row">
                  <div className="ph-guarantee-chip">
                    <span>⚡</span>30-MIN DELIVERY
                  </div>
                  <div className="ph-guarantee-chip">
                    <span>🔒</span>SECURE PAYMENT
                  </div>
                  <div className="ph-guarantee-chip">
                    <span>🍕</span>FRESH & HOT
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Cart;