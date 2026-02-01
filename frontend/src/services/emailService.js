import api from './api';

const emailService = {
  // Send email to contact
  send: async (emailData) => {
    const response = await api.post('/emails/send', emailData);
    return response.data;
  },

  // Send bulk emails
  sendBulk: async (emailData) => {
    const response = await api.post('/emails/bulk', emailData);
    return response.data;
  },

  // Get email history
  getHistory: async (contactId = null, page = 1, limit = 20) => {
    const url = contactId ? `/emails/history/${contactId}` : '/emails/history';
    const response = await api.get(url, { params: { page, limit } });
    return response.data;
  },
};

export default emailService;
