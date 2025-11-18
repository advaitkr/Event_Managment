import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/Homepage';
import EventPage from '../pages/Eventpage';
import CreateEventPage from '../pages/CreateEventPage';
import LoginPage from '../pages/LoginPage.js';
import RegisterPage from '../pages/RegisterPage';
import Header from '../components/Layout/header';

const Private = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  return auth ? children : <Navigate to="/login" />;
};

const AppRouter = () => (
  <div>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:id" element={<EventPage />} />
      <Route path="/create" element={<Private><CreateEventPage /></Private>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </div>
);

export default AppRouter;
