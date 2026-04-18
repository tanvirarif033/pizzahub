import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const res = await API.post('/auth/login', form);

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    if (res.data.user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={submit} className="col-md-4 mx-auto">
      <h3>Login</h3>
      <input placeholder="Email" className="form-control mb-2"
        onChange={e => setForm({...form, email:e.target.value})} />
      <input type="password" placeholder="Password"
        className="form-control mb-2"
        onChange={e => setForm({...form, password:e.target.value})} />
      <button className="btn btn-dark w-100">Login</button>
    </form>
  );
};

export default Login;