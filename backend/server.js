const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const authRoutes = require('./routes/auth.routes');
const carrierRoutes = require('./routes/carrier.routes');
const statsRoutes = require('./routes/stats.routes');
const courseRoutes = require('./routes/course.routes');
const booksRoutes = require('./routes/books.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const specializationRoutes = require('./routes/specialization.routes');
const categoryRoutes = require('./routes/category.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
//connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// Allow CORS for all platforms 
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
        if (/^https:\/\/[a-zA-Z0-9-]+\.ngrok(-free)?\.app$/.test(origin) ||
            /^https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.dev$/.test(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'multipart/form-data'],
}));

// Routes
app.use('/api/inspire', authRoutes);
app.use('/api/inspire/carrier', carrierRoutes);
app.use('/api/inspire/stats', statsRoutes);
app.use('/api/inspire/course', courseRoutes);
app.use('/api/inspire/books', booksRoutes);
app.use('/api/inspire/leaderboard', leaderboardRoutes);
app.use('/api/inspire/specialization', specializationRoutes);
app.use('/api/inspire/category', categoryRoutes);

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
