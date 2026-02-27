const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
    symptoms: {
        type: String,
        required: true
    },
    gender: String,
    age: Number,
    duration: String,
    city: String,
    scheme: String,
    insurance: String,
    result: {
        type: Object, // Stores the JSON diagnosis from Gemini
        required: true
    },
    urgency: String,
    recommended_specialty: String,
    status: {
        type: String,
        enum: ['Completed', 'Critical', 'Referred', 'Pending'],
        default: 'Completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
