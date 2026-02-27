const express = require('express');
const router = express.Router();
const DiagnosisModel = require('../models/Diagnosis');

// GET /api/admin/diagnoses
// Fetch all diagnosis records for the admin panel
router.get('/diagnoses', async (req, res) => {
    try {
        const diagnoses = await DiagnosisModel.find().sort({ createdAt: -1 }).limit(100);
        res.json(diagnoses);
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ error: 'Failed to fetch diagnoses' });
    }
});

// GET /api/admin/stats
// Aggregated stats for top charts
router.get('/stats', async (req, res) => {
    try {
        const totalAnalyses = await DiagnosisModel.countDocuments();
        const highUrgency = await DiagnosisModel.countDocuments({ urgency: 'High' });

        // Mock data to enrich stats where we depend on external APIs/users
        res.json({
            totals: totalAnalyses,
            highUrgency: highUrgency,
            usersPlaceholder: 12453 + totalAnalyses,
            accuracyPlaceholder: '98.2%'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate stats' });
    }
});

module.exports = router;
