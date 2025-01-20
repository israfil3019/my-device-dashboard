import axios from 'axios';

const api = axios.create({
  baseURL: '/mock', // Need replacement with the real one
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchData = async (locationId: number, limit: number) => {
  const response = await api.get('/dataset.json', {
    params: { location_id: locationId, limit },
  });
  return response.data;
};

export default api;