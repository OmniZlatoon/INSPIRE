const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('./database/MongoDB/config/db');
const authRoutes = require('./auth/routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inspire', authRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Inspire Backend Services are live 🚀' });
});

app.listen(PORT, () => {
    console.log(`-----------------------------------------------------`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API URL: ${process.env.NODEJS_SERVER_API_URL || `http://localhost:${PORT}`}`);
    console.log(`-----------------------------------------------------`);
});
