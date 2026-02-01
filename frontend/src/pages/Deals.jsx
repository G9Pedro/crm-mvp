import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import dealService from '../services/dealService';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import DealForm from '../components/DealForm';
import DealPipeline from '../components/DealPipeline';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'list'

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const data = await dealService.getAll(1, 100);
      setDeals(data.deals);
    } catch (error) {
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    try {
      await dealService.delete(id);
      toast.success('Deal deleted successfully');
      fetchDeals();
    } catch (error) {
      toast.error('Failed to delete deal');
    }
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      await dealService.updateStage(dealId, newStage);
      toast.success('Deal stage updated');
      fetchDeals();
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingDeal(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    fetchDeals();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage your sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'pipeline' ? 'primary' : 'outline'}
            onClick={() => setViewMode('pipeline')}
          >
            Pipeline
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="flex items-center"
          >
            <FiPlus className="mr-2" /> Add Deal
          </Button>
        </div>
      </div>

      {/* Pipeline or List View */}
      {viewMode === 'pipeline' ? (
        <DealPipeline
          deals={deals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStageChange={handleStageChange}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deals.map((deal) => (
                  <tr key={deal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {deal.contact?.firstName} {deal.contact?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${deal.value.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{deal.probability}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(deal)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
        size="lg"
      >
        <DealForm
          deal={editingDeal}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Deals;
