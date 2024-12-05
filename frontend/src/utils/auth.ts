import axios from 'axios';

export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      '/token/refresh/',
      { refresh: localStorage.getItem('refresh_token') },
      { baseURL: 'http://localhost:8000/api' }
    );
    const newAccessToken = response.data.access;
    localStorage.setItem('access_token', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    return null;
  }
};
