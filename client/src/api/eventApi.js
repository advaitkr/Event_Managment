import api from './axiosInstance';

export const getEvents = (params) => api.get('/events', { params }).then(res => res.data);
export const getEvent = (id) => api.get(`/events/${id}`).then(res => res.data);
export const createEvent = (payload) => api.post('/events', payload).then(res => res.data);
export const updateEvent = (id, payload) => api.put(`/events/${id}`, payload).then(res => res.data);
export const deleteEvent = (id) => api.delete(`/events/${id}`).then(res => res.data);
