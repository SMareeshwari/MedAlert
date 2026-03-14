import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Store alerts in memory for demo (in production, use database)
const alerts = new Map();

// Set alert for medicine (no auth required for demo)
router.post('/', (req, res) => {
  try {
    const { medicineId } = req.body;

    if (!medicineId) {
      return res.status(400).json({ message: 'Medicine ID is required' });
    }

    // Use a simple identifier (in production, use user ID)
    const userIdentifier = req.ip || 'anonymous';

    // Check if user already has an alert for this medicine
    const userAlerts = alerts.get(userIdentifier) || [];
    const existingAlert = userAlerts.find(alert => alert.medicineId === medicineId);

    if (existingAlert) {
      return res.status(400).json({ message: 'You already have an active alert for this medicine' });
    }

    // Create new alert
    const alert = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      medicineId,
      userIdentifier,
      createdAt: new Date().toISOString(),
      active: true
    };

    userAlerts.push(alert);
    alerts.set(userIdentifier, userAlerts);

    console.log(`📢 Alert set for ${userIdentifier} on medicine ${medicineId}`);

    res.status(201).json({
      message: 'Alert set successfully! You will be notified when the medicine is back in stock.',
      alert
    });
  } catch (error) {
    console.error('Set alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's alerts (no auth required for demo)
router.get('/', (req, res) => {
  try {
    const userIdentifier = req.ip || 'anonymous';
    const userAlerts = alerts.get(userIdentifier) || [];

    res.json({ alerts: userAlerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete alert (no auth required for demo)
router.delete('/:alertId', (req, res) => {
  try {
    const { alertId } = req.params;
    const userIdentifier = req.ip || 'anonymous';

    const userAlerts = alerts.get(userIdentifier) || [];
    const alertIndex = userAlerts.findIndex(alert => alert.id === alertId);

    if (alertIndex === -1) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    userAlerts.splice(alertIndex, 1);
    alerts.set(userIdentifier, userAlerts);

    res.json({ message: 'Alert removed successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;