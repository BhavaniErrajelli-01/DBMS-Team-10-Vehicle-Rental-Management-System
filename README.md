# Safe Ride - Vehicle Rental Management System

Safe Ride is a modern, full-stack web application designed for renting and managing vehicles. It provides a seamless interface for users to browse, book, and manage vehicle listings, while offering administrators robust tools to organize the fleet and monitor bookings.

## 🚀 Features

### User Features
- **Authentication**: Secure JWT-based Login and Sign-up system.
- **Vehicle Catalog**: Browse available vehicles (Cars, Motorcycles, SUVs, Scooty, etc.) with detailed specifications (Top Speed, License Plate Number, Price per day).
- **Booking System**: Select rental dates and instantly calculate pricing.
- **User Dashboard**: Keep track of personal bookings and manage cancellations.
- **Add a Vehicle**: Logged-in users can list their own vehicles easily, complete with photo uploads.
- **Delete your Vehicle**: Secure exact-match deletion system ensuring only authorized users can remove their specific listings.

### Admin Features
- **Admin Dashboard**: Centralized management hub.
- **Manage Fleet**: View, add, delete, and manage all vehicles on the platform.
- **Manage Bookings**: Confirm, reject, or mark bookings as completed.
- *(Admin accounts can be assigned manually via the database by setting the role to \`admin\`)*

## 🛠️ Technology Stack

**Frontend (`/client`)**
- React.js (built with Vite)
- React Router DOM (Navigation)
- Axios (API Communication)
- Lucide React (Icons)
- Pure CSS (Custom responsive UI)

**Backend (`/server`)**
- Node.js & Express.js (REST API)
- MySQL2 (Database handling)
- JSON Web Tokens (Authentication)
- Bcrypt.js (Password hashing)
- Multer (Local Image Uploads)

## ⚙️ Setup and Installation

### Prerequisites
- Node.js installed
- MySQL Server installed and running locally
- (Database configuration defaults to: `root` user and `root` password. You can change this in `server/config/db.js`)

### 1. Database Initialization
You **do not** need to manually create the database schemas! The backend script `server/config/initDb.js` handles creating the entire `vehicle_rental_db` database and all necessary tables automatically the first time you run the server.

### 2. Running the Backend Server
Navigate to the server directory, install dependencies, and start the node server.
```bash
cd server
npm install
node server.js
```
*(The server will run on `http://localhost:5000`)*

### 3. Running the Frontend Client
Open a **new separate terminal**, navigate to the client directory, install dependencies, and start the Vite development server.
```bash
cd client
npm install
npm run dev
```
*(The frontend will run on `http://localhost:5173/`)*

## 🌐 Network Sharing
This application is configured with relative API proxying across Vite. If you want to share the application link with a friend on your local Wi-Fi network:
1. Make sure your PC firewall allows Node.js network access.
2. Share the local network IP provided in the Vite Terminal (e.g. `http://192.168.x.x:5173`).
3. The API and image uploads will automatically proxy between devices perfectly!
