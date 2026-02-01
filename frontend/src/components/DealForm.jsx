import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import dealService from '../services/dealService';
import contactService from '../services/contactService';
import Button from './Button';
import Input from './Input';
import LoadingSpinner from './LoadingSpinner';

const DealForm = ({ deal, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    contact: '',
    stage: 'prospecting',
    probability: 0,
    expectedCloseDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchContacts();
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value || '',
        contact: deal.contact?._id || '',
        stage: deal.stage || 'prospecting',
        probability: deal.probability || 0,
        expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
        notes: deal.notes || '',
      });
    }
  }, [deal]);

  const fetchContacts = async () => {
    try {
      const data = await contactService.getAll(1, 100);
      setContacts(data.contacts);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        value: parseFloat(formData.value),
      };

      if (deal) {
        await dealService.update(deal._id, submitData);
        toast.success('Deal updated successfully');
      } else {
        await dealService.create(submitData);
        toast.success('Deal created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save deal');
    } finally {
      setLoading(false);
    }
  };

  if (loadingContacts) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Deal Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        placeholder="e.g., Enterprise Software License"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Deal Value ($)"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact
          </label>
          <select
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select contact</option>
            {contacts.map((contact) => (
              <option key={contact._id} value={contact._id}>
                {contact.firstName} {contact.lastName} - {contact.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="prospecting">Prospecting</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </select>
        </div>

        <Input
          label="Probability (%)"
          name="probability"
          type="number"
          value={formData.probability}
          onChange={handleChange}
          min="0"
          max="100"
          placeholder="0-100"
        />
      </div>

      <Input
        label="Expected Close Date"
        name="expectedCloseDate"
        type="date"
        value={formData.expectedCloseDate}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Additional information about this deal..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {deal ? 'Update' : 'Create'} Deal
        </Button>
      </div>
    </form>
  );
};

export default DealForm;
