import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [errors, setErrors] = useState<{ search?: string; location?: string }>({});
  const [locationSuggestions] = useState([
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tiruppur'
  ]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/medicines/categories/list');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    const newErrors: { search?: string; location?: string } = {};

    // Validate search query
    if (!searchQuery.trim()) {
      newErrors.search = 'Please enter a medicine name';
    }

    // Validate location
    if (!location.trim()) {
      newErrors.location = 'Please select a location';
    }

    setErrors(newErrors);

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const params = new URLSearchParams();
    params.append('query', searchQuery.trim());
    params.append('location', location.trim());
    if (category !== 'all') params.append('category', category);
    if (maxPrice) params.append('maxPrice', maxPrice);

    // Navigate to SearchResults page with query params
    navigate(`/search-results?${params.toString()}`);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocationSuggestions(false);
  };

  const popularSearches = [
    'Paracetamol', 'Ibuprofen', 'Cetirizine', 'Amoxicillin', 'Vitamin D3'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Medicines Near You
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Real-time availability across local pharmacies
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search for medicines..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (e.target.value.trim()) {
                              setErrors(prev => ({ ...prev, search: undefined }));
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:border-transparent text-gray-900 ${
                            errors.search
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                      {errors.search && (
                        <p className="text-red-500 text-sm mt-2 font-semibold">⚠️ {errors.search}</p>
                      )}
                    </div>

                    <div className="md:w-64">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter location..."
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            setShowLocationSuggestions(true);
                            if (e.target.value.trim()) {
                              setErrors(prev => ({ ...prev, location: undefined }));
                            }
                          }}
                          onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:border-transparent text-gray-900 ${
                            errors.location
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        {showLocationSuggestions && location && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 z-10 shadow-lg">
                            {locationSuggestions
                              .filter(l => l.toLowerCase().includes(location.toLowerCase()))
                              .map(suggestion => (
                                <button
                                  key={suggestion}
                                  onClick={() => handleLocationSelect(suggestion)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900"
                                >
                                  {suggestion}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-2 font-semibold">⚠️ {errors.location}</p>
                      )}
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Filters
                    </button>
                  </div>

                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="all">All Categories</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Price (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="Enter max price"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                </div>

                {/* Search Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleSearch}
                  className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Search Medicines
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Searches & Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Searches */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Searches</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setSearchQuery(search);
                  setTimeout(() => {
                    const params = new URLSearchParams();
                    params.append('query', search);
                    navigate(`/search-results?${params.toString()}`);
                  }, 100);
                }}
                className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Real-Time Updates</h3>
            </div>
            <p className="text-gray-600">
              Get instant notifications about medicine availability across Tamil Nadu pharmacies
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Find Nearby</h3>
            </div>
            <p className="text-gray-600">
              Search medicines from pharmacies near you across all major Tamil Nadu cities
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Star className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Best Prices</h3>
            </div>
            <p className="text-gray-600">
              Compare prices and find the best deals on medicines from verified pharmacies
            </p>
          </div>
        </div>

        {/* Coverage Area */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Coverage</h2>
          <p className="text-gray-700 mb-4">
            We serve customers across Tamil Nadu with real-time medicine availability from trusted pharmacies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-600">Chennai</p>
              <p className="text-sm text-gray-600">4 pharmacies</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-600">Coimbatore</p>
              <p className="text-sm text-gray-600">3 pharmacies</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-600">Madurai</p>
              <p className="text-sm text-gray-600">2 pharmacies</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-600">Salem</p>
              <p className="text-sm text-gray-600">2 pharmacies</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-600">Trichy</p>
              <p className="text-sm text-gray-600">1 pharmacy</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="font-semibold text-blue-600">Tiruppur</p>
              <p className="text-sm text-gray-600">1 pharmacy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
