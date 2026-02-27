const { GoogleGenAI } = require('@google/genai');
const DiagnosisModel = require('../models/Diagnosis'); // Import the Mongoose model

// Initialize the client. Ensure GEMINI_API_KEY is in your .env file
const ai = new GoogleGenAI({});

exports.analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms, gender, age, duration, city, scheme, insurance, reportBase64, reportMime } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: 'Symptoms are required' });
        }

        const prompt = `
      You are an expert AI medical assistant for the AarogyaLink platform. 
      A patient has reported the following symptoms: "${symptoms}".
      ${reportBase64 ? 'The patient has also attached a medical report/image. Please review it carefully alongside their symptoms to provide a more accurate analysis.' : ''}
      
      Based on this data, please provide:
      1. A list of 3 highly probable medical conditions (with a brief simple explanation for each).
      2. The primary medical specialty they should visit (e.g., Cardiologist, General Physician, Neurologist).
      3. An urgency level (Low, Medium, High) indicating if they need immediate care.
      
      Format your response strictly as a JSON object, like this:
      {
        "conditions": [
          { "name": "Condition 1", "explanation": "Brief explanation" },
          { "name": "Condition 2", "explanation": "Brief explanation" },
          { "name": "Condition 3", "explanation": "Brief explanation" }
        ],
        "recommended_specialty": "Specialty Name",
        "urgency_level": "Low/Medium/High",
        "advice": "General advice (e.g., Drink water, rest, but see a doctor if symptoms persist)"
      }
      
      Do not include any other text output, just the raw JSON object. Do not wrap in markdown code blocks.
    `;

        // Wait for the Gemini model to generate content
        let modelParams = {
            model: 'gemini-2.5-flash',
            contents: prompt
        };

        // If a file was uploaded, we format it as a multimodal request
        if (reportBase64 && reportMime) {
            const base64Data = reportBase64.split(',')[1];
            modelParams.contents = [
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: reportMime
                    }
                }
            ];
        }

        const response = await ai.models.generateContent(modelParams);

        // Parse the JSON string from the response
        let jsonResponse;
        try {
            const responseText = response.text.replace(/```json|```/g, '').trim();
            jsonResponse = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Error parsing AI response to JSON", parseError, response.text);
            return res.status(500).json({ error: 'Failed to process AI diagnosis properly' });
        }

        // --- Save the diagnosis record to MongoDB ---
        try {
            const newDiagnosis = new DiagnosisModel({
                symptoms,
                gender: gender || 'Not Specified',
                age: age || null,
                duration: duration || 'Not Specified',
                city: city || 'Not Specified',
                scheme: scheme || 'None provided',
                insurance: insurance || 'None provided',
                result: jsonResponse, // Save the raw JSON data inside Mongo
                urgency: jsonResponse.urgency_level || 'Medium',
                recommended_specialty: jsonResponse.recommended_specialty,
                status: jsonResponse.urgency_level === 'High' ? 'Critical' : 'Completed' // Auto-status
            });
            await newDiagnosis.save();
            console.log("✅ Diagnosis successfully saved to MongoDB!");
        } catch (dbError) {
            console.error("⚠️ Failed to save diagnosis to DB. Continuing anyway...", dbError.message);
        }

        // Return the JSON back to the frontend to render the popup
        res.json(jsonResponse);

    } catch (error) {
        console.error("Error generating diagnosis:", error);
        res.status(500).json({ error: 'An error occurred while analyzing symptoms.' });
    }
};
