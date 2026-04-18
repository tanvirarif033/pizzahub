import { useEffect, useState } from 'react';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/orders');
      setOrders(res.data);
    };
    fetch();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'pending') return 'warning';
    if (status === 'delivered') return 'success';
    if (status === 'cancelled') return 'danger';
    return 'secondary';
  };

  return (
    <div className="container">
      <h2 className="mb-4 fw-bold">📦 Your Orders</h2>

      {orders.length === 0 && (
        <div className="text-center mt-5">
          <h4>No orders yet 😢</h4>
        </div>
      )}

      {orders.map(order => (
        <div key={order.id} className="card shadow-lg border-0 mb-4 p-4 rounded-4">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">Order #{order.id}</h5>

            <span className={`badge bg-${getStatusColor(order.status)} px-3 py-2`}>
              {order.status}
            </span>
          </div>

          {/* DATE */}
          <small className="text-muted">
            {new Date(order.createdAt).toLocaleString()}
          </small>

          {/* ITEMS */}
          <div className="mt-3">
            {order.OrderItems.map(item => (
              <div
                key={item.id}
                className="d-flex align-items-center mb-3 border-bottom pb-2"
              >
                <img
                  src={item.Pizza?.image}
                  alt=""
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />

                <div className="ms-3">
                  <h6 className="mb-1">{item.Pizza?.name}</h6>
                  <small className="text-muted">
                    Quantity: {item.quantity}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="text-end mt-3">
            <h5 className="text-success fw-bold">
              Total: {order.totalPrice} Tk
            </h5>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Orders;