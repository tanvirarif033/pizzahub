import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

const NAV_ITEMS = [
  { to: '/admin',         icon: '📊', label: 'Dashboard' },
  { to: '/admin/orders',  icon: '📦', label: 'Orders'    },
  { to: '/admin/pizzas',  icon: '🍕', label: 'Pizzas'    },
  { to: '/admin/users',   icon: '👥', label: 'Users'     },
];

const AdminLayout = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  const logout = () => {
    localStorage.clear();
    toast.success('Logged out 👋');
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          background: #0f0f0f;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          margin: 0;
        }

        .ph-admin-shell {
          display: flex; min-height: 100vh;
        }

        /* ── SIDEBAR ── */
        .ph-sidebar {
          width: ${collapsed ? '72px' : '240px'};
          background: #111;
          border-right: 1px solid #1e1e1e;
          display: flex; flex-direction: column;
          padding: 0; transition: width 0.25s ease;
          position: fixed; top: 0; left: 0; height: 100vh; z-index: 200;
          overflow: hidden;
        }

        .ph-sb-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 16px; border-bottom: 1px solid #1e1e1e; gap: 10px;
          min-height: 64px; flex-shrink: 0;
        }
        .ph-sb-brand {
          display: flex; align-items: center; gap: 8px; overflow: hidden;
          text-decoration: none; white-space: nowrap;
        }
        .ph-sb-logo { font-size: 24px; flex-shrink: 0; }
        .ph-sb-name {
          font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 2px;
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.2s;
          pointer-events: none;
        }

        .ph-collapse-btn {
          background: none; border: 1px solid #2a2a2a; border-radius: 8px;
          color: #555; cursor: pointer; font-size: 14px; padding: 5px 8px;
          transition: border-color 0.15s, color 0.15s; flex-shrink: 0;
        }
        .ph-collapse-btn:hover { border-color: #ff5000; color: #ff5000; }

        .ph-sb-badge {
          background: rgba(255,80,0,0.12); border: 1px solid rgba(255,80,0,0.25);
          border-radius: 6px; color: #ff8c00; font-size: 10px; font-weight: 800;
          letter-spacing: 1px; padding: 3px 8px; white-space: nowrap;
          margin: 12px 16px 4px;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s;
        }

        .ph-sb-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }

        .ph-sb-link {
          display: flex; align-items: center; gap: 12px;
          color: #555; font-size: 14px; font-weight: 800;
          padding: 12px 12px; border-radius: 12px; text-decoration: none;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          border: 1px solid transparent; white-space: nowrap; overflow: hidden;
          letter-spacing: 0.3px;
        }
        .ph-sb-link:hover { background: rgba(255,80,0,0.07); color: #ff5000; border-color: rgba(255,80,0,0.15); }
        .ph-sb-link.active {
          background: rgba(255,80,0,0.12); color: #ff5000;
          border-color: rgba(255,80,0,0.25);
        }
        .ph-sb-icon { font-size: 18px; flex-shrink: 0; }
        .ph-sb-lbl { opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s; }

        .ph-sb-foot { padding: 12px 10px; border-top: 1px solid #1e1e1e; flex-shrink: 0; }

        .ph-logout-btn {
          display: flex; align-items: center; gap: 12px; width: 100%;
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px; color: #ef4444; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
          padding: 12px; transition: background 0.15s, border-color 0.15s;
          white-space: nowrap; overflow: hidden;
        }
        .ph-logout-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); }
        .ph-logout-icon { font-size: 18px; flex-shrink: 0; }
        .ph-logout-lbl { opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s; }

        /* ── MAIN ── */
        .ph-admin-main {
          flex: 1;
          margin-left: ${collapsed ? '72px' : '240px'};
          transition: margin-left 0.25s ease;
          min-height: 100vh;
          display: flex; flex-direction: column;
        }

        .ph-admin-topbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(15,15,15,0.92); backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #1e1e1e;
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }

        .ph-topbar-title {
          font-family: 'Bebas Neue', cursive; font-size: 20px;
          letter-spacing: 2px; color: #fff;
        }
        .ph-topbar-title span {
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }

        .ph-topbar-right { display: flex; align-items: center; gap: 10px; }

        .ph-topbar-user {
          background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 50px;
          color: #888; font-size: 12px; font-weight: 800; padding: 7px 14px;
          letter-spacing: 0.5px;
        }

        .ph-mob-toggle {
          display: none; background: none; border: 1.5px solid #2a2a2a;
          border-radius: 10px; color: #fff; cursor: pointer;
          font-size: 20px; padding: 6px 10px; transition: border-color 0.15s;
        }
        .ph-mob-toggle:hover { border-color: #ff5000; }

        .ph-admin-body { flex: 1; padding: 28px 24px; }

        /* MOBILE SIDEBAR OVERLAY */
        .ph-sidebar-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.7); z-index: 199;
        }

        @media (max-width: 768px) {
          .ph-sidebar {
            width: 240px !important;
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
            transition: transform 0.25s ease;
          }
          .ph-sb-name, .ph-sb-lbl, .ph-logout-lbl { opacity: 1 !important; }
          .ph-admin-main { margin-left: 0 !important; }
          .ph-mob-toggle { display: block; }
          .ph-collapse-btn { display: none; }
          .ph-sidebar-overlay { display: ${mobileOpen ? 'block' : 'none'}; }
        }
      `}</style>

      <div className="ph-admin-shell">
        {/* SIDEBAR OVERLAY (mobile) */}
        <div className="ph-sidebar-overlay" onClick={() => setMobileOpen(false)} />

        {/* SIDEBAR */}
        <aside className="ph-sidebar">
          <div className="ph-sb-head">
            <Link to="/" className="ph-sb-brand">
              <span className="ph-sb-logo">🍕</span>
              <span className="ph-sb-name">PizzaHub</span>
            </Link>
            <button className="ph-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '→' : '←'}
            </button>
          </div>

          {!collapsed && <div className="ph-sb-badge">ADMIN PANEL</div>}

          <nav className="ph-sb-nav">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`ph-sb-link ${isActive(item.to) ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="ph-sb-icon">{item.icon}</span>
                <span className="ph-sb-lbl">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="ph-sb-foot">
            <button className="ph-logout-btn" onClick={logout}>
              <span className="ph-logout-icon">🚪</span>
              <span className="ph-logout-lbl">Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="ph-admin-main">
          <div className="ph-admin-topbar">
            <button className="ph-mob-toggle" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
            <div className="ph-topbar-title">
              {NAV_ITEMS.find(n => isActive(n.to))?.icon}{' '}
              <span>{NAV_ITEMS.find(n => isActive(n.to))?.label || 'Admin'}</span>
            </div>
            <div className="ph-topbar-right">
              <div className="ph-topbar-user">
                👤 {JSON.parse(localStorage.getItem('user'))?.name || 'Admin'}
              </div>
            </div>
          </div>

          <div className="ph-admin-body">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;