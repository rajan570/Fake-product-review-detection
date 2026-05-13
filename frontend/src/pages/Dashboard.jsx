import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FileText, Upload, RefreshCw, Eye } from 'lucide-react';

const Dashboard = () => {
  const [productName, setProductName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'bulk'
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/myreviews');
      setReviews(res.data);
    } catch (error) {
      toast.error('Failed to fetch past reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/reviews', { productName, reviewText });
      toast.success('Review analyzed successfully!');
      setProductName('');
      setReviewText('');
      fetchReviews();
      navigate(`/result/${res.data._id}`, { state: { result: res.data } });
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a CSV file');

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      await api.post('/reviews/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Bulk analysis completed!');
      setFile(null);
      fetchReviews();
      // Reset file input
      document.getElementById('csv-upload').value = '';
    } catch (error) {
      toast.error('Bulk upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'single'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-gray-700/50'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Single Review Analysis
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'bulk'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-gray-700/50'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Bulk CSV Upload
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'single' ? (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Wireless Bluetooth Earbuds"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review Content</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Paste the review text here..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-70 transition-colors"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
                Analyze Review
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700/30">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Upload a CSV file containing <span className="font-semibold">productName</span> and <span className="font-semibold">reviewText</span> columns.
                </p>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100 dark:file:bg-gray-600 dark:file:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !file}
                className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-70 transition-colors"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
                Upload and Analyze
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Previous Analyses</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No reviews analyzed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prediction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {rev.productName.length > 25 ? rev.productName.substring(0, 25) + '...' : rev.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rev.prediction === 'Genuine' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {rev.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {rev.confidence}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {rev.sentiment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/result/${rev._id}`, { state: { result: rev } })}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
