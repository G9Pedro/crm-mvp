import api from './api';

const dealService = {
  // Get all deals
  getAll: async () => {
    const response = await api.get('/deals');
    return response.data;
  },

  // Get single deal
  getById: async (id) => {
    const response = await api.get(`/deals/${id}`);
    return response.data;
  },

  // Create new deal
  create: async (dealData) => {
    const response = await api.post('/deals', dealData);
    return response.data;
  },

  // Update deal
  update: async (id, dealData) => {
    const response = await api.put(`/deals/${id}`, dealData);
    return response.data;
  },

  // Delete deal
  delete: async (id) => {
    const response = await api.delete(`/deals/${id}`);
    return response.data;
  },
};

export default dealService;
