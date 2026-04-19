import { useEffect, useState } from 'react';
import API from '../../services/api';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  icon: '⏳' },
  preparing: { label: 'Preparing', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  icon: '👨‍🍳' },
  delivered: { label: 'Delivered', color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   icon: '✅' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   icon: '✕' },
};

const AdminOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/all');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch {
      alert('Status update failed ❌');
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getS = (s) => STATUS_CONFIG[s] || { label: s, color: '#888', bg: 'rgba(136,136,136,0.1)', border: 'rgba(136,136,136,0.2)', icon: '•' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-ao { font-family: 'Nunito', sans-serif; }

        .ph-ao-title {
          font-family: 'Bebas Neue', cursive; font-size: 44px;
          letter-spacing: 3px; color: #fff; line-height: 1;
          animation: fadeDown 0.4s ease both;
        }
        .ph-ao-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-ao-sub {
          color: #555; font-size: 12px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 24px;
        }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* FILTER TABS */
        .ph-filter-row {
          display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;
          animation: fadeDown 0.4s 0.05s ease both;
        }
        .ph-filter-btn {
          background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 50px;
          color: #555; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 800; letter-spacing: 0.5px;
          padding: 8px 18px; transition: all 0.15s; text-transform: uppercase;
        }
        .ph-filter-btn:hover { border-color: #ff5000; color: #ff5000; }
        .ph-filter-btn.active {
          background: linear-gradient(135deg,#ff5000,#ff2200); color: #fff;
          border-color: transparent; box-shadow: 0 4px 14px rgba(255,80,0,0.3);
        }

        /* ORDER CARD */
        .ph-order-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 20px;
          margin-bottom: 18px; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          animation: slideUp 0.35s ease both;
        }
        .ph-order-card:hover { border-color: rgba(255,80,0,0.2); transform: translateY(-1px); }

        .ph-oc-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid #222; gap: 12px; flex-wrap: wrap;
        }
        .ph-oc-left { display: flex; align-items: center; gap: 14px; }

        .ph-order-num {
          font-family: 'Bebas Neue', cursive; font-size: 20px;
          letter-spacing: 2px; color: #fff;
        }
        .ph-order-meta { color: #555; font-size: 12px; font-weight: 700; }
        .ph-user-name { color: #ccc; font-size: 13px; font-weight: 800; }
        .ph-user-email { color: #555; font-size: 12px; font-weight: 600; }

        .ph-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 50px; padding: 6px 14px; font-size: 11px;
          font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
          white-space: nowrap; flex-shrink: 0;
        }

        .ph-oc-body { padding: 16px 20px; }
        .ph-items-lbl {
          color: #444; font-size: 11px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;
        }

        .ph-item-row {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 10px;
        }
        .ph-item-row:last-child { margin-bottom: 0; }

        .ph-item-img {
          width: 52px; height: 52px; object-fit: cover;
          border-radius: 10px; border: 2px solid #2a2a2a; flex-shrink: 0;
        }
        .ph-item-img-fb {
          width: 52px; height: 52px; border-radius: 10px;
          background: #222; border: 2px solid #2a2a2a;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .ph-item-name { color: #ddd; font-size: 14px; font-weight: 800; }
        .ph-item-qty  { color: #555; font-size: 12px; font-weight: 700; }

        .ph-oc-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; background: rgba(255,255,255,0.02);
          border-top: 1px solid #222; gap: 16px; flex-wrap: wrap;
        }
        .ph-total-val {
          font-family: 'Bebas Neue', cursive; font-size: 22px; color: #ff5000; letter-spacing: 1px;
        }
        .ph-total-lbl { color: #555; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }

        .ph-select {
          background: #111 !important; border: 1.5px solid #2a2a2a !important;
          border-radius: 10px !important; color: #fff !important;
          font-family: 'Nunito', sans-serif; font-size: 12px !important;
          font-weight: 800 !important; padding: 8px 14px !important;
          cursor: pointer; outline: none; transition: border-color 0.2s;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .ph-select:focus { border-color: #ff5000 !important; }

        .ph-loading {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; padding: 80px; color: #555; font-weight: 700;
        }
        .ph-spin {
          width: 36px; height: 36px; border: 3px solid #222;
          border-top-color: #ff5000; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to{ transform: rotate(360deg); } }

        .ph-empty {
          text-align: center; padding: 60px 20px;
        }
        .ph-empty-emoji { font-size: 60px; display: block; opacity: 0.4; margin-bottom: 16px; }
        .ph-empty-title { font-family: 'Bebas Neue', cursive; font-size: 28px; letter-spacing: 2px; color: #fff; }
        .ph-empty-sub   { color: #555; font-size: 14px; font-weight: 600; margin-top: 6px; }
      `}</style>

      <div className="ph-ao">
        <div className="ph-ao-title">Manage <span>Orders</span></div>
        <div className="ph-ao-sub">{orders.length} total orders</div>

        {/* FILTER TABS */}
        <div className="ph-filter-row">
          {['all', 'pending', 'preparing', 'delivered', 'cancelled'].map(f => (
            <button key={f} className={`ph-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {f === 'all' ? '📋 All' : `${getS(f).icon} ${f}`}
            </button>
          ))}
        </div>

        {loading && (
          <div className="ph-loading"><div className="ph-spin"></div> Loading orders...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="ph-empty">
            <span className="ph-empty-emoji">📦</span>
            <div className="ph-empty-title">No orders found</div>
            <div className="ph-empty-sub">Try a different filter</div>
          </div>
        )}

        {!loading && filtered.map((order, i) => {
          const s = getS(order.status);
          return (
            <div key={order.id} className="ph-order-card" style={{ animationDelay: `${i * 0.05}s` }}>

              <div className="ph-oc-head">
                <div className="ph-oc-left">
                  <div>
                    <div className="ph-order-num">Order #{order.id}</div>
                    <div className="ph-order-meta">
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  {order.User && (
                    <div>
                      <div className="ph-user-name">{order.User.name}</div>
                      <div className="ph-user-email">{order.User.email}</div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div className="ph-status-badge"
                    style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                    {s.icon} {s.label}
                  </div>
                  <select className="ph-select" value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}>
                    <option value="pending">⏳ Pending</option>
                    <option value="preparing">👨‍🍳 Preparing</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">✕ Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="ph-oc-body">
                <div className="ph-items-lbl">Items Ordered</div>
                {order.OrderItems?.map(item => (
                  <div key={item.id} className="ph-item-row">
                    {item.Pizza?.image
                      ? <img src={item.Pizza.image} alt="" className="ph-item-img" />
                      : <div className="ph-item-img-fb">🍕</div>}
                    <div>
                      <div className="ph-item-name">{item.Pizza?.name || 'Pizza'}</div>
                      <div className="ph-item-qty">× {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ph-oc-foot">
                <div className="ph-total-lbl">Order Total</div>
                <div className="ph-total-val">{order.totalPrice} Tk</div>
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
};

export default AdminOrders;