import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ArrowLeft, BarChart2 } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No result found.</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary-600 hover:underline">
          Go back to dashboard
        </button>
      </div>
    );
  }

  const isFake = result.prediction === 'Fake';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header section with colored background based on result */}
        <div className={`p-8 text-center ${isFake ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
          <div className="flex justify-center mb-4">
            {isFake ? (
              <AlertTriangle className="h-20 w-20 text-red-500 dark:text-red-400" />
            ) : (
              <CheckCircle className="h-20 w-20 text-green-500 dark:text-green-400" />
            )}
          </div>
          <h2 className={`text-4xl font-extrabold ${isFake ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
            {result.prediction} Review
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
            Confidence Score: <span className="font-bold">{result.confidence}%</span>
          </p>
        </div>

        {/* Details section */}
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Product</h3>
            <p className="text-xl font-medium text-gray-900 dark:text-white">{result.productName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Review Content</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg italic text-gray-700 dark:text-gray-300 border-l-4 border-primary-500">
              "{result.reviewText}"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sentiment Analysis</h3>
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-primary-500" />
                <span className={`font-semibold ${
                  result.sentiment === 'Positive' ? 'text-green-600 dark:text-green-400' : 
                  result.sentiment === 'Negative' ? 'text-red-600 dark:text-red-400' : 
                  'text-gray-600 dark:text-gray-300'
                }`}>
                  {result.sentiment}
                </span>
              </div>
            </div>

            {result.suspiciousWords && result.suspiciousWords.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Suspicious Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.suspiciousWords.map((word, idx) => (
                    <span key={idx} className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
