import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent } from '../api/eventApi';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/Error';
import Footer from '../components/Layout/Footer';

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    getEvent(id)
      .then(setEvent)
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load event'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (err) return <ErrorBox message={err} />;

  return (
    <div className="container">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <Footer />
    </div>
  );
};

export default EventPage;