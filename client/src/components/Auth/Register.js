import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await register(form);
      navigate('/');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {err && <div className="error">{err}</div>}
      <input name="name" value={form.name} onChange={onChange} placeholder="Name" required />
      <input name="email" value={form.email} onChange={onChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
