import React from 'react';

const EventDetails = ({ event }) => {
  if (!event) return null;
  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
    </div>
  );
};

export default EventDetails;
