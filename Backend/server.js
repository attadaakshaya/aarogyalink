const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Add mongoose

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Import Routes
const diagnosisRoutes = require('./routes/diagnosis');
const hospitalRoutes = require('./routes/hospitals');
const adminRoutes = require('./routes/admin'); // Added

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aarogyalink')
  .then(() => console.log('✅ Connected to MongoDB Desktop/Local successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// Use Routes
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes); // Added

// Root route
app.get('/', (req, res) => {
  res.send('AarogyaLink Backend is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
