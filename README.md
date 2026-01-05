# Assignment Portal - Backend API

This is the backend server for the Assignment Workflow Portal. It provides RESTful APIs for user authentication (Teacher/Student), assignment management, and submission workflows using Node.js, Express, and MongoDB.

## Technologies Used
- **Node.js** & **Express.js** - Server Framework
- **MongoDB** & **Mongoose** - Database
- **JWT (JSON Web Tokens)** - Authentication
- **Bcryptjs** - Password Hashing
- **Cors** - Cross-Origin Resource Sharing

## Project Structure
Ye lijiye dono projects (Frontend aur Backend) ke liye professional README.md files. Aap inhein copy karke apne respective folders mein save kar sakte hain.

1. Backend README (backend/README.md)
Is file ko backend folder ke andar banayein.

Markdown

# Assignment Portal - Backend API

This is the backend server for the Assignment Workflow Portal. It provides RESTful APIs for user authentication (Teacher/Student), assignment management, and submission workflows using Node.js, Express, and MongoDB.

##  Technologies Used
- **Node.js** & **Express.js** - Server Framework
- **MongoDB** & **Mongoose** - Database
- **JWT (JSON Web Tokens)** - Authentication
- **Bcryptjs** - Password Hashing
- **Cors** - Cross-Origin Resource Sharing

##  Project Structure
backend/ ├── config/ # Database connection ├── controllers/ # Request logic ├── middleware/ # Auth & Role checks ├── models/ # Mongoose Schemas (User, Assignment, Submission) ├── routes/ # API Routes └── server.js # Entry point

## Setup & Installation

1. **Download Zip file or import the project on desktop and Navigate to the backend directory:**
   ```bash
   cd backend

   <!-- Install Dependencies: -->
   npm install

   <!-- Environment Variables: Create a .env file in the root of the backend folder and add the following: -->

   PORT=5000
   MONGO_URI=your-mongodb-connection-string-here
   JWT_SECRET=your-secret-key

# Run the Server: npm start
  # API Endpoints  #Authentication
# POST /api/auth/register - Register a new user (Role: 'teacher' or 'student')

# POST /api/auth/login - Login user

# Assignments (Teacher Only)
# POST /api/assignments - Create a new assignment (Draft)

# PUT /api/assignments/:id/status - Update status (PUBLISHED, COMPLETED)

# GET /api/assignments - Get all assignments (Filtered for Students)

# Submissions
# POST /api/submissions - Submit an assignment (Student Only)

# GET /api/submissions/:assignmentId - View submissions (Teacher Only)

# PUT /api/submissions/:id/status - Allow Redo (Teacher Only)

# Notes
# Ensure MongoDB is running locally or provide a valid Atlas URI.

# The server runs on http://localhost:5000 by default.