import api from './api';

const dealService = {
  // Get all deals
  getAll: async (page = 1, limit = 10, stage = '') => {
    const params = { page, limit };
    if (stage) params.stage = stage;
    const response = await api.get('/deals', { params });
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

  // Update deal stage
  updateStage: async (id, stage) => {
    const response = await api.put(`/deals/${id}/stage`, { stage });
    return response.data;
  },

  // Add activity
  addActivity: async (id, activity) => {
    const response = await api.post(`/deals/${id}/activity`, activity);
    return response.data;
  },

  // Get deals by stage
  getByStage: async (stage) => {
    const response = await api.get(`/deals/by-stage/${stage}`);
    return response.data;
  },

  // Get deal statistics
  getStats: async () => {
    const response = await api.get('/deals/stats');
    return response.data;
  },
};

export default dealService;
