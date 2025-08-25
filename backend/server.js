const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/v1', adminRoutes);

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
