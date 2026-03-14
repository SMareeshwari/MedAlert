import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all pharmacies
router.get('/', (req, res) => {
  try {
    const readData = req.app.get('readData');
    const data = readData();

    const pharmacies = data.pharmacies.map(pharmacy => {
      const admin = data.users.find(user => user._id === pharmacy.admin);
      return {
        ...pharmacy,
        admin: admin ? { name: admin.name, email: admin.email } : null
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ pharmacies });
  } catch (error) {
    console.error('Get pharmacies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pharmacy by ID
router.get('/:id', (req, res) => {
  try {
    const readData = req.app.get('readData');
    const data = readData();

    const pharmacy = data.pharmacies.find(ph => ph._id === req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const admin = data.users.find(user => user._id === pharmacy.admin);
    const pharmacyWithAdmin = {
      ...pharmacy,
      admin: admin ? { name: admin.name, email: admin.email, phone: admin.phone } : null
    };

    res.json({ pharmacy: pharmacyWithAdmin });
  } catch (error) {
    console.error('Get pharmacy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create pharmacy (pharmacy admin only)
router.post('/', authenticateToken, requireRole(['pharmacy_admin']), (req, res) => {
  try {
    const { name, address, phone, hours } = req.body;
    const readData = req.app.get('readData');
    const writeData = req.app.get('writeData');
    const data = readData();

    const pharmacy = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      address,
      phone,
      rating: 0,
      hours,
      admin: req.user._id,
      createdAt: new Date().toISOString()
    };

    data.pharmacies.push(pharmacy);
    writeData(data);

    const admin = data.users.find(user => user._id === pharmacy.admin);
    const pharmacyWithAdmin = {
      ...pharmacy,
      admin: admin ? { name: admin.name, email: admin.email } : null
    };

    res.status(201).json({ pharmacy: pharmacyWithAdmin });
  } catch (error) {
    console.error('Create pharmacy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update pharmacy (owner only)
router.put('/:id', authenticateToken, requireRole(['pharmacy_admin']), (req, res) => {
  try {
    const readData = req.app.get('readData');
    const writeData = req.app.get('writeData');
    const data = readData();

    const pharmacyIndex = data.pharmacies.findIndex(ph => ph._id === req.params.id && ph.admin === req.user._id);

    if (pharmacyIndex === -1) {
      return res.status(404).json({ message: 'Pharmacy not found or unauthorized' });
    }

    const { name, address, phone, hours } = req.body;

    const pharmacy = data.pharmacies[pharmacyIndex];
    pharmacy.name = name || pharmacy.name;
    pharmacy.address = address || pharmacy.address;
    pharmacy.phone = phone || pharmacy.phone;
    pharmacy.hours = hours || pharmacy.hours;

    writeData(data);

    const admin = data.users.find(user => user._id === pharmacy.admin);
    const pharmacyWithAdmin = {
      ...pharmacy,
      admin: admin ? { name: admin.name, email: admin.email } : null
    };

    res.json({ pharmacy: pharmacyWithAdmin });
  } catch (error) {
    console.error('Update pharmacy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pharmacy inventory
router.get('/:id/inventory', authenticateToken, (req, res) => {
  try {
    const readData = req.app.get('readData');
    const data = readData();

    const pharmacy = data.pharmacies.find(ph => ph._id === req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    // Check if user is the pharmacy admin
    if (req.user.role !== 'pharmacy_admin' || pharmacy.admin !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const inventory = data.inventory
      .filter(inv => inv.pharmacy === req.params.id)
      .map(inv => {
        const medicine = data.medicines.find(med => med._id === inv.medicine);
        return {
          ...inv,
          medicine: medicine ? {
            name: medicine.name,
            category: medicine.category,
            dosage: medicine.dosage,
            manufacturer: medicine.manufacturer
          } : null
        };
      })
      .sort((a, b) => a.medicine?.name.localeCompare(b.medicine?.name));

    res.json({ inventory });
  } catch (error) {
    console.error('Get pharmacy inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;