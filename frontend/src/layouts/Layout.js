import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">
        <Link to="/" className="navbar-brand fw-bold">
          🍕 PizzaHub
        </Link>

        <div className="ms-auto d-flex align-items-center">

          {/* 🔹 COMMON NAV */}
          <Link to="/" className="btn btn-outline-light mx-1">
            Home
          </Link>

          {user && (
            <>
              <Link to="/cart" className="btn btn-success mx-1">
                Cart 🛒
              </Link>

              <Link to="/orders" className="btn btn-info mx-1">
                Orders 📦
              </Link>
            </>
          )}

          {/* 🔹 ROLE BASED */}
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-danger mx-1">
                  Admin ⚙️
                </Link>
              )}

              <Link to="/dashboard" className="btn btn-primary mx-1">
                Dashboard 👤
              </Link>

              <Link to="/profile" className="btn btn-warning mx-1">
                Profile 👤
              </Link>

              <button onClick={logout} className="btn btn-light mx-1">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light mx-1">
                Login
              </Link>

              <Link to="/register" className="btn btn-warning mx-1">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 🔥 PAGE CONTENT */}
      <div className="container mt-4">
        {children}
      </div>

      {/* 🔥 FOOTER */}
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <small>© 2026 PizzaHub | Built with ❤️</small>
      </footer>
    </>
  );
};

export default Layout;