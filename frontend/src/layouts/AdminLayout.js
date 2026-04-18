import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex">

      {/* Sidebar */}
      <div style={{ width: '250px', background: '#1e293b', color: 'white', minHeight: '100vh' }} className="p-3">
        <h4>🍕 Admin</h4>

        <Link to="/admin" className="d-block text-white my-2">Dashboard</Link>
        <Link to="/admin/orders" className="d-block text-white my-2">Orders</Link>
        <Link to="/admin/users" className="d-block text-white my-2">Users</Link>
        <Link to="/admin/pizzas" className="d-block text-white my-2">Pizzas</Link>

        <button className="btn btn-danger mt-3 w-100" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet /> {/* 🔥 MUST */}
      </div>

    </div>
  );
};

export default AdminLayout;