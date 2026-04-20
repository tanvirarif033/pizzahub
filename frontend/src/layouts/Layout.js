import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();

  const { wishlist } = useWishlist();
  const { totalQty } = useCart();

  const [wishAnimate, setWishAnimate] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (wishlist.length > 0) {
      setWishAnimate(true);
      setTimeout(() => setWishAnimate(false), 400);
    }
  }, [wishlist.length]);

  useEffect(() => {
    if (totalQty > 0) {
      setCartAnimate(true);
      setTimeout(() => setCartAnimate(false), 400);
    }
  }, [totalQty]);

  // Close dropdown on route change
  useEffect(() => {
    setDropOpen(false);
    setMobileOpen(false);
  }, [location]);

  const logout = () => {
    localStorage.clear();
    toast.success('Logged out successfully 👋');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

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

        /* ── NAVBAR ── */
        .ph-nav {
          position: sticky; top: 0; z-index: 1000;
          background: rgba(15,15,15,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #1e1e1e;
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }

        .ph-nav-brand {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .ph-nav-logo { font-size: 28px; line-height: 1; }
        .ph-nav-name {
          font-family: 'Bebas Neue', cursive;
          font-size: 26px; letter-spacing: 2px;
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1;
        }

        .ph-nav-right {
          display: flex; align-items: center; gap: 8px; flex-wrap: nowrap;
        }

        .ph-nav-link {
          background: none; border: 1.5px solid #2a2a2a; border-radius: 10px;
          color: #aaa; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 800; letter-spacing: 0.3px;
          padding: 8px 16px; text-decoration: none; white-space: nowrap;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .ph-nav-link:hover { border-color: #ff5000; color: #ff5000; }
        .ph-nav-link.active { border-color: #ff5000; color: #ff5000; background: rgba(255,80,0,0.08); }

        .ph-nav-icon-btn {
          position: relative; background: #1a1a1a; border: 1.5px solid #2a2a2a;
          border-radius: 10px; color: #fff; cursor: pointer;
          font-size: 18px; padding: 7px 13px; text-decoration: none;
          transition: border-color 0.15s, transform 0.15s;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .ph-nav-icon-btn:hover { border-color: #ff5000; transform: translateY(-1px); }
        .ph-nav-icon-btn.wish:hover { border-color: #ff3366; }
        .ph-nav-icon-btn.bouncing { animation: navBounce 0.4s ease; }

        @keyframes navBounce {
          0%,100%{ transform: scale(1); }
          40%    { transform: scale(1.3); }
        }

        .ph-badge {
          position: absolute; top: -6px; right: -6px;
          background: #ff2200; color: #fff; border-radius: 50%;
          width: 18px; height: 18px; font-size: 10px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #0f0f0f;
        }

        .ph-btn-primary {
          background: linear-gradient(135deg,#ff5000,#ff2200); border: none;
          border-radius: 10px; color: #fff; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
          padding: 8px 16px; text-decoration: none; white-space: nowrap;
          transition: transform 0.15s, box-shadow 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 14px rgba(255,80,0,0.3);
        }
        .ph-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(255,80,0,0.4); color: #fff; }

        .ph-btn-ghost {
          background: none; border: 1.5px solid #2a2a2a; border-radius: 10px;
          color: #aaa; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 800; padding: 8px 16px;
          text-decoration: none; white-space: nowrap;
          transition: border-color 0.15s, color 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .ph-btn-ghost:hover { border-color: #ff5000; color: #ff5000; }

        .ph-btn-warn {
          background: linear-gradient(135deg,#ff8c00,#ffb800); border: none;
          border-radius: 10px; color: #0f0f0f; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 900;
          padding: 8px 16px; text-decoration: none; white-space: nowrap;
          transition: transform 0.15s; display: inline-flex; align-items: center; gap: 6px;
        }
        .ph-btn-warn:hover { transform: translateY(-1px); color: #0f0f0f; }

        /* DROPDOWN */
        .ph-dropdown-wrap { position: relative; }
        .ph-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          background: #1a1a1a; border: 1px solid #2a2a2a;
          border-radius: 14px; min-width: 180px; overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: dropIn 0.2s ease both;
          z-index: 999;
        }
        @keyframes dropIn {
          from{ opacity:0; transform:translateY(-8px); }
          to  { opacity:1; transform:translateY(0); }
        }
        .ph-drop-item {
          display: flex; align-items: center; gap: 10px;
          color: #ccc; font-size: 14px; font-weight: 700;
          padding: 13px 18px; text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border-bottom: 1px solid #222;
        }
        .ph-drop-item:last-child { border-bottom: none; }
        .ph-drop-item:hover { background: rgba(255,80,0,0.08); color: #ff5000; }
        .ph-drop-item.active { color: #ff5000; background: rgba(255,80,0,0.06); }

        /* MOBILE HAMBURGER */
        .ph-hamburger {
          display: none; flex-direction: column; justify-content: center;
          gap: 5px; background: none; border: 1.5px solid #2a2a2a;
          border-radius: 10px; cursor: pointer; padding: 9px 11px;
          transition: border-color 0.15s;
        }
        .ph-hamburger:hover { border-color: #ff5000; }
        .ph-hamburger span {
          display: block; width: 20px; height: 2px; background: #fff;
          border-radius: 2px; transition: all 0.25s;
        }
        .ph-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ph-hamburger.open span:nth-child(2) { opacity: 0; }
        .ph-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* MOBILE MENU */
        .ph-mobile-menu {
          background: #111; border-bottom: 1px solid #1e1e1e;
          padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;
          animation: slideDown 0.25s ease both;
        }
        @keyframes slideDown {
          from{ opacity:0; transform:translateY(-10px); }
          to  { opacity:1; transform:translateY(0); }
        }
        .ph-mob-link {
          color: #ccc; font-size: 15px; font-weight: 800; text-decoration: none;
          padding: 12px 16px; border-radius: 12px; border: 1px solid #1e1e1e;
          display: flex; align-items: center; gap: 10px;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .ph-mob-link:hover, .ph-mob-link.active { background: rgba(255,80,0,0.08); border-color: rgba(255,80,0,0.25); color: #ff5000; }
        .ph-mob-link.danger { border-color: rgba(239,68,68,0.2); color: #ef4444; }
        .ph-mob-link.danger:hover { background: rgba(239,68,68,0.08); }
        .ph-mob-link.primary { background: linear-gradient(135deg,#ff5000,#ff2200); border-color: transparent; color: #fff; }

        /* CONTENT */
        .ph-content {
          min-height: calc(100vh - 64px - 80px);
          padding: 32px 16px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* FOOTER */
        .ph-footer {
          background: #111; border-top: 1px solid #1e1e1e;
          padding: 28px 24px; margin-top: 60px;
        }
        .ph-footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .ph-footer-brand {
          font-family: 'Bebas Neue', cursive; font-size: 24px;
          letter-spacing: 2px;
          background: linear-gradient(135deg,#ff5000,#ff8c00);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .ph-footer-copy { color: #444; font-size: 13px; font-weight: 600; }
        .ph-footer-links { display: flex; gap: 20px; }
        .ph-footer-link { color: #555; font-size: 13px; font-weight: 700; text-decoration: none; transition: color 0.15s; }
        .ph-footer-link:hover { color: #ff5000; }

        @media (max-width: 768px) {
          .ph-nav-right { display: none; }
          .ph-hamburger { display: flex; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="ph-nav">
        <Link to="/" className="ph-nav-brand">
          <span className="ph-nav-logo">🍕</span>
          <span className="ph-nav-name">PizzaHub</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="ph-nav-right">
          <Link to="/" className={`ph-nav-link ${isActive('/') ? 'active' : ''}`}>🏠 Home</Link>

          {user && (
            <>
              <Link to="/cart" className={`ph-nav-icon-btn ${cartAnimate ? 'bouncing' : ''}`}>
                🛒 {totalQty > 0 && <span className="ph-badge">{totalQty}</span>}
              </Link>

              <Link to="/wishlist" className={`ph-nav-icon-btn wish ${wishAnimate ? 'bouncing' : ''}`}>
                ❤️ {wishlist.length > 0 && <span className="ph-badge">{wishlist.length}</span>}
              </Link>

              <div className="ph-dropdown-wrap">
                <button className="ph-nav-link" onClick={() => setDropOpen(!dropOpen)}>
                  👤 Account ▾
                </button>
                {dropOpen && (
                  <div className="ph-dropdown">
                    <Link to="/profile" className={`ph-drop-item ${isActive('/profile') ? 'active' : ''}`}>👤 Profile</Link>
                    <Link to="/orders"  className={`ph-drop-item ${isActive('/orders')  ? 'active' : ''}`}>📦 My Orders</Link>
                  </div>
                )}
              </div>

              {user.role === 'admin' && (
                <Link to="/admin" className="ph-btn-primary">⚙️ Admin</Link>
              )}

              <button onClick={logout} className="ph-btn-ghost">Logout</button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login"    className="ph-btn-ghost">Login</Link>
              <Link to="/register" className="ph-btn-warn">Register 🍕</Link>
            </>
          )}
        </div>

        {/* HAMBURGER */}
        <button className={`ph-hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="ph-mobile-menu">
          <Link to="/" className={`ph-mob-link ${isActive('/') ? 'active' : ''}`}>🏠 Home</Link>

          {user && (
            <>
              <Link to="/cart"     className={`ph-mob-link ${isActive('/cart')     ? 'active' : ''}`}>🛒 Cart {totalQty > 0 && `(${totalQty})`}</Link>
              <Link to="/wishlist" className={`ph-mob-link ${isActive('/wishlist') ? 'active' : ''}`}>❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</Link>
              <Link to="/profile"  className={`ph-mob-link ${isActive('/profile')  ? 'active' : ''}`}>👤 Profile</Link>
              <Link to="/orders"   className={`ph-mob-link ${isActive('/orders')   ? 'active' : ''}`}>📦 My Orders</Link>
              {user.role === 'admin' && <Link to="/admin" className="ph-mob-link primary">⚙️ Admin Panel</Link>}
              <button onClick={logout} className="ph-mob-link danger" style={{ border:'none', cursor:'pointer', width:'100%', textAlign:'left', background:'none' }}>🚪 Logout</button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login"    className="ph-mob-link">🔑 Login</Link>
              <Link to="/register" className="ph-mob-link primary">🍕 Register</Link>
            </>
          )}
        </div>
      )}

      {/* CONTENT */}
      <div className="ph-content">
        {children}
      </div>

      {/* FOOTER */}
      <footer className="ph-footer">
        <div className="ph-footer-inner">
          <div className="ph-footer-brand">PizzaHub</div>
          <div className="ph-footer-links">
            <Link to="/"        className="ph-footer-link">Menu</Link>
            <Link to="/orders"  className="ph-footer-link">Orders</Link>
            <Link to="/profile" className="ph-footer-link">Profile</Link>
          </div>
          <div className="ph-footer-copy">© 2026 PizzaHub · Made with ❤️</div>
        </div>
      </footer>
    </>
  );
};

export default Layout;