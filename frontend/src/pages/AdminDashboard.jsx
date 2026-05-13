import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, FileText, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, reviewsRes, usersRes] = await Promise.all([
        api.get('/reviews/stats'),
        api.get('/reviews'),
        api.get('/auth/users')
      ]);
      setStats(statsRes.data);
      setReviews(reviewsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}`);
        toast.success('Review deleted');
        fetchData(); // Refresh data
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  const pieData = [
    { name: 'Genuine', value: stats.genuineReviews, color: '#10B981' }, // Green
    { name: 'Fake', value: stats.fakeReviews, color: '#EF4444' } // Red
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
            <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReviews}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Genuine</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.genuineReviews}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fake</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fakeReviews}</p>
          </div>
        </div>
      </div>

      {/* Chart and Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fake vs Genuine Reviews</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sentiment Distribution</h2>
          <div className="space-y-4">
            {stats.sentimentStats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">{stat._id}</span>
                <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 py-1 px-3 rounded-full text-sm font-semibold">
                  {stat.count} Reviews
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Analyzed Reviews</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prediction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {rev.user?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {rev.productName.length > 20 ? rev.productName.substring(0, 20) + '...' : rev.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      rev.prediction === 'Genuine' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {rev.prediction}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(rev._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
