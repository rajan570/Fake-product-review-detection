import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle, UploadCloud, Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 mt-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 tracking-tight">
          Detect Fake Reviews <br /> with AI
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Protect your business and customers from fraudulent reviews using our advanced Machine Learning and NLP analysis tools.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
            <Search className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">Smart Analysis</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Uses NLP and ML algorithms to understand context, sentiment, and patterns in review text.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">High Accuracy</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Trained on vast datasets to distinguish between genuine customer feedback and spam.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">Bulk Processing</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Upload CSV files containing thousands of reviews and get insights in seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
