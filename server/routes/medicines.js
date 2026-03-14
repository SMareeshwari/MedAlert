import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Search medicines with inventory information
router.get('/search', (req, res) => {
  try {
    const { query, location, category, maxPrice } = req.query;
    const readData = req.app.get('readData');
    const data = readData();

    let medicines = [...data.medicines];

    // Text search for medicine name
    if (query) {
      const searchTerm = query.toLowerCase();
      medicines = medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm) ||
        med.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (category && category !== 'all') {
      medicines = medicines.filter(med => med.category === category);
    }

    // Get inventory information for each medicine
    const medicinesWithInventory = medicines.map(medicine => {
      let inventory = data.inventory.filter(inv => inv.medicine === medicine._id);

      // Location filter - search by city/state
      if (location) {
        const locationTerm = location.toLowerCase();
        const pharmaciesInLocation = data.pharmacies.filter(ph =>
          ph.address.city.toLowerCase().includes(locationTerm) ||
          ph.address.state.toLowerCase().includes(locationTerm)
        );
        const pharmacyIds = pharmaciesInLocation.map(ph => ph._id);
        inventory = inventory.filter(inv => pharmacyIds.includes(inv.pharmacy));
      }

      // Filter by max price if specified
      if (maxPrice) {
        inventory = inventory.filter(inv => inv.price <= parseFloat(maxPrice));
      }

      // Get pharmacy details and filter available inventory
      const availableInventory = inventory
        .filter(inv => inv.quantity > 0)
        .map(inv => {
          const pharmacy = data.pharmacies.find(ph => ph._id === inv.pharmacy);
          return {
            _id: inv._id,
            pharmacy: {
              name: pharmacy?.name || 'Unknown Pharmacy',
              address: pharmacy?.address || {},
              rating: pharmacy?.rating || 0
            },
            price: inv.price,
            quantity: inv.quantity
          };
        })
        .sort((a, b) => a.price - b.price); // Sort by price ascending

      // Calculate available pharmacies and lowest price
      const availableAt = availableInventory.length;
      const lowestPrice = availableAt > 0 ? availableInventory[0].price : null;

      return {
        _id: medicine._id,
        name: medicine.name,
        category: medicine.category,
        description: medicine.description,
        dosage: medicine.dosage,
        manufacturer: medicine.manufacturer,
        availableAt,
        lowestPrice,
        pharmacies: availableInventory
      };
    });

    // Filter out medicines with no available inventory
    const availableMedicines = medicinesWithInventory.filter(med => med.availableAt > 0);

    res.json({ medicines: availableMedicines });
  } catch (error) {
    console.error('Medicine search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all medicines (admin only)
router.get('/', authenticateToken, requireRole(['pharmacy_admin']), (req, res) => {
  try {
    const readData = req.app.get('readData');
    const data = readData();

    const medicines = data.medicines.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ medicines });
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create medicine (admin only)
router.post('/', authenticateToken, requireRole(['pharmacy_admin']), (req, res) => {
  try {
    const { name, category, description, dosage, manufacturer } = req.body;
    const readData = req.app.get('readData');
    const writeData = req.app.get('writeData');
    const data = readData();

    const medicine = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      category,
      description,
      dosage,
      manufacturer,
      createdAt: new Date().toISOString()
    };

    data.medicines.push(medicine);
    writeData(data);

    res.status(201).json({ medicine });
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update medicine inventory (pharmacy admin only)
router.put('/:medicineId/inventory', authenticateToken, requireRole(['pharmacy_admin']), (req, res) => {
  try {
    const { medicineId } = req.params;
    const { pharmacyId, price, quantity } = req.body;
    const readData = req.app.get('readData');
    const writeData = req.app.get('writeData');
    const data = readData();

    // Verify pharmacy belongs to admin
    const pharmacy = data.pharmacies.find(ph => ph._id === pharmacyId && ph.admin === req.user._id);
    if (!pharmacy) {
      return res.status(403).json({ message: 'Unauthorized to update this pharmacy' });
    }

    // Find or create inventory record
    let inventory = data.inventory.find(inv => inv.medicine === medicineId && inv.pharmacy === pharmacyId);

    if (inventory) {
      inventory.price = price;
      inventory.quantity = quantity;
      inventory.lastUpdated = new Date().toISOString();
    } else {
      inventory = {
        _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        medicine: medicineId,
        pharmacy: pharmacyId,
        price,
        quantity,
        lastUpdated: new Date().toISOString()
      };
      data.inventory.push(inventory);
    }

    writeData(data);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('inventoryUpdate', {
      medicineId,
      pharmacyId,
      newQuantity: quantity,
      medicineName: data.medicines.find(m => m._id === medicineId)?.name || 'Unknown Medicine',
      pharmacyName: pharmacy.name
    });

    res.json({ inventory });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get medicine by ID with full details
router.get('/:id', (req, res) => {
  try {
    const readData = req.app.get('readData');
    const data = readData();

    const medicine = data.medicines.find(med => med._id === req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Get inventory information for this medicine
    const inventory = data.inventory.filter(inv => inv.medicine === medicine._id);

    // Get pharmacy details
    const pharmacies = inventory
      .filter(inv => inv.quantity > 0)
      .map(inv => {
        const pharmacy = data.pharmacies.find(ph => ph._id === inv.pharmacy);
        return {
          _id: inv._id,
          pharmacy: pharmacy ? {
            name: pharmacy.name,
            address: pharmacy.address,
            phone: pharmacy.phone,
            rating: pharmacy.rating,
            hours: pharmacy.hours
          } : null,
          price: inv.price,
          quantity: inv.quantity
        };
      })
      .sort((a, b) => a.price - b.price);

    const medicineWithDetails = {
      ...medicine,
      availableAt: pharmacies.length,
      lowestPrice: pharmacies.length > 0 ? pharmacies[0].price : null,
      pharmacies
    };

    res.json({ medicine: medicineWithDetails });
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;