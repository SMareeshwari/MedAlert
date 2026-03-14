# Real-Time Medicine Finder - Tamil Nadu Edition

A modern, real-time medicine availability finder across pharmacies in Tamil Nadu, India.

## 🎯 Features

### Core Features
- **Real-Time Search**: Instantly search for medicines across multiple pharmacies
- **Multi-City Coverage**: Service available across 7 major Tamil Nadu cities
- **Price Comparison**: Compare prices for the same medicine across different pharmacies
- **Availability Tracking**: See real-time stock levels at each pharmacy
- **Stock Alerts**: Get notified when medicines come back in stock
- **Location-Based Search**: Filter results by city/location

### Advanced Features
- **Socket.io Integration**: Real-time inventory updates
- **User Authentication**: Secure login and registration
- **Pharmacy Dashboard**: Admin panel for pharmacy staff to manage inventory
- **Rating System**: Pharmacy ratings and customer reviews
- **Multiple Categories**: Browse medicines by categories (Pain Relief, Antibiotics, Vitamins, etc.)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏥 Coverage Area

### Pharmacies Across Tamil Nadu

**Chennai (5 Pharmacies)**
- Apollo Pharmacy - T Nagar
- Apollo Pharmacy - Anna Nagar
- Aruna Pharmacy - Mylapore
- CVS Pharmacy - Velachery
- MedPlus - Kandanchavadi

**Coimbatore (3 Pharmacies)**
- MedPlus - Gandhipuram
- Care Pharmacy - Peelamedu
- Apollo Pharmacy - Kasturiranganagar

**Madurai (2 Pharmacies)**
- Aruna Pharmacy - K K Nagar
- CVS Pharmacy - Aravind

**Salem (2 Pharmacies)**
- MedPlus - Fairlands
- Care Pharmacy - Taramani

**Tiruchirappalli (1 Pharmacy)**
- Apollo Pharmacy - Cantonment

**Tiruppur (1 Pharmacy)**
- CVS Pharmacy - Tiruppur

## 💊 Medicine Database

The app includes 38+ realistic medicines across 11 categories:

- **Pain Relief**: Aspirin, Ibuprofen, Paracetamol, Diclofenac, Naproxen
- **Antibiotics**: Amoxicillin, Ciprofloxacin, Azithromycin
- **Digestive Health**: Omeprazole, Ranitidine, Domperidone, Metronidazole
- **Cough & Cold**: Cough Syrup, Salbutamol Inhaler, Ambroxol
- **Allergy**: Cetirizine, Loratadine, Desloratadine, Fexofenadine
- **Vitamins**: Vitamin D3, B12, C, Calcium, Iron
- **Cardiac**: Atenolol, Ramipril, Amlodipine, Atorvastatin
- **Diabetes**: Metformin, Glibenclamide, Insulin
- **Mental Health**: Alprazolam, Zolpidem, Sertraline
- **Topical**: Mupirocin Ointment, Hydrocortisone Cream, Clotrimazole

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd c:\Users\Admin\Documents\project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database with Tamil Nadu data**
   ```bash
   npm run seed
   ```

4. **Start the backend server** (in one terminal)
   ```bash
   npm run dev:server
   ```

   The server will run on `http://localhost:5000`

5. **Start the frontend** (in another terminal)
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or next available port)

## 📊 Default Credentials

### Pharmacy Admin Accounts (for testing)
All accounts use password: `password123`

| Email | Role |
|-------|------|
| admin@apollo.com | Apollo Pharmacy Admin |
| admin@medplus.com | MedPlus Admin |
| admin@wellness.com | Wellness Forever Admin |
| admin@cvs.com | CVS Pharmacy Admin |
| admin@aruna.com | Aruna Pharmacy Admin |
| admin@care.com | Care Pharmacy Admin |

## 🔍 How to Use

### For Users
1. **Search for Medicines**
   - Enter medicine name in the search bar
   - Select location (city)
   - Apply filters if needed (category, price)
   - View results with prices and availability

2. **Set Stock Alerts**
   - Click "Alert" button on medicine cards
   - Get notified when medicine is back in stock

3. **Compare Prices**
   - See prices from different pharmacies
   - Check stock levels in real-time
   - Find the best deals in your location

### For Pharmacy Admins
1. **Login** with admin credentials
2. **Dashboard** - View pharmacy details and performance
3. **Manage Inventory** - Update medicine prices and quantities
4. **Real-time Sync** - Changes update in real-time for all users

## 🛠️ Technology Stack

### Frontend
- **React** 18.3.1
- **TypeScript** 5.5.3
- **Vite** 7.1.6 (build tool)
- **Tailwind CSS** 3.4.1 (styling)
- **Axios** 1.11.0 (HTTP client)
- **React Router** 7.8.2 (routing)
- **Socket.io Client** 4.8.1 (real-time updates)
- **Lucide React** (icons)

### Backend
- **Express.js** 5.1.0
- **Node.js**
- **Socket.io** 4.8.1 (real-time communication)
- **JWT** (authentication)
- **bcryptjs** (password hashing)
- **CORS** (cross-origin requests)

### Data Storage
- **JSON file-based** (data.json) - Perfect for testing and development

## 📁 Project Structure

```
project/
├── src/                      # Frontend React application
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Main search page
│   │   ├── SearchResults.tsx# Search results display
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── MedicineDetails.tsx
│   │   ├── Pharmacies.tsx   # Browse pharmacies
│   │   ├── PharmacyDashboard.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── components/          # Reusable components
│   │   ├── MedicineCard.tsx # Medicine card component
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── App.tsx
│   └── main.tsx
├── server/                   # Backend Express server
│   ├── routes/              # API routes
│   │   ├── medicines.js     # Medicine search/management
│   │   ├── pharmacies.js    # Pharmacy management
│   │   ├── alerts.js        # Stock alerts
│   │   └── auth.js          # Authentication
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # JWT authentication
│   ├── server.js            # Main server file
│   ├── seed.js              # Database seeder
│   └── data.json            # Database file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Real-Time Updates

The app uses **Socket.io** for real-time inventory updates:
- When a pharmacy admin updates stock levels, all connected users see the changes instantly
- Users receive live notifications for stock availability changes
- Automatic inventory synchronization across all clients

## 🌟 Key Enhancements

### Data Realism
- ✅ 14 actual Tamil Nadu pharmacy locations with realistic addresses
- ✅ 38+ real Indian medicines with proper categories
- ✅ Realistic pricing based on Indian pharmacy standards
- ✅ Stock levels that simulate real-world scenarios
- ✅ Pharmacy ratings and review counts

### UI/UX Improvements
- ✅ Modern gradient design with Tailwind CSS
- ✅ Location auto-suggestions for Tamil Nadu cities
- ✅ Popular medicine suggestions on home page
- ✅ Enhanced medicine cards with icons and visual hierarchy
- ✅ Real-time inventory indicators
- ✅ Responsive design for all devices

### Functionality
- ✅ Price comparison across pharmacies
- ✅ Stock alerts system
- ✅ Category-based filtering
- ✅ Real-time Socket.io updates
- ✅ Admin dashboard for pharmacy management
- ✅ User authentication and dashboard

## 🧪 Testing the App

### Search for Medicine
1. Click on "Search Medicines" or use search bar
2. Enter a medicine name (e.g., "Paracetamol")
3. Select a location (e.g., "Chennai")
4. See results with prices and availability

### Try Popular Searches
Click on any popular medicine button (Paracetamol, Ibuprofen, etc.)

### Set Stock Alert
Click "Alert" button on any medicine to get notified when it's back in stock

### Login as Pharmacy Admin
Use credentials like: `admin@apollo.com` / `password123`

## 📈 Performance

- **Fast Search**: Optimized medicine search with filtering
- **Real-Time Updates**: Socket.io for instant inventory sync
- **Responsive UI**: Tailwind CSS for smooth interactions
- **Efficient Data**: JSON-based storage perfect for medium-scale apps

## 🔐 Security Features

- **JWT Authentication**: Secure user sessions
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Only authorized users can access admin features
- **CORS Enabled**: Safe cross-origin requests

## 📝 Environment Setup

The app runs with default settings:
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173` (or next available port)
- **Database**: `server/data.json`

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 5173 is in use:
- The app will automatically use the next available port
- Or kill the existing process: `taskkill /PID <PID> /F` (Windows)

### Database Issues
To reset the database:
```bash
npm run seed
```

### Frontend Not Loading
Clear browser cache and hard refresh (Ctrl+Shift+R on Windows)

## 📱 Mobile Responsive

The app is fully responsive and works great on:
- Desktop browsers
- Tablets
- Mobile phones

## 🚀 Production Deployment

For production use:
1. Build the frontend: `npm run build`
2. Use a real database (MongoDB, PostgreSQL)
3. Deploy on services like Heroku, Vercel, or AWS
4. Set up proper environment variables
5. Enable HTTPS and security headers

## 📞 Support

For issues or feature requests, please check:
- Browser console for errors
- Server logs in terminal
- `server/data.json` for data integrity

## 📄 License

This project is open source and available for educational purposes.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Made for Tamil Nadu Pharmacies**
