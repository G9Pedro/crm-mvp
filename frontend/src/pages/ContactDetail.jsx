import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import contactService from '../services/contactService';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ContactForm from '../components/ContactForm';
import EmailModal from '../components/EmailModal';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      const data = await contactService.getById(id);
      setContact(data);
    } catch (error) {
      toast.error('Failed to load contact');
      navigate('/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactService.delete(id);
      toast.success('Contact deleted successfully');
      navigate('/contacts');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!contact) return null;

  const statusColors = {
    lead: 'bg-yellow-100 text-yellow-800',
    prospect: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/contacts" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h1>
            <span className={`inline-block mt-2 text-sm px-3 py-1 rounded-full ${statusColors[contact.status]}`}>
              {contact.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEmailModal(true)}>
            <FiMail className="mr-2" /> Send Email
          </Button>
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            <FiEdit className="mr-2" /> Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FiTrash2 />
          </Button>
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="mt-1 flex items-center text-gray-900">
                  <FiMail className="mr-2" />
                  <a href={`mailto:${contact.email}`} className="hover:text-primary">
                    {contact.email}
                  </a>
                </div>
              </div>

              {contact.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <FiPhone className="mr-2" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.company && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <FiBriefcase className="mr-2" />
                    {contact.company}
                  </div>
                </div>
              )}

              {contact.position && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="mt-1 text-gray-900">{contact.position}</p>
                </div>
              )}
            </div>

            {contact.notes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card title="Quick Stats">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-gray-900">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {new Date(contact.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contact={contact}
          onSuccess={() => {
            setShowEditModal(false);
            fetchContact();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        contact={contact}
      />
    </div>
  );
};

export default ContactDetail;
