const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', paymentRoutes);

// Test database connection on startup
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established');
    // Sync models with database
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database error:', err));

module.exports = app;