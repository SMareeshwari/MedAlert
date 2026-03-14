import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

interface Reservation {
  _id: string;
  medicine: {
    name: string;
    category: string;
  };
  pharmacy: {
    name: string;
    address: {
      city: string;
      state: string;
    };
  };
  quantity: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations/my-reservations');
        setReservations(response.data.reservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your medicine reservations</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">My Reservations</h2>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations yet</h3>
              <p className="text-gray-600 mb-6">Start by searching for medicines you need</p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search Medicines
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {reservation.medicine.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Pharmacy:</strong> {reservation.pharmacy.name}</p>
                          <p><strong>Location:</strong> {reservation.pharmacy.address.city}, {reservation.pharmacy.address.state}</p>
                        </div>
                        <div>
                          <p><strong>Quantity:</strong> {reservation.quantity}</p>
                          <p><strong>Price:</strong> ₹{reservation.price}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Reserved on: {new Date(reservation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center ml-4">
                      {getStatusIcon(reservation.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

