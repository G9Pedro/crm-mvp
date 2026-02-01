import { useState } from 'react';
import { toast } from 'react-toastify';
import emailService from '../services/emailService';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

const EmailModal = ({ isOpen, onClose, contact, contacts = [] }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (contact) {
        // Send to single contact
        await emailService.send({
          contactId: contact._id,
          subject: formData.subject,
          message: formData.message,
        });
        toast.success('Email sent successfully');
      } else if (contacts.length > 0) {
        // Send bulk email
        await emailService.sendBulk({
          contactIds: contacts.map(c => c._id),
          subject: formData.subject,
          message: formData.message,
        });
        toast.success(`Email sent to ${contacts.length} contacts`);
      }
      
      setFormData({ subject: '', message: '' });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Email" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
            {contact ? (
              <span>{contact.firstName} {contact.lastName} ({contact.email})</span>
            ) : (
              <span>{contacts.length} contacts selected</span>
            )}
          </div>
        </div>

        <Input
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="Enter email subject"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Enter your message"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Send Email
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmailModal;
