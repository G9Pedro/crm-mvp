import { useState, useEffect } from 'react';
import { FiMail, FiSend, FiInbox } from 'react-icons/fi';
import emailService from '../services/emailService';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';

const EmailCenter = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const data = await emailService.getHistory();
      setEmails(data.emails);
    } catch (error) {
      toast.error('Failed to load email history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      sent: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      delivered: 'bg-green-100 text-green-800',
      opened: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Center</h1>
        <p className="text-gray-600 mt-1">View your email communication history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-2">
          <Card title="Email History">
            {emails.length > 0 ? (
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedEmail?._id === email._id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FiMail className="text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {email.contact?.firstName} {email.contact?.lastName}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(email.status)}`}>
                            {email.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{email.recipient}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(email.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{email.subject}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {email.message.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No emails</h3>
                <p className="mt-1 text-sm text-gray-500">Send your first email to get started.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Email Detail */}
        <div>
          <Card title="Email Details">
            {selectedEmail ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">To</label>
                  <p className="mt-1 text-gray-900">{selectedEmail.recipient}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Contact</label>
                  <p className="mt-1 text-gray-900">
                    {selectedEmail.contact?.firstName} {selectedEmail.contact?.lastName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <p className="mt-1 text-gray-900">{selectedEmail.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block mt-1 text-sm px-3 py-1 rounded-full ${getStatusColor(selectedEmail.status)}`}>
                    {selectedEmail.status}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Sent</label>
                  <p className="mt-1 text-gray-900">
                    {format(new Date(selectedEmail.createdAt), 'PPpp')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <div
                    className="mt-1 text-gray-900 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.message }}
                  />
                </div>

                {selectedEmail.error && (
                  <div>
                    <label className="text-sm font-medium text-red-500">Error</label>
                    <p className="mt-1 text-red-600 text-sm">{selectedEmail.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiSend className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">Select an email to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailCenter;
