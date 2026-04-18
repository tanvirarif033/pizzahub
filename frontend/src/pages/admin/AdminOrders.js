import { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📦 Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/all');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load orders ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔄 Update Status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });

      // UI update (no reload)
      setOrders(prev =>
        prev.map(o => (o.id === id ? { ...o, status } : o))
      );

    } catch (err) {
      alert('Status update failed ❌');
    }
  };

  // 🎨 Status Color
  const statusColor = (s) => {
    if (s === 'pending') return 'warning';
    if (s === 'delivered') return 'success';
    if (s === 'cancelled') return 'danger';
    return 'secondary';
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container">
      <h2 className="mb-4 fw-bold">📊 Manage Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm align-middle">

            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Change</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id}>

                  {/* ORDER ID */}
                  <td>#{order.id}</td>

                  {/* USER */}
                  <td>
                    {order.User ? (
                      <>
                        <strong>{order.User.name}</strong>
                        <br />
                        <small className="text-muted">
                          {order.User.email}
                        </small>
                      </>
                    ) : 'N/A'}
                  </td>

                  {/* ITEMS WITH IMAGE */}
                  <td>
                    {order.OrderItems?.map(item => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center mb-2"
                      >
                        <img
                          src={item.Pizza?.image}
                          alt=""
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />

                        <div className="ms-2">
                          {item.Pizza?.name} × {item.quantity}
                        </div>
                      </div>
                    ))}
                  </td>

                  {/* TOTAL */}
                  <td className="fw-bold text-success">
                    {order.totalPrice} Tk
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`badge bg-${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* UPDATE STATUS */}
                  <td>
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* DATE */}
                  <td>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;