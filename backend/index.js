const express = require('express') 
const connectDB = require('./config/db');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(cookieparser());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.get('/', (req, res) => {
    res.send('server start!')
  })
  
// Routes
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);



// Connect to the MongoDB database
connectDB();

//Server
try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
      console.error("Failed to start the server:", error);
}