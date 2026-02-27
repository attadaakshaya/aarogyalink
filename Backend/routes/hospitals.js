const express = require('express');
const router = express.Router();
const { searchHospitals } = require('../controllers/hospitalController');

// POST /api/hospitals/search
// Body expects { lat, lng, radius, specialty, scheme }
// Fetches nearby hospitals with Google Places API
router.post('/search', searchHospitals);

module.exports = router;
