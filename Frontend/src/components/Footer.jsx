import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-bold text-2xl text-white tracking-tight flex items-center gap-2 mb-4">
                            Aarogya<span className="text-primary-500">Link</span>
                        </span>
                        <p className="text-sm text-slate-400 mt-2 max-w-sm">
                            Your intelligent healthcare hub. Connecting AI-based diagnosis with nearby hospitals, government schemes, and medical relevance.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Services</h3>
                        <ul className="space-y-4">
                            <li><a href="/diagnosis" className="text-base text-slate-300 hover:text-white">AI Diagnosis</a></li>
                            <li><a href="/hospitals" className="text-base text-slate-300 hover:text-white">Find Hospitals</a></li>
                            <li><a href="#" className="text-base text-slate-300 hover:text-white">Scheme Navigator</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-base text-slate-300 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-base text-slate-300 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-base text-slate-400">
                        &copy; {new Date().getFullYear()} AarogyaLink. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-500 mt-4 md:mt-0">
                        Not a replacement for professional medical advice.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
