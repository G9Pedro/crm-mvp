import api from './api';

const contactService = {
  // Get all contacts
  getAll: async (page = 1, limit = 10, status = '') => {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await api.get('/contacts', { params });
    return response.data;
  },

  // Get single contact
  getById: async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  // Create new contact
  create: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  // Update contact
  update: async (id, contactData) => {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response.data;
  },

  // Delete contact
  delete: async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },

  // Search contacts
  search: async (query) => {
    const response = await api.get('/contacts/search', { params: { q: query } });
    return response.data;
  },

  // Export contacts
  export: async () => {
    const response = await api.get('/contacts/export');
    return response.data;
  },
};

export default contactService;
