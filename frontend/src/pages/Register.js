import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

const submit = async (e) => {
  e.preventDefault();

  try {
    await API.post('/auth/register', form);
    alert('Registered ✅');
    navigate('/login');
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.msg || 'Error ❌');
  }
};

  return (
    <form onSubmit={submit} className="col-md-4 mx-auto">
      <h3>Register</h3>
      <input placeholder="Name" className="form-control mb-2"
        onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Email" className="form-control mb-2"
        onChange={e => setForm({...form, email:e.target.value})} />
      <input type="password" placeholder="Password"
        className="form-control mb-2"
        onChange={e => setForm({...form, password:e.target.value})} />
      <button className="btn btn-warning w-100">Register</button>
    </form>
  );
};

export default Register;