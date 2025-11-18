import React, { useEffect, useState } from 'react';
import { getEvents } from '../../api/eventApi';
import { Link } from 'react-router-dom';
import Loader from '../Common/Loader';
import ErrorBox from '../Common/Error';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then(data => setEvents(data))
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (err) return <ErrorBox message={err} />;

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map(e => (
          <li key={e._id}>
            <Link to={`/event/${e._id}`}>{e.title} — {new Date(e.date).toLocaleString()}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
