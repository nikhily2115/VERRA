import api from './api';

const contactService = {
  // Submit contact form
  submitContactForm: async (formData) => {
    const response = await api.post('/contact', formData);
    return response.data;
  },
};

export default contactService;