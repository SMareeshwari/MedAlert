import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Store, Package, Users, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface InventoryItem {
  _id: string;
  medicine: {
    name: string;
    category: string;
  };
  quantity: number;
  price: number;
  lastUpdated: string;
}

interface Reservation {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  medicine: {
    name: string;
  };
  quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const PharmacyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockItems: 0,
    pendingReservations: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [inventoryRes, reservationsRes] = await Promise.all([
          axios.get('/api/inventory/pharmacy'),
          axios.get('/api/reservations/pharmacy')
        ]);
        
        setInventory(inventoryRes.data.inventory);
        setReservations(reservationsRes.data.reservations);
        
        // Calculate stats
        const lowStock = inventoryRes.data.inventory.filter((item: InventoryItem) => item.quantity < 10).length;
        const pending = reservationsRes.data.reservations.filter((res: Reservation) => res.status === 'pending').length;
        
        setStats({
          totalMedicines: inventoryRes.data.inventory.length,
          lowStockItems: lowStock,
          pendingReservations: pending,
          totalRevenue: 0 // This would need to be calculated from actual sales data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUpdateInventory = async (itemId: string, newQuantity: number, newPrice: number) => {
    try {
      await axios.put(`/api/inventory/${itemId}`, {
        quantity: newQuantity,
        price: newPrice
      });
      
      setInventory(prev => prev.map(item => 
        item._id === itemId 
          ? { ...item, quantity: newQuantity, price: newPrice, lastUpdated: new Date().toISOString() }
          : item
      ));
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pharmacy Dashboard
          </h1>
          <p className="text-gray-600">Manage your inventory and reservations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMedicines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReservations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Package className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {inventory.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.medicine.name}</h3>
                      <p className="text-sm text-gray-600">{item.medicine.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.quantity < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.quantity < 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          handleUpdateInventory(item._id, newQuantity, item.price);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => {
                          const newPrice = parseFloat(e.target.value);
                          handleUpdateInventory(item._id, item.quantity, newPrice);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reservations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Reservations</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reservations.slice(0, 5).map((reservation) => (
                <div key={reservation._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{reservation.medicine.name}</h3>
                      <p className="text-sm text-gray-600">Customer: {reservation.customer.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Qty: {reservation.quantity}</span>
                    <span>{new Date(reservation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;

