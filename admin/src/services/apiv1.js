// src/api.js
const BASE_URL = 'http://localhost:5000/api/v1';

export async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // for cookies
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}
