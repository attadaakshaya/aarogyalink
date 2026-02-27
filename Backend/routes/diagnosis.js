const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../controllers/diagnosisController');

// POST /api/diagnosis
// Analyzes symptoms and returns probable diagnosis & recommended specialties
router.post('/', analyzeSymptoms);

module.exports = router;
