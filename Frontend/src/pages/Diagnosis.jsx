import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartPulse, Loader2, AlertCircle, ArrowRight, Activity, Thermometer, ShieldAlert } from 'lucide-react';

const Diagnosis = () => {
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) {
            setError('Please enter your symptoms to proceed.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Pointing to local backend, change in production
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/diagnosis`, { symptoms });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Apologies, our AI engine encountered an error analyzing your symptoms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header content */}
                <div className="text-center">
                    <HeartPulse className="mx-auto h-12 w-12 text-primary-500" />
                    <h1 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl text-balance">
                        AI Symptom Analysis
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">
                        Tell us how you are feeling in your own words, and our Gemini AI engine will provide probabilistic conditions and guide you to the right specialty.
                    </p>
                </div>

                {/* Input Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleAnalyze} className="space-y-6">
                            <div>
                                <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700">
                                    Describe your symptoms
                                </label>
                                <div className="mt-2 text-sm text-slate-500 mb-2">
                                    E.g., "I have had a severe headache behind my right eye for two days, along with some nausea and sensitivity to light."
                                </div>
                                <textarea
                                    id="symptoms"
                                    name="symptoms"
                                    rows={4}
                                    className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 border border-slate-300 rounded-xl p-4 text-slate-900 resize-none"
                                    placeholder="I am experiencing..."
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white ${loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                            Analyzing using Google Gemini API...
                                        </>
                                    ) : (
                                        'Analyze Symptoms'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">Analysis Results</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Recommendation Card */}
                            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                                        <Activity className="text-blue-500" size={20} /> Recommended Specialty
                                    </h3>
                                    <p className="mt-3 text-3xl font-bold text-blue-600 bg-blue-50 inline-block px-4 py-2 rounded-lg">
                                        {result.recommended_specialty}
                                    </p>
                                    <p className="mt-4 text-slate-600 leading-relaxed">
                                        Based on your reported symptoms, we highly recommend consulting a <span className="font-semibold text-slate-800">{result.recommended_specialty}</span> for professional medical advice.
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => navigate(`/hospitals/${encodeURIComponent(result.recommended_specialty)}`)}
                                        className="group flex items-center justify-between w-full bg-slate-50 hover:bg-slate-100 px-6 py-4 rounded-xl border border-slate-200 transition-colors"
                                    >
                                        <span className="font-medium text-slate-800">Find {result.recommended_specialty}s nearby</span>
                                        <ArrowRight className="text-slate-400 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-all" />
                                    </button>
                                </div>
                            </div>

                            {/* Urgency and Advice sidebar */}
                            <div className="space-y-6">
                                <div className={`rounded-2xl border p-6 ${getUrgencyColor(result.urgency_level)}`}>
                                    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                                        <ShieldAlert size={16} /> Urgency Level
                                    </h3>
                                    <p className="text-2xl font-black capitalize">{result.urgency_level || 'Unknown'}</p>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">General Advice</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{result.advice}</p>
                                </div>
                            </div>
                        </div>

                        {/* Potential Conditions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                                <Thermometer className="text-orange-500" size={20} />
                                <h3 className="text-lg leading-6 font-medium text-slate-900">Probable Conditions</h3>
                            </div>
                            <ul className="divide-y divide-slate-200">
                                {result.conditions?.map((condition, index) => (
                                    <li key={index} className="px-6 py-5 hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-slate-900 mb-1">{condition.name}</span>
                                            <span className="text-sm text-slate-500">{condition.explanation}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-xs text-center text-slate-400 mt-8 mb-4 max-w-2xl mx-auto">
                            Disclaimer: This application uses AI to suggest potential conditions based on user input. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Diagnosis;
