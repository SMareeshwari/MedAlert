import React, { useState, useEffect } from 'react';
import { MapPin, Star, Phone, Clock, X } from 'lucide-react';
import axios from 'axios';

interface Pharmacy {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  rating: number;
  hours: {
    open: string;
    close: string;
  };
}

const Pharmacies: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get(`/api/pharmacies?_=${Date.now()}`);
        setPharmacies(response.data.pharmacies);
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  const filteredPharmacies = pharmacies.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
    pharmacy.address.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
    pharmacy.address.state.toLowerCase().includes(searchLocation.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pharmacies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Pharmacies Near You
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover local pharmacies and their services
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pharmacy name, city, or state..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>

        {filteredPharmacies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchLocation ? 'No pharmacies found matching your search.' : 'No pharmacies available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{pharmacy.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {pharmacy.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                    <div className="text-sm text-gray-600">
                      <p>{pharmacy.address.street}</p>
                      <p>
                        {pharmacy.address.city}, {pharmacy.address.state} {pharmacy.address.zipCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{pharmacy.phone}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {pharmacy.hours.open} - {pharmacy.hours.close}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedPharmacy(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedPharmacy.name}</h2>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> {selectedPharmacy.address.street},{" "}
              {selectedPharmacy.address.city}, {selectedPharmacy.address.state}{" "}
              {selectedPharmacy.address.zipCode}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> {selectedPharmacy.phone}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Hours:</strong> {selectedPharmacy.hours.open} - {selectedPharmacy.hours.close}
            </p>
            <p className="text-gray-700">
              <strong>Rating:</strong> ⭐ {selectedPharmacy.rating.toFixed(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacies;
