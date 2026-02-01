import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';
import dealService from '../services/dealService';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import DealForm from '../components/DealForm';
import ActivityForm from '../components/ActivityForm';

const DealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const fetchDeal = async () => {
    try {
      const data = await dealService.getById(id);
      setDeal(data);
    } catch (error) {
      toast.error('Failed to load deal');
      navigate('/deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    try {
      await dealService.delete(id);
      toast.success('Deal deleted successfully');
      navigate('/deals');
    } catch (error) {
      toast.error('Failed to delete deal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!deal) return null;

  const stageColors = {
    prospecting: 'bg-gray-100 text-gray-800',
    qualification: 'bg-blue-100 text-blue-800',
    proposal: 'bg-yellow-100 text-yellow-800',
    negotiation: 'bg-orange-100 text-orange-800',
    'closed-won': 'bg-green-100 text-green-800',
    'closed-lost': 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/deals" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{deal.title}</h1>
            <span className={`inline-block mt-2 text-sm px-3 py-1 rounded-full ${stageColors[deal.stage]}`}>
              {deal.stage}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowActivityModal(true)}>
            Add Activity
          </Button>
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            <FiEdit className="mr-2" /> Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FiTrash2 />
          </Button>
        </div>
      </div>

      {/* Deal Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Deal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Value</label>
                <div className="mt-1 flex items-center text-2xl font-bold text-gray-900">
                  <FiDollarSign />
                  {deal.value.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Probability</label>
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-bold text-gray-900">{deal.probability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Contact</label>
                <div className="mt-1 flex items-center text-gray-900">
                  <FiUser className="mr-2" />
                  <Link to={`/contacts/${deal.contact._id}`} className="hover:text-primary">
                    {deal.contact.firstName} {deal.contact.lastName}
                  </Link>
                </div>
              </div>

              {deal.expectedCloseDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Expected Close Date</label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <FiCalendar className="mr-2" />
                    {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {deal.notes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{deal.notes}</p>
              </div>
            )}
          </Card>

          <Card title="Activities">
            {deal.activities && deal.activities.length > 0 ? (
              <div className="space-y-4">
                {deal.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 capitalize">{activity.type}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{activity.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No activities yet</p>
            )}
          </Card>
        </div>

        <div>
          <Card title="Quick Info">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="mt-1 text-gray-900">{deal.contact.company || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Email</label>
                <p className="mt-1 text-gray-900">{deal.contact.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-gray-900">
                  {new Date(deal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {new Date(deal.updatedAt).toLocaleDateString()}
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
        title="Edit Deal"
        size="lg"
      >
        <DealForm
          deal={deal}
          onSuccess={() => {
            setShowEditModal(false);
            fetchDeal();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Add Activity"
      >
        <ActivityForm
          dealId={deal._id}
          onSuccess={() => {
            setShowActivityModal(false);
            fetchDeal();
          }}
          onCancel={() => setShowActivityModal(false)}
        />
      </Modal>
    </div>
  );
};

export default DealDetail;
