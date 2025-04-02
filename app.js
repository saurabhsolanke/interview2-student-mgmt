const express = require('express');
const path = require('path');
require('dotenv').config();

const { connectMongoDB, connectMySQL } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const electiveRoutes = require('./routes/electiveRoutes');
const authMiddleware = require('./middleware/auth');
const authController = require('./controllers/authController');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connections
// connectMongoDB();
connectMySQL();

// routes for auth
app.use('/', authRoutes);

// Protected routes
app.use('/students', studentRoutes);
app.use('/electives', electiveRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;