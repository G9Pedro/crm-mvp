import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Button from './Button';

const DealPipeline = ({ deals, onEdit, onDelete, onStageChange }) => {
  const stages = [
    { key: 'prospecting', label: 'Prospecting', color: 'bg-gray-100' },
    { key: 'qualification', label: 'Qualification', color: 'bg-blue-100' },
    { key: 'proposal', label: 'Proposal', color: 'bg-yellow-100' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-100' },
    { key: 'closed-won', label: 'Closed Won', color: 'bg-green-100' },
    { key: 'closed-lost', label: 'Closed Lost', color: 'bg-red-100' },
  ];

  const getDealsByStage = (stage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageTotal = (stage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      onStageChange(dealId, stage);
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="inline-flex space-x-4 min-w-full">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.key);
          const stageTotal = getStageTotal(stage.key);

          return (
            <div
              key={stage.key}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className={`${stage.color} rounded-lg p-4 mb-3`}>
                <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  {stageDeals.length} deals · ${stageTotal.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {stageDeals.map((deal) => (
                  <div
                    key={deal._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal._id)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow"
                  >
                    <Link
                      to={`/deals/${deal._id}`}
                      className="font-medium text-gray-900 hover:text-primary block mb-2"
                    >
                      {deal.title}
                    </Link>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {deal.contact?.firstName} {deal.contact?.lastName}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        ${deal.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">{deal.probability}%</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(deal);
                        }}
                        className="flex-1 flex items-center justify-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(deal._id);
                        }}
                        className="flex items-center justify-center"
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DealPipeline;
