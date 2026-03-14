import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Pharmacy {
  _id: string;
  pharmacy: {
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
  };
  price: number;
  quantity: number;
}

interface Medicine {
  _id: string;
  name: string;
  category: string;
  description: string;
  dosage: string;
  manufacturer: string;
  availableAt: number;
  lowestPrice: number;
  pharmacies: Pharmacy[];
}

const MedicineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Use the dedicated medicine details endpoint
        const response = await axios.get(`/api/medicines/${id}`);
        setMedicine(response.data.medicine);
      } catch (err) {
        console.error('Error fetching medicine details:', err);
        setError('Failed to load medicine details');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading medicine details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Medicine not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Back to Search
        </button>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{medicine.category}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Dosage:</span> {medicine.dosage}
              </div>
              <div>
                <span className="font-semibold">Manufacturer:</span> {medicine.manufacturer}
              </div>
              <div>
                <span className="font-semibold">Available at:</span> {medicine.availableAt} pharmacies
              </div>
              <div>
                <span className="font-semibold">Lowest Price:</span> ₹{medicine.lowestPrice}
              </div>
            </div>
            {medicine.description && (
              <div className="mt-4">
                <span className="font-semibold">Description:</span>
                <p className="text-gray-700 mt-1">{medicine.description}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Available Pharmacies</h2>
            <div className="space-y-4">
              {medicine.pharmacies.map((pharm) => (
                <div key={pharm._id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{pharm.pharmacy.name}</h3>
                      <p className="text-gray-600">
                        {pharm.pharmacy.address.street}, {pharm.pharmacy.address.city}, {pharm.pharmacy.address.state}
                      </p>
                      <p className="text-sm text-gray-500">
                        📞 {pharm.pharmacy.phone} | ⭐ {pharm.pharmacy.rating}/5
                      </p>
                      <p className="text-sm text-gray-500">
                        🕐 {pharm.pharmacy.hours.open} - {pharm.pharmacy.hours.close}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{pharm.price}</p>
                      <p className={`text-sm ${pharm.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pharm.quantity > 0 ? `${pharm.quantity} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                  {pharm.quantity > 0 && (
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Order Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;