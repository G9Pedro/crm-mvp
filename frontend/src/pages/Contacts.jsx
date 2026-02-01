import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import contactService from '../services/contactService';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ContactForm from '../components/ContactForm';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  useEffect(() => {
    fetchContacts();
  }, [pagination.page]);

  const fetchContacts = async () => {
    try {
      const data = await contactService.getAll(pagination.page);
      setContacts(data.contacts);
      setPagination({ page: data.page, total: data.total });
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchContacts();
      return;
    }
    try {
      setLoading(true);
      const data = await contactService.search(searchTerm);
      setContacts(data.contacts);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactService.delete(id);
      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingContact(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchContacts();
  };

  const statusColors = {
    lead: 'bg-yellow-100 text-yellow-800',
    prospect: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center"
        >
          <FiPlus className="mr-2" /> Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          icon={FiSearch}
          className="flex-1"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Contacts Grid */}
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link
                    to={`/contacts/${contact._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary"
                  >
                    {contact.firstName} {contact.lastName}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{contact.company}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[contact.status]}`}>
                  {contact.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FiMail className="mr-2" />
                  {contact.email}
                </div>
                {contact.phone && (
                  <div className="text-sm text-gray-600">{contact.phone}</div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(contact)}
                  className="flex-1 flex items-center justify-center"
                >
                  <FiEdit className="mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(contact._id)}
                  className="flex items-center justify-center"
                >
                  <FiTrash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new contact.</p>
          <div className="mt-6">
            <Button onClick={() => setShowModal(true)}>
              <FiPlus className="mr-2" /> Add Contact
            </Button>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Contacts;
