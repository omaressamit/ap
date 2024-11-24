
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');

const peopleRoutes = require('./routes/people');
const transactionRoutes = require('./routes/transactions');
const settingsRoutes = require('./routes/settings');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'spontaneous-rugelach-1f7dea.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/people', peopleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settings', settingsRoutes);

// Serve login.html as the entry point
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    // In a real application, you'd check a session or token here
    // For this example, we'll just check if the isLoggedIn query parameter is set
    if (req.query.isLoggedIn === 'true') {
        next();
    } else {
        res.redirect('/');
    }
};

// Protect all other routes
app.get('*', isLoggedIn, (req, res) => {
    if (req.path === '/index.html') {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, '..', req.path));
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
