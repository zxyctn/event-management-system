import toast from 'react-hot-toast';

import api from '../utils/axios';

export const dateToString = (date: Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

export const joinEvent = async (id: string) => {
  const response = await api.post(`/events/${id}/join/`);

  if (response.status === 201) {
    toast.success('Joined event successfully!');
  }

  console.log(response);
  console.log(response.data);
};

export const leaveEvent = async (id: string) => {
  const response = await api.post(`/events/${id}/leave/`);

  if (response.status === 204) {
    toast.success('Left event successfully!');
  }

  console.log(response);
  console.log(response.data);
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}/`);

  if (response.status === 204) {
    toast.success('Cancelled event successfully!');
  } else {
    toast.error('Failed to cancel event...');
  }

  console.log(response);
  console.log(response.data);
};

export const getUser = async () => {
  try {
    const response = await fetch('http://localhost:8000/me/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getEvents = async () => {
  try {
    const response = await api.get('/events/');
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};
