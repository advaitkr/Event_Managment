import React from 'react';
import EventList from '../components/Event/EventList';
import Footer from '../components/Layout/Footer';

const HomePage = () => (
  <div className="container">
    <EventList />
    <Footer />
  </div>
);

export default HomePage;