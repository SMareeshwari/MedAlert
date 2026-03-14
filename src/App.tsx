import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import Pharmacies from './pages/Pharmacies';
import Dashboard from './pages/Dashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import MedicineDetails from './pages/MedicineDetails';

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pharmacy-dashboard" element={<ProtectedRoute><PharmacyDashboard /></ProtectedRoute>} />
            <Route path="/medicine/:id" element={<MedicineDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
