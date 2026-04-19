import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const { wishlist } = useWishlist();
  const { totalQty } = useCart();

  // 🔥 animation states
  const [wishAnimate, setWishAnimate] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);

  useEffect(() => {
    if (wishlist.length > 0) {
      setWishAnimate(true);
      setTimeout(() => setWishAnimate(false), 300);
    }
  }, [wishlist]);

  useEffect(() => {
    if (totalQty > 0) {
      setCartAnimate(true);
      setTimeout(() => setCartAnimate(false), 300);
    }
  }, [totalQty]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          🍕 PizzaHub
        </Link>

        <div className="ms-auto d-flex align-items-center gap-2 flex-wrap">

          {/* 🔹 COMMON */}
          <Link to="/" className="btn btn-outline-light">
            Home
          </Link>

          {user && (
            <>
              {/* 🛒 CART WITH COUNTER */}
              <Link
                to="/cart"
                className={`btn btn-success position-relative ${cartAnimate ? 'cart-bounce' : ''}`}
                style={{ borderRadius: '20px' }}
              >
                🛒 Cart

                {totalQty > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '10px' }}
                  >
                    {totalQty}
                  </span>
                )}
              </Link>

              <Link to="/orders" className="btn btn-info">
                📦 Orders
              </Link>
            </>
          )}

          {/* 🔹 ROLE */}
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-danger">
                  ⚙️ Admin
                </Link>
              )}

              <Link to="/dashboard" className="btn btn-primary">
                👤 Dashboard
              </Link>

              <Link to="/profile" className="btn btn-warning">
                👤 Profile
              </Link>

              {/* ❤️ WISHLIST */}
              <Link
                to="/wishlist"
                className={`btn btn-light position-relative ${wishAnimate ? 'wishlist-bounce' : ''}`}
                style={{ borderRadius: '20px' }}
              >
                ❤️ Wishlist

                {wishlist.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '10px' }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button onClick={logout} className="btn btn-outline-light">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light">
                Login
              </Link>

              <Link to="/register" className="btn btn-warning">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 🔥 CONTENT */}
      <div className="container mt-4">
        {children}
      </div>

      {/* 🔥 FOOTER */}
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <small>© 2026 PizzaHub | Built with ❤️</small>
      </footer>

      {/* 🔥 ANIMATIONS */}
      <style>
        {`
          .wishlist-bounce, .cart-bounce {
            animation: bounce 0.3s ease;
          }

          @keyframes bounce {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
};

export default Layout;