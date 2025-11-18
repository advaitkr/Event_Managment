import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(form);
      navigate('/');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {err && <div className="error">{err}</div>}
      <input name="email" value={form.email} onChange={onChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
