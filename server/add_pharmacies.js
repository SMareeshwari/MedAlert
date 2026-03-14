import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'data.json');

let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Add new pharmacies
const newPharmacies = [
  {
    "_id": "1772891848967new1",
    "name": "Pharmeasy - Anna Nagar",
    "address": {
      "street": "2nd Avenue, Anna Nagar",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "zipCode": "600040"
    },
    "phone": "+91-44-2626-1234",
    "rating": 4.5,
    "hours": {
      "open": "09:00",
      "close": "23:00"
    },
    "admin": "1772891848967newadmin1",
    "createdAt": new Date().toISOString()
  },
  {
    "_id": "1772891848967new2",
    "name": "1mg Pharmacy - Adyar",
    "address": {
      "street": "LB Road, Adyar",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "zipCode": "600020"
    },
    "phone": "+91-44-2441-5678",
    "rating": 4.7,
    "hours": {
      "open": "08:00",
      "close": "22:00"
    },
    "admin": "1772891848967newadmin2",
    "createdAt": new Date().toISOString()
  }
];

// Add corresponding admin users
const newUsers = [
  {
    "_id": "1772891848967newadmin1",
    "name": "Pharmeasy Admin",
    "email": "admin@pharmeasy.com",
    "password": "$2b$10$gctRkCpODubJUCcfaH7WCOB8LKL3.Ak9/6QkRpZ7j/jObwrUiaZQ.",
    "role": "pharmacy_admin",
    "phone": "+91-44-2626-1234",
    "createdAt": new Date().toISOString()
  },
  {
    "_id": "1772891848967newadmin2",
    "name": "1mg Admin",
    "email": "admin@1mg.com",
    "password": "$2b$10$gctRkCpODubJUCcfaH7WCOB8LKL3.Ak9/6QkRpZ7j/jObwrUiaZQ.",
    "role": "pharmacy_admin",
    "phone": "+91-44-2441-5678",
    "createdAt": new Date().toISOString()
  }
];

data.pharmacies.push(...newPharmacies);
data.users.push(...newUsers);

// Add inventory for new pharmacies (assuming some medicines are available)
const newInventory = [
  // Pharmeasy inventory
  { "_id": "inv_new1_1", "pharmacyId": "1772891848967new1", "medicineId": "1772891848967esmm3q77f", "price": 25, "stock": 50 },
  { "_id": "inv_new1_2", "pharmacyId": "1772891848967new1", "medicineId": "1772891848967fsyjw9m8y", "price": 85, "stock": 30 },
  { "_id": "inv_new1_3", "pharmacyId": "1772891848967new1", "medicineId": "17728952684601", "price": 15, "stock": 40 },

  // 1mg inventory
  { "_id": "inv_new2_1", "pharmacyId": "1772891848967new2", "medicineId": "17728918489671twecdgcx", "price": 120, "stock": 25 },
  { "_id": "inv_new2_2", "pharmacyId": "1772891848967new2", "medicineId": "1772891848967kcxdixpgq", "price": 35, "stock": 60 },
  { "_id": "inv_new2_3", "pharmacyId": "1772891848967new2", "medicineId": "17728952684612", "price": 45, "stock": 35 }
];

if (!data.inventory) data.inventory = [];
data.inventory.push(...newInventory);

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Added 2 new pharmacies with admins and inventory.');