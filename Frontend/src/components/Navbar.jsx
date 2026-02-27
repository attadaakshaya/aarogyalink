import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Truck, Search, Menu, Leaf } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Leaf className="text-primary-500" size={24} />
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-slate-800 tracking-tight leading-none">
                                    Aarogya<span className="text-primary-600">Link</span>
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                                    Your Healthcare Connection
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="hidden sm:flex items-center space-x-8">
                        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                            <Home size={16} /> Home
                        </Link>
                        <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                            <Truck size={16} /> Admin Panel
                        </Link>
                    </div>

                    {/* Action Button */}
                    <div className="hidden sm:flex items-center">
                        <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                            <Search size={16} /> Find Healthcare
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="sm:hidden flex items-center">
                        <button className="text-slate-500 hover:text-slate-700 p-2">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
