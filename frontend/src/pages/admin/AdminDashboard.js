import { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  Bar,
  Pie
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/orders/all');
      setOrders(res.data);
    };
    fetch();
  }, []);

  // 📊 Sales Data
  const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  // 📊 Bar Chart (Order-wise)
  const barData = {
    labels: orders.map(o => `Order ${o.id}`),
    datasets: [
      {
        label: 'Sales',
        data: orders.map(o => o.totalPrice)
      }
    ]
  };

  // 📊 Pie Chart (Category wise)
  const categoryMap = {};

  orders.forEach(order => {
    order.OrderItems?.forEach(item => {
      const cat = item.Pizza?.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap)
      }
    ]
  };

  return (
    <div>
      <h2>📊 Admin Dashboard</h2>

      <div className="card p-3 mb-4 shadow">
        <h4>Total Sales: {totalSales} Tk</h4>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h5>Sales Chart</h5>
          <Bar data={barData} />
        </div>

        <div className="col-md-6">
          <h5>Category Distribution</h5>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;