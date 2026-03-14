import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFile = path.join(__dirname, 'data.json');

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding with real Tamil Nadu data...');

    // Initialize data structure
    let data = { users: [], pharmacies: [], medicines: [], inventory: [] };

    // Check if data file exists and load it
    if (fs.existsSync(dataFile)) {
      data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      console.log('Loaded existing data');
    }

    // Clear existing data
    data.users = [];
    data.pharmacies = [];
    data.medicines = [];
    data.inventory = [];
    console.log('Cleared existing data');

    // Create pharmacy admin users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const pharmacyAdmins = [
      {
        _id: generateId(),
        name: 'Apollo Pharmacy Admin',
        email: 'admin@apollo.com',
        password: hashedPassword,
        role: 'pharmacy_admin',
        phone: '+91-44-2815-1234',
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'MedPlus Admin',
        email: 'admin@medplus.com',
        password: hashedPassword,
        role: 'pharmacy_admin',
        phone: '+91-422-223-7788',
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Wellness Forever Admin',
        email: 'admin@wellness.com',
        password: hashedPassword,
        role: 'pharmacy_admin',
        phone: '+91-431-243-1234',
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'CVS Pharmacy Admin',
        email: 'admin@cvs.com',
        password: hashedPassword,
        role: 'pharmacy_admin',
        phone: '+91-80-2345-6789',
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Aruna Pharmacy Admin',
        email: 'admin@aruna.com',
        password: hashedPassword,
        role: 'pharmacy_admin',
        phone: '+91-44-4100-2000',
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Care Pharmacy Admin',
        email: 'admin@care.com',
        password: hashedPassword,
        role: 'pharmacy_admin',
        phone: '+91-422-435-6789',
        createdAt: new Date().toISOString()
      }
    ];

    data.users.push(...pharmacyAdmins);
    console.log('Created pharmacy admins');

    // Real Tamil Nadu pharmacy locations
    const pharmacies = [
      // Chennai locations
      {
        _id: generateId(),
        name: 'Apollo Pharmacy - T Nagar',
        address: {
          street: '176, North Usman Road, T Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600017',
          coordinates: { lat: 13.0348, lng: 80.2410 }
        },
        phone: '+91-44-2815-1234',
        email: 'tnagar@apollopharmacy.com',
        rating: 4.7,
        reviews: 245,
        hours: { open: '08:30', close: '22:30' },
        admin: pharmacyAdmins[0]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Apollo Pharmacy - Anna Nagar',
        address: {
          street: '3rd Main Road, Anna Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600040',
          coordinates: { lat: 13.0886, lng: 80.2086 }
        },
        phone: '+91-44-2618-6200',
        email: 'annanagar@apollopharmacy.com',
        rating: 4.6,
        reviews: 312,
        hours: { open: '08:00', close: '23:00' },
        admin: pharmacyAdmins[0]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Aruna Pharmacy - Mylapore',
        address: {
          street: 'R K Mutt Road, Mylapore',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600004',
          coordinates: { lat: 13.0288, lng: 80.2678 }
        },
        phone: '+91-44-2499-1234',
        email: 'mylapore@arunapharmacy.com',
        rating: 4.5,
        reviews: 198,
        hours: { open: '09:00', close: '21:30' },
        admin: pharmacyAdmins[4]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'CVS Pharmacy - Velachery',
        address: {
          street: 'GST Road, Velachery',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600042',
          coordinates: { lat: 13.0053, lng: 80.2065 }
        },
        phone: '+91-44-2698-3456',
        email: 'velachery@cvspharmacy.com',
        rating: 4.4,
        reviews: 267,
        hours: { open: '08:00', close: '22:00' },
        admin: pharmacyAdmins[3]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'MedPlus - Kandanchavadi',
        address: {
          street: 'Luz Church Road, Kandanchavadi',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600096',
          coordinates: { lat: 13.0081, lng: 80.2647 }
        },
        phone: '+91-44-4205-7890',
        email: 'kandanchavadi@medplus.com',
        rating: 4.3,
        reviews: 156,
        hours: { open: '08:30', close: '21:30' },
        admin: pharmacyAdmins[1]._id,
        createdAt: new Date().toISOString()
      },
      
      // Coimbatore locations
      {
        _id: generateId(),
        name: 'MedPlus - Gandhipuram',
        address: {
          street: 'Cross Cut Road, Gandhipuram',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          zipCode: '641012',
          coordinates: { lat: 11.0004, lng: 76.9640 }
        },
        phone: '+91-422-223-7788',
        email: 'gandhipuram@medplus.com',
        rating: 4.5,
        reviews: 289,
        hours: { open: '09:00', close: '21:00' },
        admin: pharmacyAdmins[1]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Care Pharmacy - Peelamedu',
        address: {
          street: 'Race Course Road, Peelamedu',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          zipCode: '641004',
          coordinates: { lat: 11.0242, lng: 76.9455 }
        },
        phone: '+91-422-435-6789',
        email: 'peelamedu@carepharmacy.com',
        rating: 4.6,
        reviews: 234,
        hours: { open: '08:30', close: '22:00' },
        admin: pharmacyAdmins[5]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Apollo Pharmacy - Kasturiranganagar',
        address: {
          street: 'Kasturiranganagar Road',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          zipCode: '641031',
          coordinates: { lat: 10.9961, lng: 76.9469 }
        },
        phone: '+91-422-285-1234',
        email: 'kasturi@apollopharmacy.com',
        rating: 4.4,
        reviews: 201,
        hours: { open: '08:00', close: '21:30' },
        admin: pharmacyAdmins[0]._id,
        createdAt: new Date().toISOString()
      },

      // Madurai locations
      {
        _id: generateId(),
        name: 'Aruna Pharmacy - K K Nagar',
        address: {
          street: 'K K Nagar Main Road, Madurai',
          city: 'Madurai',
          state: 'Tamil Nadu',
          zipCode: '625018',
          coordinates: { lat: 9.9690, lng: 78.1380 }
        },
        phone: '+91-452-292-1234',
        email: 'kknagar@arunapharmacy.com',
        rating: 4.5,
        reviews: 167,
        hours: { open: '08:30', close: '21:00' },
        admin: pharmacyAdmins[4]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'CVS Pharmacy - Aravind',
        address: {
          street: 'Aravind Eye Hospital Road',
          city: 'Madurai',
          state: 'Tamil Nadu',
          zipCode: '625020',
          coordinates: { lat: 9.9220, lng: 78.1165 }
        },
        phone: '+91-452-435-0123',
        email: 'aravind@cvspharmacy.com',
        rating: 4.3,
        reviews: 145,
        hours: { open: '09:00', close: '21:00' },
        admin: pharmacyAdmins[3]._id,
        createdAt: new Date().toISOString()
      },

      // Salem locations
      {
        _id: generateId(),
        name: 'MedPlus - Fairlands',
        address: {
          street: 'Fairlands Main Road, Salem',
          city: 'Salem',
          state: 'Tamil Nadu',
          zipCode: '636004',
          coordinates: { lat: 11.6643, lng: 78.1460 }
        },
        phone: '+91-427-234-5678',
        email: 'fairlands@medplus.com',
        rating: 4.4,
        reviews: 178,
        hours: { open: '08:30', close: '21:30' },
        admin: pharmacyAdmins[1]._id,
        createdAt: new Date().toISOString()
      },
      {
        _id: generateId(),
        name: 'Care Pharmacy - Taramani',
        address: {
          street: 'Taramani Main Street',
          city: 'Salem',
          state: 'Tamil Nadu',
          zipCode: '636002',
          coordinates: { lat: 11.6627, lng: 78.1478 }
        },
        phone: '+91-427-567-8901',
        email: 'taramani@carepharmacy.com',
        rating: 4.2,
        reviews: 112,
        hours: { open: '09:00', close: '20:30' },
        admin: pharmacyAdmins[5]._id,
        createdAt: new Date().toISOString()
      },

      // Trichy locations
      {
        _id: generateId(),
        name: 'Apollo Pharmacy - Cantonment',
        address: {
          street: 'Cantonment Road, Tiruchirappalli',
          city: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          zipCode: '620001',
          coordinates: { lat: 10.7905, lng: 78.7047 }
        },
        phone: '+91-431-243-1234',
        email: 'cantonment@apollopharmacy.com',
        rating: 4.6,
        reviews: 223,
        hours: { open: '08:00', close: '22:00' },
        admin: pharmacyAdmins[0]._id,
        createdAt: new Date().toISOString()
      },

      // Tiruppur locations
      {
        _id: generateId(),
        name: 'CVS Pharmacy - Tiruppur',
        address: {
          street: 'Kumaran Road, Tiruppur',
          city: 'Tiruppur',
          state: 'Tamil Nadu',
          zipCode: '641601',
          coordinates: { lat: 11.1085, lng: 77.3411 }
        },
        phone: '+91-421-234-5678',
        email: 'tiruppur@cvspharmacy.com',
        rating: 4.3,
        reviews: 134,
        hours: { open: '08:30', close: '21:00' },
        admin: pharmacyAdmins[3]._id,
        createdAt: new Date().toISOString()
      }
    ];

    data.pharmacies.push(...pharmacies);
    console.log(`Created ${pharmacies.length} pharmacies across Tamil Nadu`);

    // Real common medicines in India
    const medicines = [
      // Pain Relief & Anti-inflammatory
      { _id: generateId(), name: 'Aspirin 325mg', category: 'Pain Relief', description: 'Pain reliever and blood thinner', dosage: '325mg tablets', manufacturer: 'Bayer' },
      { _id: generateId(), name: 'Ibuprofen 400mg', category: 'Pain Relief', description: 'Anti-inflammatory pain reliever', dosage: '400mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Paracetamol 500mg', category: 'Pain Relief', description: 'Pain relief and fever reducer', dosage: '500mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Diclofenac 50mg', category: 'Pain Relief', description: 'NSAID for pain and inflammation', dosage: '50mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Naproxen 250mg', category: 'Pain Relief', description: 'Long-acting pain reliever', dosage: '250mg tablets', manufacturer: 'Generic' },

      // Antibiotics
      { _id: generateId(), name: 'Amoxicillin 500mg', category: 'Antibiotics', description: 'Broad-spectrum antibiotic', dosage: '500mg capsules', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Ciprofloxacin 500mg', category: 'Antibiotics', description: 'Fluoroquinolone antibiotic', dosage: '500mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Azithromycin 500mg', category: 'Antibiotics', description: 'Macrolide antibiotic', dosage: '500mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Trimethoprim-Sulfamethoxazole 400mg', category: 'Antibiotics', description: 'Combination antibiotic', dosage: '400mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Cefixime 200mg', category: 'Antibiotics', description: 'Cephalosporin antibiotic', dosage: '200mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Levofloxacin 500mg', category: 'Antibiotics', description: 'Fluoroquinolone for infections', dosage: '500mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Doxycycline 100mg', category: 'Antibiotics', description: 'Tetracycline antibiotic', dosage: '100mg capsules', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Erythromycin 500mg', category: 'Antibiotics', description: 'Macrolide antibiotic', dosage: '500mg tablets', manufacturer: 'Generic' },

      // Digestive Health
      { _id: generateId(), name: 'Omeprazole 20mg', category: 'Digestive Health', description: 'Proton pump inhibitor for acid reflux', dosage: '20mg capsules', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Ranitidine 150mg', category: 'Digestive Health', description: 'Reduces stomach acid', dosage: '150mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Domperidone 10mg', category: 'Digestive Health', description: 'Antiemetic and gastroprokinetic', dosage: '10mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Metronidazole 400mg', category: 'Digestive Health', description: 'For diarrhea and infections', dosage: '400mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Pantoprazole 40mg', category: 'Digestive Health', description: 'Proton pump inhibitor', dosage: '40mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Lansoprazole 30mg', category: 'Digestive Health', description: 'Acid reflux treatment', dosage: '30mg capsules', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Ondansetron 4mg', category: 'Digestive Health', description: 'Anti-nausea medication', dosage: '4mg tablets', manufacturer: 'Generic' },

      // Cough & Cold
      { _id: generateId(), name: 'Cough Syrup DM', category: 'Cough & Cold', description: 'Dextromethorphan cough suppressant', dosage: '10mg/5ml syrup', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Salbutamol Inhaler', category: 'Cough & Cold', description: 'Bronchodilator for asthma', dosage: '100mcg inhaler', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Ambroxol 75mg', category: 'Cough & Cold', description: 'Mucolytic expectorant', dosage: '75mg/5ml syrup', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Chlorpheniramine 4mg', category: 'Cough & Cold', description: 'Antihistamine for cold', dosage: '4mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Montelukast 10mg', category: 'Cough & Cold', description: 'Leukotriene inhibitor', dosage: '10mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Promethazine 25mg', category: 'Cough & Cold', description: 'Allergy and cough relief', dosage: '25mg tablets', manufacturer: 'Generic' },

      // Allergy & Immunology
      { _id: generateId(), name: 'Cetirizine 10mg', category: 'Allergy', description: 'Non-drowsy antihistamine', dosage: '10mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Loratadine 10mg', category: 'Allergy', description: 'Long-acting antihistamine', dosage: '10mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Desloratadine 5mg', category: 'Allergy', description: 'Advanced antihistamine', dosage: '5mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Fexofenadine 120mg', category: 'Allergy', description: 'Non-sedating antihistamine', dosage: '120mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Phenylephrine 10mg', category: 'Allergy', description: 'Nasal decongestant', dosage: '10mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Diphenhydramine 25mg', category: 'Allergy', description: 'Antihistamine for allergies', dosage: '25mg capsules', manufacturer: 'Generic' },

      // Vitamins & Supplements
      { _id: generateId(), name: 'Vitamin D3 1000IU', category: 'Vitamins', description: 'Calcium absorption and immunity', dosage: '1000IU capsules', manufacturer: 'Sun Pharma' },
      { _id: generateId(), name: 'Vitamin B12 1000mcg', category: 'Vitamins', description: 'Energy and nerve function', dosage: '1000mcg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Vitamin C 500mg', category: 'Vitamins', description: 'Antioxidant and immunity booster', dosage: '500mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Calcium Carbonate 500mg', category: 'Vitamins', description: 'Bone health supplement', dosage: '500mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Iron Sulfate 325mg', category: 'Vitamins', description: 'Anemia treatment', dosage: '325mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Folic Acid 5mg', category: 'Vitamins', description: 'Vitamin B for pregnancy', dosage: '5mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Zinc Gluconate 50mg', category: 'Vitamins', description: 'Immunity booster', dosage: '50mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Magnesium 400mg', category: 'Vitamins', description: 'Muscle and nerve health', dosage: '400mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Biotin 5mg', category: 'Vitamins', description: 'Hair and skin health', dosage: '5mg tablets', manufacturer: 'Generic' },

      // Blood Pressure & Cardiac
      { _id: generateId(), name: 'Atenolol 50mg', category: 'Cardiac', description: 'Beta-blocker for hypertension', dosage: '50mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Ramipril 5mg', category: 'Cardiac', description: 'ACE inhibitor for heart health', dosage: '5mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Amlodipine 5mg', category: 'Cardiac', description: 'Calcium channel blocker', dosage: '5mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Atorvastatin 20mg', category: 'Cardiac', description: 'Cholesterol reducer', dosage: '20mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Lisinopril 10mg', category: 'Cardiac', description: 'ACE inhibitor for blood pressure', dosage: '10mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Metoprolol 50mg', category: 'Cardiac', description: 'Beta-blocker for heart', dosage: '50mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Aspirin 75mg', category: 'Cardiac', description: 'Blood thinner for heart health', dosage: '75mg tablets', manufacturer: 'Generic' },

      // Diabetes
      { _id: generateId(), name: 'Metformin 500mg', category: 'Diabetes', description: 'First-line diabetes medication', dosage: '500mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Glibenclamide 5mg', category: 'Diabetes', description: 'Sulfonylurea for diabetes', dosage: '5mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Insulin Glargine', category: 'Diabetes', description: 'Long-acting insulin', dosage: '100IU/ml injection', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Pioglitazone 15mg', category: 'Diabetes', description: 'Insulin sensitizer', dosage: '15mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Sitagliptin 100mg', category: 'Diabetes', description: 'DPP-4 inhibitor', dosage: '100mg tablets', manufacturer: 'Generic' },

      // Sleep & Anxiety
      { _id: generateId(), name: 'Alprazolam 1mg', category: 'Mental Health', description: 'Benzodiazepine for anxiety', dosage: '1mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Zolpidem 10mg', category: 'Mental Health', description: 'Sleep aid', dosage: '10mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Sertraline 50mg', category: 'Mental Health', description: 'SSRI antidepressant', dosage: '50mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Paroxetine 20mg', category: 'Mental Health', description: 'SSRI for depression', dosage: '20mg tablets', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Fluoxetine 20mg', category: 'Mental Health', description: 'SSRI antidepressant', dosage: '20mg capsules', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Lorazepam 1mg', category: 'Mental Health', description: 'Anxiety and sleep aid', dosage: '1mg tablets', manufacturer: 'Generic' },

      // Skincare & Ointments
      { _id: generateId(), name: 'Mupirocin Ointment 2%', category: 'Topical', description: 'Antibiotic skin ointment', dosage: '2% ointment', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Hydrocortisone Cream 1%', category: 'Topical', description: 'Steroid cream for inflammation', dosage: '1% cream', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Clotrimazole Cream 1%', category: 'Topical', description: 'Antifungal cream', dosage: '1% cream', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Ketoconazole Cream 2%', category: 'Topical', description: 'Antifungal for skin infections', dosage: '2% cream', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Salicylic Acid 2%', category: 'Topical', description: 'Acne treatment', dosage: '2% lotion', manufacturer: 'Generic' },
      { _id: generateId(), name: 'Benzoyl Peroxide 5%', category: 'Topical', description: 'Acne treatment', dosage: '5% gel', manufacturer: 'Generic' },

      // Additional Common Medicines
      { _id: generateId(), name: 'Rauwolfia Serpentina 2mg', category: 'Cardiac', description: 'Traditional blood pressure control', dosage: '2mg tablets', manufacturer: 'Himalaya' },
      { _id: generateId(), name: 'Ginger Extract 500mg', category: 'Digestive Health', description: 'Nausea and digestion relief', dosage: '500mg capsules', manufacturer: 'Nature' },
      { _id: generateId(), name: 'Tulsi Extract 300mg', category: 'Immunity', description: 'Immune booster', dosage: '300mg capsules', manufacturer: 'Himalaya' },
      { _id: generateId(), name: 'Triphala 500mg', category: 'Digestive Health', description: 'Ayurvedic digestive tonic', dosage: '500mg tablets', manufacturer: 'Generic' }
    ];

    data.medicines.push(...medicines);
    console.log(`Created ${medicines.length} realistic medicines`);

    // Create inventory with realistic stock levels
    const inventoryData = [];
    pharmacies.forEach(pharmacy => {
      medicines.forEach(medicine => {
        // Realistic inventory patterns
        const baseQuantity = Math.floor(Math.random() * 150) + 20; // 20-170 units
        const randomFactor = Math.random();
        let quantity = baseQuantity;
        
        // Some medicines more common in stocks
        if (['Pain Relief', 'Vitamins', 'Cough & Cold'].includes(medicine.category)) {
          quantity = Math.floor(baseQuantity * 1.5);
        }
        
        // Occasional out of stock
        if (randomFactor > 0.9) quantity = 0;
        
        const basePrice = {
          'Pain Relief': 50, 'Antibiotics': 120, 'Digestive Health': 100,
          'Cough & Cold': 80, 'Allergy': 110, 'Vitamins': 200,
          'Cardiac': 150, 'Diabetes': 200, 'Mental Health': 300,
          'Topical': 200
        }[medicine.category] || 150;
        
        const priceVariation = Math.random() * 30 - 15;
        const price = Math.max(Math.floor(basePrice + priceVariation), 10);

        inventoryData.push({
          _id: generateId(),
          medicine: medicine._id,
          pharmacy: pharmacy._id,
          price: price,
          quantity: quantity,
          lastUpdated: new Date(Date.now() - Math.random() * 86400000).toISOString() // Last 24 hours
        });
      });
    });

    data.inventory.push(...inventoryData);
    console.log(`Created ${inventoryData.length} inventory records`);

    // Write data to file
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    console.log('\n✅ Database seeded successfully!');
    console.log(`💾 Data saved to: ${dataFile}`);

    console.log('\n📊 Summary:');
    console.log(`- ${pharmacyAdmins.length} pharmacy admins`);
    console.log(`- ${pharmacies.length} pharmacies across 7 Tamil Nadu cities`);
    console.log(`- ${medicines.length} medicines covering 11 categories`);
    console.log(`- ${inventoryData.length} inventory records`);

    console.log('\n🔐 Pharmacy Admin Credentials:');
    pharmacyAdmins.forEach(admin => {
      console.log(`  Email: ${admin.email} | Password: password123`);
    });

    console.log('\n🏥 Pharmacies Added:');
    const cities = [...new Set(pharmacies.map(p => p.address.city))];
    cities.forEach(city => {
      const cityPharmacies = pharmacies.filter(p => p.address.city === city).length;
      console.log(`  ${city}: ${cityPharmacies} pharmacies`);
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

seedDatabase();