const express = require('express') 
const connectDB = require('./config/db');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');
const snakeRoute = require('./routes/snakeRoute');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieparser());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

// Basic route
app.get('/', (req, res) => {
  res.send('Snakebite Assist API Server Running!')
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/snakes', snakeRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something broke!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected Successfully!');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();