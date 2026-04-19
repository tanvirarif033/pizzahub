import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../services/stripe';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000/';
const getImage = (img) => {
  if (!img) return 'https://placehold.co/80x80/1a1a1a/555?text=🍕';
  if (img.startsWith('http')) return img;
  return BASE_URL + img;
};

/* ── STRIPE CHECKOUT ── */
const CheckoutForm = ({ cart, total, setCart, navigate }) => {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await API.post('/payment/create-payment-intent', { amount: total });
      const result = await stripe.confirmCardPayment(res.data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });
      if (result.error) { toast.error(result.error.message); setLoading(false); return; }
      await placeOrder(cart, setCart, navigate);
      toast.success('Payment Successful! Order placed 🎉');
    } catch {
      toast.error('Payment Failed ❌');
    }
    setLoading(false);
  };

  return (
    <div className="ph-payment-block">
      <div className="ph-card-element-wrap">
        <CardElement options={{
          style: {
            base: {
              color: '#fff', fontFamily: 'Nunito, sans-serif', fontSize: '15px',
              fontWeight: '700', '::placeholder': { color: '#444' }
            }
          }
        }} />
      </div>
      <button className="ph-checkout-btn" onClick={handlePayment} disabled={loading}>
        {loading ? <><span className="ph-spinner-sm"></span>Processing...</> : '💳 Pay & Place Order'}
      </button>
    </div>
  );
};

/* ── ORDER ── */
const placeOrder = async (cart, setCart, navigate) => {
  const items = cart.map(i => ({ pizzaId: i.id, quantity: i.quantity }));
  await API.post('/orders', { items });
  localStorage.removeItem('cart');
  setCart([]);
  navigate('/orders');
};

/* ── MAIN CART ── */
const Cart = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [bkash, setBkash] = useState('');
  const [nagad, setNagad] = useState('');
  const [loading, setLoading] = useState(false);

  const increaseQty = (id) => {
    const updated = cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
    setCart(updated);
  };
  const decreaseQty = (id) => {
    const updated = cart.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i);
    setCart(updated);
  };
  const removeItem = (id, name) => {
    setCart(cart.filter(i => i.id !== id));
    toast.error(`${name} removed from cart`);
  };

  const total      = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const grandTotal  = total + deliveryFee;

  const handleCOD = async () => {
    setLoading(true);
    try {
      await placeOrder(cart, setCart, navigate);
      toast.success('Order placed! Cash on Delivery 🚀');
    } catch {
      toast.error('Order failed ❌');
    }
    setLoading(false);
  };

  const handleMobilePay = async (number, method) => {
    if (number.length < 11) { toast.error(`Invalid ${method} number ❌`); return; }
    setLoading(true);
    try {
      await placeOrder(cart, setCart, navigate);
      toast.success(`${method} Payment Successful! 🎉`);
    } catch {
      toast.error('Order failed ❌');
    }
    setLoading(false);
  };

  const PAYMENT_METHODS = [
    { value: 'cod',   icon: '💵', label: 'Cash on Delivery' },
    { value: 'card',  icon: '💳', label: 'Card (Stripe)' },
    { value: 'bkash', icon: '📱', label: 'bKash' },
    { value: 'nagad', icon: '📱', label: 'Nagad' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-cart-root { font-family: 'Nunito', sans-serif; }

        .ph-cart-header { margin-bottom: 28px; animation: fadeDown 0.4s ease both; }
        .ph-cart-title {
          font-family: 'Bebas Neue', cursive; font-size: 48px;
          letter-spacing: 3px; color: #fff; line-height: 1;
        }
        .ph-cart-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-cart-sub { color: #555; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-top: 4px; }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .ph-cart-layout {
          display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start;
        }
        @media(max-width:900px){ .ph-cart-layout{ grid-template-columns: 1fr; } }

        /* EMPTY */
        .ph-cart-empty {
          text-align: center; padding: 80px 20px;
          animation: slideUp 0.5s ease both; grid-column: 1/-1;
        }
        .ph-empty-emoji { font-size: 80px; display: block; opacity: 0.4; margin-bottom: 20px; }
        .ph-empty-title { font-family: 'Bebas Neue', cursive; font-size: 36px; letter-spacing: 2px; color: #fff; margin-bottom: 8px; }
        .ph-empty-sub   { color: #555; font-size: 15px; font-weight: 600; margin-bottom: 28px; }
        .ph-empty-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 50px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
          padding: 14px 32px; text-decoration: none;
          box-shadow: 0 8px 24px rgba(255,80,0,0.3);
          transition: transform 0.15s;
        }
        .ph-empty-btn:hover { transform: translateY(-2px); color: #fff; }

        /* ITEM CARD */
        .ph-cart-item {
          background: #1a1a1a; border: 1px solid #222; border-radius: 18px;
          padding: 16px 20px; margin-bottom: 14px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.2s, transform 0.2s;
          animation: slideIn 0.35s ease both;
        }
        .ph-cart-item:hover { border-color: rgba(255,80,0,0.2); transform: translateX(4px); }

        .ph-item-img {
          width: 72px; height: 72px; object-fit: cover;
          border-radius: 12px; border: 2px solid #2a2a2a; flex-shrink: 0;
        }

        .ph-item-info { flex: 1; min-width: 0; }
        .ph-item-name { color: #fff; font-size: 16px; font-weight: 900; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ph-item-unit { color: #555; font-size: 13px; font-weight: 600; }

        .ph-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }

        .ph-qty-row {
          display: flex; align-items: center; gap: 12px;
          background: #111; border: 1px solid #2a2a2a; border-radius: 50px; padding: 5px 14px;
        }
        .ph-qty-btn {
          background: none; border: none; color: #fff; cursor: pointer;
          font-size: 18px; font-weight: 900; padding: 0; line-height: 1;
          width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
          transition: color 0.15s;
        }
        .ph-qty-btn.dec { color: #ff5000; } .ph-qty-btn.dec:hover { color: #ff2200; }
        .ph-qty-btn.inc { color: #22c55e; } .ph-qty-btn.inc:hover { color: #00ff88; }
        .ph-qty-num { color: #fff; font-size: 15px; font-weight: 900; min-width: 18px; text-align: center; }

        .ph-item-subtotal { color: #ff8c00; font-size: 16px; font-weight: 900; }

        .ph-rem-btn {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px; color: #ef4444; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
          padding: 4px 10px; letter-spacing: 0.3px; transition: background 0.15s;
        }
        .ph-rem-btn:hover { background: rgba(239,68,68,0.2); }

        /* SUMMARY */
        .ph-summary-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 20px;
          padding: 24px; animation: slideUp 0.4s ease both; position: sticky; top: 80px;
        }
        .ph-sum-title {
          font-family: 'Bebas Neue', cursive; font-size: 24px;
          letter-spacing: 2px; color: #fff; margin-bottom: 20px;
        }
        .ph-sum-row {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
        }
        .ph-sum-lbl { color: #666; font-size: 14px; font-weight: 700; }
        .ph-sum-val { color: #aaa; font-size: 14px; font-weight: 700; }
        .ph-sum-div { height: 1px; background: #222; margin: 14px 0; }
        .ph-sum-total-lbl { color: #fff; font-size: 18px; font-weight: 900; }
        .ph-sum-total-val { color: #ff5000; font-size: 26px; font-weight: 900; font-family: 'Bebas Neue', cursive; letter-spacing: 1px; }

        /* PAYMENT METHOD TABS */
        .ph-pay-lbl { color: #666; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 18px 0 10px; }
        .ph-pay-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .ph-pay-tab {
          background: #111; border: 1.5px solid #2a2a2a; border-radius: 11px;
          color: #666; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 800; padding: 10px 8px;
          text-align: center; transition: all 0.15s; letter-spacing: 0.3px;
        }
        .ph-pay-tab:hover { border-color: #ff5000; color: #ff8c00; }
        .ph-pay-tab.active {
          border-color: #ff5000; color: #fff;
          background: rgba(255,80,0,0.12); box-shadow: 0 0 0 1px rgba(255,80,0,0.2);
        }

        /* PAYMENT INPUTS */
        .ph-pay-inp {
          width: 100%; background: #111 !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 11px !important; color: #fff !important;
          font-family: 'Nunito', sans-serif; font-size: 14px !important; font-weight: 700;
          padding: 13px 16px !important; outline: none; transition: border-color 0.2s; margin-bottom: 12px;
        }
        .ph-pay-inp:focus { border-color: #ff5000 !important; }
        .ph-pay-inp::placeholder { color: #3a3a3a !important; }

        .ph-card-element-wrap {
          background: #111; border: 1.5px solid #2a2a2a; border-radius: 11px;
          padding: 14px 16px; margin-bottom: 14px;
        }

        .ph-payment-block { margin-top: 4px; }

        .ph-checkout-btn {
          width: 100%; background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 13px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 16px; font-weight: 900;
          padding: 15px; transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 8px 24px rgba(255,80,0,0.3); display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ph-checkout-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(255,80,0,0.45); }
        .ph-checkout-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ph-guarantee-row {
          display: flex; gap: 8px; margin-top: 16px;
        }
        .ph-guarantee-chip {
          flex: 1; background: rgba(255,255,255,0.02); border: 1px solid #222;
          border-radius: 10px; padding: 8px 4px; text-align: center;
          color: #444; font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
        }
        .ph-guarantee-chip span { display: block; font-size: 16px; margin-bottom: 3px; }

        .ph-spinner-sm {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to{ transform: rotate(360deg); } }
      `}</style>

      <div className="ph-cart-root" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="ph-cart-header">
          <div className="ph-cart-title">Your <span>Cart</span></div>
          <div className="ph-cart-sub">
            {cart.length > 0
              ? `${cart.reduce((s, i) => s + i.quantity, 0)} items ready to checkout`
              : 'Nothing here yet'}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="ph-cart-empty">
            <span className="ph-empty-emoji">🛒</span>
            <div className="ph-empty-title">Your cart is empty</div>
            <div className="ph-empty-sub">Add some delicious pizzas to get started!</div>
            <a href="/" className="ph-empty-btn">🍕 Browse Menu</a>
          </div>
        ) : (
          <div className="ph-cart-layout">
            {/* LEFT: ITEMS */}
            <div>
              {cart.map((item, i) => (
                <div key={item.id} className="ph-cart-item" style={{ animationDelay: `${i * 0.06}s` }}>
                  <img src={getImage(item.image)} alt={item.name} className="ph-item-img" />

                  <div className="ph-item-info">
                    <div className="ph-item-name">{item.name}</div>
                    <div className="ph-item-unit">{item.price} Tk each</div>
                  </div>

                  <div className="ph-item-right">
                    <div className="ph-qty-row">
                      <button className="ph-qty-btn dec" onClick={() => decreaseQty(item.id)}>−</button>
                      <span className="ph-qty-num">{item.quantity}</span>
                      <button className="ph-qty-btn inc" onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                    <div className="ph-item-subtotal">{item.price * item.quantity} Tk</div>
                    <button className="ph-rem-btn" onClick={() => removeItem(item.id, item.name)}>Remove ✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="ph-summary-card">
              <div className="ph-sum-title">Order Summary</div>

              <div className="ph-sum-row">
                <span className="ph-sum-lbl">Subtotal</span>
                <span className="ph-sum-val">{total} Tk</span>
              </div>
              <div className="ph-sum-row">
                <span className="ph-sum-lbl">Delivery Fee</span>
                <span className="ph-sum-val">{deliveryFee} Tk</span>
              </div>
              <div className="ph-sum-div"></div>
              <div className="ph-sum-row">
                <span className="ph-sum-total-lbl">Total</span>
                <span className="ph-sum-total-val">{grandTotal} Tk</span>
              </div>

              {/* PAYMENT METHOD */}
              <div className="ph-pay-lbl">Payment Method</div>
              <div className="ph-pay-tabs">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.value}
                    className={`ph-pay-tab ${paymentMethod === m.value ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(m.value)}>
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>

              {/* COD */}
              {paymentMethod === 'cod' && (
                <button className="ph-checkout-btn" onClick={handleCOD} disabled={loading}>
                  {loading ? <><span className="ph-spinner-sm"></span>Placing...</> : '🚀 Place Order (COD)'}
                </button>
              )}

              {/* CARD */}
              {paymentMethod === 'card' && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm cart={cart} total={grandTotal} setCart={setCart} navigate={navigate} />
                </Elements>
              )}

              {/* BKASH */}
              {paymentMethod === 'bkash' && (
                <div className="ph-payment-block">
                  <input className="ph-pay-inp form-control"
                    placeholder="Enter bKash number (01XXXXXXXXX)"
                    value={bkash} onChange={e => setBkash(e.target.value)} />
                  <button className="ph-checkout-btn" onClick={() => handleMobilePay(bkash, 'bKash')} disabled={loading}>
                    {loading ? <><span className="ph-spinner-sm"></span>Processing...</> : '📱 Pay with bKash'}
                  </button>
                </div>
              )}

              {/* NAGAD */}
              {paymentMethod === 'nagad' && (
                <div className="ph-payment-block">
                  <input className="ph-pay-inp form-control"
                    placeholder="Enter Nagad number (01XXXXXXXXX)"
                    value={nagad} onChange={e => setNagad(e.target.value)} />
                  <button className="ph-checkout-btn" onClick={() => handleMobilePay(nagad, 'Nagad')} disabled={loading}>
                    {loading ? <><span className="ph-spinner-sm"></span>Processing...</> : '📱 Pay with Nagad'}
                  </button>
                </div>
              )}

              <div className="ph-guarantee-row">
                <div className="ph-guarantee-chip"><span>⚡</span>30-MIN</div>
                <div className="ph-guarantee-chip"><span>🔒</span>SECURE</div>
                <div className="ph-guarantee-chip"><span>🍕</span>FRESH</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const PAYMENT_METHODS = [
  { value: 'cod',   icon: '💵', label: 'Cash on Delivery' },
  { value: 'card',  icon: '💳', label: 'Card (Stripe)' },
  { value: 'bkash', icon: '📱', label: 'bKash' },
  { value: 'nagad', icon: '📱', label: 'Nagad' },
];

export default Cart;