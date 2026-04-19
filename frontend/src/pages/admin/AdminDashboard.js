import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/all')
      .then(res => setOrders(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const total     = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const pending   = orders.filter(o => o.status === 'pending').length;

  const daily = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    daily[d] = (daily[d] || 0) + o.totalPrice;
  });

  const monthly = {};
  orders.forEach(o => {
    const m = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthly[m] = (monthly[m] || 0) + o.totalPrice;
  });

  const labels = view === 'daily' ? Object.keys(daily) : Object.keys(monthly);
  const values = view === 'daily' ? Object.values(daily) : Object.values(monthly);

  const lineData = {
    labels,
    datasets: [{
      label: 'Revenue (Tk)',
      data: values,
      borderColor: '#ff5000',
      backgroundColor: 'rgba(255,80,0,0.07)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ff5000',
      pointBorderColor: '#1a1a1a',
      pointBorderWidth: 2,
      pointRadius: 5,
    }]
  };

  const pizzaMap = {};
  orders.forEach(o => {
    o.OrderItems?.forEach(i => {
      const name = i.Pizza?.name || 'Unknown';
      pizzaMap[name] = (pizzaMap[name] || 0) + i.quantity;
    });
  });

  const top = Object.entries(pizzaMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const barData = {
    labels: top.map(p => p[0]),
    datasets: [{
      label: 'Units Sold',
      data: top.map(p => p[1]),
      backgroundColor: ['#ff5000', '#ff8c00', '#ffb800', '#ff3366', '#a855f7'],
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#666', font: { family: 'Nunito', weight: '700', size: 12 } } },
      tooltip: {
        backgroundColor: '#111', borderColor: '#2a2a2a', borderWidth: 1,
        titleColor: '#fff', bodyColor: '#ff8c00',
        titleFont: { family: 'Nunito', weight: '800' },
        bodyFont: { family: 'Nunito', weight: '700' },
        padding: 12,
      }
    },
    scales: {
      x: { ticks: { color: '#555', font: { family: 'Nunito', weight: '700', size: 11 } }, grid: { color: '#1e1e1e' } },
      y: { ticks: { color: '#555', font: { family: 'Nunito', weight: '700', size: 11 } }, grid: { color: '#1e1e1e' } }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ph-dash { font-family: 'Nunito', sans-serif; }

        .ph-dash-title {
          font-family: 'Bebas Neue', cursive;
          font-size: 44px; letter-spacing: 3px; color: #fff; line-height: 1;
          animation: fadeDown 0.4s ease both;
        }
        .ph-dash-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ph-dash-sub {
          color: #555; font-size: 12px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 28px;
          animation: fadeDown 0.4s 0.05s ease both;
        }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .ph-stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 22px;
          animation: slideUp 0.4s ease both;
        }
        @media(max-width:768px){ .ph-stats-grid{ grid-template-columns: repeat(2,1fr); } }

        .ph-stat {
          background: #1a1a1a; border: 1px solid #222; border-radius: 18px;
          padding: 20px 18px; transition: border-color 0.2s, transform 0.2s;
        }
        .ph-stat:hover { border-color: rgba(255,80,0,0.3); transform: translateY(-2px); }
        .ph-stat-icon { font-size: 26px; margin-bottom: 10px; display: block; }
        .ph-stat-val {
          font-family: 'Bebas Neue', cursive; font-size: 34px;
          letter-spacing: 1px; line-height: 1; margin-bottom: 4px;
        }
        .ph-stat-lbl { color: #555; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
        .s-rev .ph-stat-val { background: linear-gradient(135deg,#ff5000,#ff8c00); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .s-ord .ph-stat-val { color: #3b82f6; }
        .s-del .ph-stat-val { color: #22c55e; }
        .s-pen .ph-stat-val { color: #f59e0b; }

        .ph-chart-card {
          background: #1a1a1a; border: 1px solid #222; border-radius: 20px;
          padding: 24px; margin-bottom: 18px;
          animation: slideUp 0.45s ease both;
        }
        .ph-chart-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
        }
        .ph-chart-ttl {
          font-family: 'Bebas Neue', cursive; font-size: 22px;
          letter-spacing: 2px; color: #fff;
        }
        .ph-toggle {
          display: flex; background: #111; border: 1px solid #2a2a2a;
          border-radius: 10px; padding: 4px; gap: 4px;
        }
        .ph-tbtn {
          background: none; border: none; border-radius: 7px; color: #555;
          cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 12px;
          font-weight: 800; letter-spacing: 0.5px; padding: 7px 16px;
          transition: background 0.15s, color 0.15s;
        }
        .ph-tbtn.active {
          background: linear-gradient(135deg,#ff5000,#ff2200); color: #fff;
          box-shadow: 0 4px 12px rgba(255,80,0,0.3);
        }

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
      `}</style>

      <div className="ph-dash">
        <div className="ph-dash-title">Admin <span>Dashboard</span></div>
        <div className="ph-dash-sub">PizzaHub · Real-time Overview</div>

        {loading ? (
          <div className="ph-loading"><div className="ph-spin"></div> Loading analytics...</div>
        ) : (
          <>
            <div className="ph-stats-grid">
              <div className="ph-stat s-rev">
                <span className="ph-stat-icon">💰</span>
                <div className="ph-stat-val">{total.toLocaleString()}</div>
                <div className="ph-stat-lbl">Revenue (Tk)</div>
              </div>
              <div className="ph-stat s-ord">
                <span className="ph-stat-icon">📦</span>
                <div className="ph-stat-val">{orders.length}</div>
                <div className="ph-stat-lbl">Total Orders</div>
              </div>
              <div className="ph-stat s-del">
                <span className="ph-stat-icon">✅</span>
                <div className="ph-stat-val">{delivered}</div>
                <div className="ph-stat-lbl">Delivered</div>
              </div>
              <div className="ph-stat s-pen">
                <span className="ph-stat-icon">⏳</span>
                <div className="ph-stat-val">{pending}</div>
                <div className="ph-stat-lbl">Pending</div>
              </div>
            </div>

            <div className="ph-chart-card">
              <div className="ph-chart-head">
                <div className="ph-chart-ttl">Revenue Trend</div>
                <div className="ph-toggle">
                  <button className={`ph-tbtn ${view === 'daily' ? 'active' : ''}`} onClick={() => setView('daily')}>Daily</button>
                  <button className={`ph-tbtn ${view === 'monthly' ? 'active' : ''}`} onClick={() => setView('monthly')}>Monthly</button>
                </div>
              </div>
              <Line data={lineData} options={chartOptions} />
            </div>

            <div className="ph-chart-card">
              <div className="ph-chart-head">
                <div className="ph-chart-ttl">🔥 Top Selling Pizzas</div>
              </div>
              <Bar data={barData} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;