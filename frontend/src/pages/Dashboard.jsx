import { useState, useEffect } from 'react';
import { FiUsers, FiBriefcase, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import contactService from '../services/contactService';
import dealService from '../services/dealService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    contacts: 0,
    deals: 0,
    revenue: 0,
    pipeline: 0,
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contactsRes, dealsRes, dealStatsRes] = await Promise.all([
        contactService.getAll(1, 5),
        dealService.getAll(1, 5),
        dealService.getStats(),
      ]);

      setStats({
        contacts: contactsRes.total,
        deals: dealStatsRes.totalDeals,
        revenue: dealStatsRes.wonValue,
        pipeline: dealStatsRes.pipelineValue,
      });

      setRecentContacts(contactsRes.contacts);
      setRecentDeals(dealsRes.deals);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your CRM overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.contacts}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Active Deals"
          value={stats.deals}
          icon={FiBriefcase}
          color="purple"
        />
        <StatCard
          title="Revenue Won"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={FiDollarSign}
          color="green"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${stats.pipeline.toLocaleString()}`}
          icon={FiTrendingUp}
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <Card
          title="Recent Contacts"
          action={
            <Link to="/contacts" className="text-sm text-primary hover:text-blue-700">
              View all
            </Link>
          }
        >
          <div className="space-y-3">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact) => (
                <Link
                  key={contact._id}
                  to={`/contacts/${contact._id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {contact.status}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No contacts yet</p>
            )}
          </div>
        </Card>

        {/* Recent Deals */}
        <Card
          title="Recent Deals"
          action={
            <Link to="/deals" className="text-sm text-primary hover:text-blue-700">
              View all
            </Link>
          }
        >
          <div className="space-y-3">
            {recentDeals.length > 0 ? (
              recentDeals.map((deal) => (
                <Link
                  key={deal._id}
                  to={`/deals/${deal._id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{deal.title}</p>
                    <p className="text-sm text-gray-500">
                      ${deal.value.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    {deal.stage}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No deals yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
