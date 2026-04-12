# Vehicle Rental Management System

A full-stack web application designed to smoothly handle vehicle rentals, incorporating user authentication, a backend API, and a modern frontend interface.

## 🚀 Live Demo
**[Live Working Web Application](https://dbms-team-10-vehicle-rental-management-system-2vmgcxowc.vercel.app)**

---

## 🛠️ Technology Stack

**Frontend**
- React.js (Bootstrapped with Vite)
- HTML5 & Modern CSS

**Backend**
- Node.js & Express.js
- MySQL (via `mysql2`)
- Authentication: JSON Web Tokens (JWT) & bcryptjs
- Middleware: CORS, Multer (for file/image uploads), dotenv

---
##⚙️ Features
- User registration and login
- Vehicle listing with details (name, type, price per day, availability, image)
- Booking system with start and end dates
- Admin functionality to manage vehicles and bookings
- Responsive design for desktop 

## 📦 Setting Up Locally

If you'd like to run the project locally, follow these steps:

### 1. Database Configuration
You will need a running MySQL server. 
- Create a database for the application.
- Look into the `server/database.sql` for the schema or run the initialization scripts if you are setting up for the first time.

### 2. Backend Server
- Navigate into the `server` directory:
  ```bash
  cd server
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Make sure you correctly configure your `.env` file with your MySQL credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) as well as a `JWT_SECRET`.
- Start the backend server:
  ```bash
  npm start
  ```

### 3. Frontend Client
- Open a new terminal and navigate to the `client` directory:
  ```bash
  cd client
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the Vite development server:
  ```bash
  npm run dev
  ```
- It will usually be available at `http://localhost:5173`.
