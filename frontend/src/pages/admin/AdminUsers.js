import { useEffect, useState } from 'react';
import API from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    };
    fetch();
  }, []);

  const changeRole = async (id, role) => {
    await API.put(`/admin/users/${id}`, { role });

    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, role } : u))
    );
  };

  return (
    <div>
      <h3>👥 Users</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>

              <td>{u.role}</td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    changeRole(u.id, e.target.value)
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default AdminUsers;