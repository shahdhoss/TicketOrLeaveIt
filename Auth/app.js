const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const { sequelize } = require('./config/database');
const { connect: connectRabbitMQ } = require('./messaging/messagePublisher');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/auth', authRoutes);

const PORT = 8000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    // Initialize RabbitMQ connection
    await connectRabbitMQ();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
