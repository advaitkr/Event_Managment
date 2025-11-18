import React, { useState } from 'react';
import { createEvent } from '../../api/eventApi';
import { useNavigate } from 'react-router-dom';

const EventForm = ({ initial = {}, onCreated }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    date: initial.date ? initial.date.substring(0,16) : '',
    location: initial.location || ''
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      const res = await createEvent(payload);
      if (onCreated) onCreated(res);
      else navigate(`/event/${res._id}`);
    } catch (error) {
      setErr(error?.response?.data?.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="event-form">
      {err && <div className="error">{err}</div>}
      <input name="title" placeholder="Title" value={form.title} onChange={onChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} required />
      <input name="date" type="datetime-local" value={form.date} onChange={onChange} required />
      <input name="location" placeholder="Location" value={form.location} onChange={onChange} required />
      <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
    </form>
  );
};

export default EventForm;
