const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();



const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Routes
app.use('/api/v1', adminRoutes);
app.use('/api/v1', paymentRoutes);

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
