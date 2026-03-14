import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MedicineCard from "../components/MedicineCard";
import { io, Socket } from "socket.io-client";

interface Pharmacy {
  _id: string;
  pharmacy: {
    name: string;
    address: {
      city: string;
      state: string;
    };
    rating: number;
  };
  price: number;
  quantity: number;
}

interface Medicine {
  _id: string;
  name: string;
  category: string;
  availableAt: number;
  lowestPrice: number | null;
  pharmacies: Pharmacy[];
}

const SearchResults: React.FC = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Parse query parameters
  const queryParams = new URLSearchParams(locationHook.search);
  const query = queryParams.get("query") || "";
  const locationParam = queryParams.get("location") || "";
  const category = queryParams.get("category") || "all";
  const maxPrice = queryParams.get("maxPrice") || "";

  // Fetch medicines from backend
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (locationParam) params.append("location", locationParam);
        if (category && category !== "all") params.append("category", category);
        if (maxPrice) params.append("maxPrice", maxPrice);

        const response = await axios.get(`/api/medicines/search?${params}`);
        setMedicines(response.data.medicines);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [query, locationParam, category, maxPrice]);

  // Initialize socket.io connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // backend URL
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen for real-time inventory updates
  useEffect(() => {
    if (!socket) return;

    socket.on("inventoryUpdate", (data: { medicineId: string; pharmacyId: string; newQuantity: number }) => {
      setMedicines((prevMedicines) =>
        prevMedicines.map((med) => {
          if (med._id === data.medicineId) {
            const updatedPharmacies = med.pharmacies.map((ph) =>
              ph._id === data.pharmacyId ? { ...ph, quantity: data.newQuantity } : ph
            );

            const availableAt = updatedPharmacies.filter((ph) => ph.quantity > 0).length;
            const lowestPrice =
              updatedPharmacies.filter((ph) => ph.quantity > 0).reduce((min, ph) => (ph.price < min ? ph.price : min), Infinity) || null;

            return { ...med, pharmacies: updatedPharmacies, availableAt, lowestPrice };
          }
          return med;
        })
      );
    });

    return () => {
      socket.off("inventoryUpdate");
    };
  }, [socket]);

  const handleViewDetails = (medicineId: string) => {
    navigate(`/medicine/${medicineId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading medicines...</p>
        ) : medicines.length === 0 ? (
          <p className="text-center text-gray-600">No medicines found for your search.</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">
              Search Results ({medicines.length})
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((med) => (
                <MedicineCard key={med._id} medicine={med} onViewDetails={handleViewDetails} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
