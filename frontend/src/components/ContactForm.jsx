import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import contactService from '../services/contactService';
import Button from './Button';
import Input from './Input';

const ContactForm = ({ contact, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead',
    notes: '',
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        position: contact.position || '',
        status: contact.status || 'lead',
        notes: contact.notes || '',
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (contact) {
        await contactService.update(contact._id, formData);
        toast.success('Contact updated successfully');
      } else {
        await contactService.create(formData);
        toast.success('Contact created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
        <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="lead">Lead</option>
          <option value="prospect">Prospect</option>
          <option value="customer">Customer</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {contact ? 'Update' : 'Create'} Contact
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
