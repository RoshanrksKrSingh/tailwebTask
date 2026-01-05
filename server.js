const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS Configuration 
app.use(cors({
  origin: "http://localhost:3000", // The URL of your React App
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow the token header
  credentials: true
}));

// 2. Middleware
app.use(express.json());

// 3. Database Connection
connectDB();

// 4. Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// 5. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));