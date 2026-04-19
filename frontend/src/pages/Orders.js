import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatus = (status) => {
    const map = {
      pending:   { label: 'Pending',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)', icon: '⏳' },
      preparing: { label: 'Preparing', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)', icon: '👨‍🍳' },
      delivered: { label: 'Delivered', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',  icon: '✅' },
      cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',  icon: '✕' },
    };
    return map[status] || { label: status, color: '#888', bg: 'rgba(136,136,136,0.1)', border: 'rgba(136,136,136,0.2)', icon: '•' };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-orders-root {
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'Nunito', sans-serif;
          padding: 32px 0 80px;
        }

        .ph-orders-header {
          margin-bottom: 36px;
          animation: fadeDown 0.4s ease both;
        }

        .ph-orders-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 52px;
          letter-spacing: 3px;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }

        .ph-orders-title span {
          background: linear-gradient(135deg, #ff5000, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ph-orders-subtitle {
          color: #555;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* LOADING */
        .ph-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
        }

        .ph-loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #2a2a2a;
          border-top-color: #ff5000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .ph-loading-text {
          color: #555;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .ph-empty {
          text-align: center;
          padding: 80px 20px;
        }

        .ph-empty-emoji {
          font-size: 72px;
          display: block;
          margin-bottom: 20px;
          opacity: 0.5;
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

        /* ORDER CARD */
        .ph-order-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 24px;
          margin-bottom: 24px;
          overflow: hidden;
          transition: border-color 0.25s, transform 0.25s;
          animation: slideUp 0.4s ease both;
        }

        .ph-order-card:hover {
          border-color: rgba(255,80,0,0.2);
          transform: translateY(-2px);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ph-order-top {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          border-bottom: 1px solid #222;
        }

        .ph-order-id {
          font-family: 'Bebas Neue', cursive;
          font-size: 22px;
          letter-spacing: 2px;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }

        .ph-order-date {
          color: #555;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .ph-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 50px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ph-order-items {
          padding: 20px 24px;
        }

        .ph-order-items-title {
          color: #555;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .ph-order-item-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid #222;
        }

        .ph-order-item-row:last-child {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: none;
        }

        .ph-order-item-img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #2a2a2a;
          flex-shrink: 0;
        }

        .ph-order-item-img-fallback {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: #222;
          border: 2px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .ph-order-item-name {
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 3px;
        }

        .ph-order-item-qty {
          color: #555;
          font-size: 13px;
          font-weight: 600;
        }

        .ph-order-bottom {
          padding: 16px 24px;
          background: rgba(255,80,0,0.04);
          border-top: 1px solid #222;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ph-order-items-count {
          color: #555;
          font-size: 13px;
          font-weight: 700;
        }

        .ph-order-total {
          font-family: 'Bebas Neue', cursive;
          font-size: 24px;
          letter-spacing: 1px;
          color: #ff5000;
        }

        .ph-order-total small {
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          letter-spacing: 0.5px;
          margin-right: 4px;
        }

        /* STATS ROW */
        .ph-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 32px;
          animation: fadeDown 0.5s ease both;
        }

        .ph-stat-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 18px;
          text-align: center;
        }

        .ph-stat-value {
          font-family: 'Bebas Neue', cursive;
          font-size: 32px;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #ff5000, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 4px;
        }

        .ph-stat-label {
          color: #555;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .ph-order-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff5000, #ff2200);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          font-weight: 800;
          padding: 14px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 8px 24px rgba(255,80,0,0.3);
        }

        .ph-order-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,80,0,0.45);
        }
      `}</style>

      <div className="ph-orders-root">
        <div className="container" style={{ maxWidth: '720px' }}>

          <div className="ph-orders-header">
            <div className="ph-orders-title">Your <span>Orders</span></div>
            <div className="ph-orders-subtitle">
              {!loading && `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="ph-loading">
              <div className="ph-loading-spinner"></div>
              <div className="ph-loading-text">Fetching your orders...</div>
            </div>
          )}

          {/* EMPTY */}
          {!loading && orders.length === 0 && (
            <div className="ph-empty">
              <span className="ph-empty-emoji">📦</span>
              <div className="ph-empty-title">No orders yet</div>
              <div className="ph-empty-sub">Your delicious history will show up here!</div>
              <button className="ph-order-btn" style={{ maxWidth: 260, margin: '0 auto' }}
                onClick={() => navigate('/')}>
                Order Now 🍕
              </button>
            </div>
          )}

          {/* STATS */}
          {!loading && orders.length > 0 && (
            <div className="ph-stats-row">
              <div className="ph-stat-card">
                <div className="ph-stat-value">{orders.length}</div>
                <div className="ph-stat-label">Total Orders</div>
              </div>
              <div className="ph-stat-card">
                <div className="ph-stat-value">
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div className="ph-stat-label">Delivered</div>
              </div>
              <div className="ph-stat-card">
                <div className="ph-stat-value">
                  {orders.reduce((s, o) => s + (o.totalPrice || 0), 0)}
                </div>
                <div className="ph-stat-label">Tk Spent</div>
              </div>
            </div>
          )}

          {/* ORDER CARDS */}
          {!loading && orders.map((order, i) => {
            const s = getStatus(order.status);
            const itemCount = order.OrderItems?.reduce((s, i) => s + i.quantity, 0) || 0;

            return (
              <div
                key={order.id}
                className="ph-order-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* TOP */}
                <div className="ph-order-top">
                  <div>
                    <div className="ph-order-id">Order #{order.id}</div>
                    <div className="ph-order-date">
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div
                    className="ph-status-badge"
                    style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                  >
                    {s.icon} {s.label}
                  </div>
                </div>

                {/* ITEMS */}
                <div className="ph-order-items">
                  <div className="ph-order-items-title">Items Ordered</div>
                  {order.OrderItems?.map(item => (
                    <div key={item.id} className="ph-order-item-row">
                      {item.Pizza?.image ? (
                        <img src={item.Pizza.image} alt="" className="ph-order-item-img" />
                      ) : (
                        <div className="ph-order-item-img-fallback">🍕</div>
                      )}
                      <div>
                        <div className="ph-order-item-name">{item.Pizza?.name || 'Pizza'}</div>
                        <div className="ph-order-item-qty">× {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM */}
                <div className="ph-order-bottom">
                  <div className="ph-order-items-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
                  <div className="ph-order-total">
                    <small>TOTAL</small>{order.totalPrice} Tk
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
};

export default Orders;