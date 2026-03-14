import React, { useState } from "react";
import axios from "axios";
import { ShoppingCart, Bell, MapPin, Star, Clock } from "lucide-react";

interface MedicineCardProps {
  medicine: any;
  onViewDetails: (id: string) => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onViewDetails }) => {
  const [alertSet, setAlertSet] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetAlert = async () => {
    try {
      setLoading(true);
      await axios.post("/api/alerts", { medicineId: medicine._id });
      setAlertSet(true);
      alert("Alert set successfully! You will be notified when the medicine is back in stock.");
    } catch (err) {
      console.error(err);
      alert("Failed to set alert. Maybe you already have an active alert for this medicine.");
    } finally {
      setLoading(false);
    }
  };

  const topPharmacies = medicine.pharmacies ? medicine.pharmacies.slice(0, 3) : [];
  const inStockCount = medicine.pharmacies ? medicine.pharmacies.filter((p: any) => p.quantity > 0).length : 0;

  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200">
        <h3 className="text-lg font-bold text-gray-900">{medicine.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {medicine.category}
          </span>
          <span className="text-sm font-semibold text-green-600">
            Available at {inStockCount} stores
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>
        
        {/* Price Badge */}
        {medicine.lowestPrice && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Lowest Price Available</p>
            <p className="text-2xl font-bold text-green-600">₹{medicine.lowestPrice}</p>
          </div>
        )}

        {/* Pharmacy List */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold text-gray-700">Available Stores:</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {topPharmacies.length > 0 ? (
              topPharmacies.map((pharm: any) => (
                <div 
                  key={pharm._id} 
                  className={`p-3 rounded-lg border ${
                    pharm.quantity > 0 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {pharm.pharmacy.name}
                      </h4>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {pharm.pharmacy.address.city}
                        {pharm.pharmacy.rating && (
                          <span className="ml-2 flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-0.5" />
                            {pharm.pharmacy.rating}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="font-bold text-blue-600 text-lg">₹{pharm.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={pharm.quantity > 0 ? 'text-green-700 font-semibold' : 'text-gray-500'}>
                      {pharm.quantity > 0 ? `${pharm.quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No pharmacy details available</p>
            )}
          </div>
        </div>

        {medicine.pharmacies && medicine.pharmacies.length > 3 && (
          <p className="text-xs text-gray-500 text-center mb-4">
            +{medicine.pharmacies.length - 3} more stores available
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => onViewDetails(medicine._id)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Details
        </button>
        <button
          onClick={handleSetAlert}
          disabled={alertSet || loading}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors text-sm font-medium ${
            alertSet
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <Bell className="w-4 h-4 mr-1" />
          {alertSet ? "Alert Set" : loading ? "Setting..." : "Alert"}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
