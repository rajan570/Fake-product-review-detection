import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Result from './pages/Result';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/result/:id" 
            element={
              <PrivateRoute>
                <Result />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
