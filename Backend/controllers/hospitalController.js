const axios = require('axios');

exports.searchHospitals = async (req, res) => {
    try {
        const { lat, lng, specialty = 'hospital', radius = 5000, scheme } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and Longitude are required.' });
        }

        const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

        if (!API_KEY || API_KEY === 'your_google_places_api_key_here') {
            return res.status(500).json({ error: 'Google Places API Key is not configured.' });
        }

        // Prepare search query using query or keyword to find relevant hospitals
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

        const response = await axios.get(url, {
            params: {
                location: `${lat},${lng}`,
                radius: radius,
                type: 'hospital',
                keyword: specialty !== 'hospital' ? specialty : '',
                key: API_KEY,
            }
        });

        if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
            console.error("Google Places API Error:", response.data);
            return res.status(500).json({ error: 'Failed to fetch hospitals from Google API.' });
        }

        let hospitals = response.data.results.map((place) => ({
            place_id: place.place_id,
            name: place.name,
            vicinity: place.vicinity,
            rating: place.rating || 0,
            user_ratings_total: place.user_ratings_total || 0,
            geometry: place.geometry,
            open_now: place.opening_hours?.open_now || false,
            // Dummy data for scheme compatibility ranking (Could be integrated with a database later)
            accepts_govt_schemes: Math.random() > 0.4,
            accepts_insurance: Math.random() > 0.2,
        }));

        // Demo filtering logic based on the schemes
        if (scheme) {
            if (scheme === 'government') {
                hospitals = hospitals.filter(h => h.accepts_govt_schemes);
            } else if (scheme === 'insurance') {
                hospitals = hospitals.filter(h => h.accepts_insurance);
            }
        }

        // Sort by rating (Relevance ranking)
        hospitals.sort((a, b) => b.rating - a.rating);

        res.json({
            success: true,
            hospitals,
        });

    } catch (error) {
        console.error("Hospital Search Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
