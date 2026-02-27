import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Activity, Settings, Bell, Search, Hospital, ShieldCheck, ChevronDown, CheckCircle2, TrendingUp, XCircle, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [statsData, setStatsData] = useState(null);
    const [recentAnalyses, setRecentAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                const [statsRes, diagnosesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/admin/stats`),
                    axios.get(`${API_URL}/api/admin/diagnoses`)
                ]);

                setStatsData(statsRes.data);

                // Format DB records to match UI table fields
                const formattedDiagnoses = diagnosesRes.data.map(doc => ({
                    id: `#REQ-${doc._id.substring(doc._id.length - 4).toUpperCase()}`,
                    symptoms: doc.symptoms,
                    result: doc.result?.conditions?.[0]?.name || 'Unknown',
                    status: doc.status,
                    urgency: doc.urgency || 'Medium',
                    time: new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));

                setRecentAnalyses(formattedDiagnoses);
            } catch (error) {
                console.error("Failed to load admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchAdminData, 30000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'Total Users', value: statsData?.usersPlaceholder || '0', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Symptom Scans', value: statsData?.totals || '0', change: '+24%', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Registered Hospitals', value: '842', change: '+5%', icon: Hospital, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'System Accuracy', value: statsData?.accuracyPlaceholder || '98%', change: '+0.4%', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-100' }
    ];

    return (
        <div className="bg-slate-50 min-h-screen flex text-slate-900 border-t border-slate-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
                <div className="p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Controls</p>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <Users size={18} /> User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('hospitals')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'hospitals' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <Hospital size={18} /> Hospital Directory
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <FileText size={18} /> Analytics & Reports
                        </button>
                    </nav>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-8 mb-4">Settings</p>
                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                            <Settings size={18} /> System Config
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h1>
                            <p className="text-sm text-slate-500 mt-1">Monitor platform health and active diagnosis queries.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search IDs or logs..."
                                    className="pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <button className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100 bg-white relative">
                                <Bell size={18} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <button className="flex items-center gap-2 pl-4 border-l border-slate-300">
                                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex justify-center items-center font-bold text-sm">
                                    A
                                </div>
                                <div className="text-left hidden lg:block">
                                    <p className="text-xs font-bold text-slate-800 leading-none">Admin User</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Superadmin</p>
                                </div>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                                        <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mt-2">
                                            <TrendingUp size={12} /> {stat.change} <span className="text-slate-400 font-normal">vs last month</span>
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                        <Icon size={24} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Table */}
                        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Diagnoses</h2>
                                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">ID</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Symptoms summary</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">AI Recommendation</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Urgency</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentAnalyses.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.id}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{item.symptoms}</td>
                                                <td className="px-6 py-4 text-sm text-slate-800 font-medium flex items-center gap-2">
                                                    {item.status === 'Completed' ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                                                    {item.result}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-none ${item.urgency === 'High' ? 'bg-red-100 text-red-800 border-red-200 border' :
                                                        item.urgency === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200 border' :
                                                            'bg-green-100 text-green-800 border-green-200 border'
                                                        }`}>
                                                        {item.urgency}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-4">System Processing</h2>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-medium text-slate-600">Gemini AI API Quota</span>
                                        <span className="text-xs font-bold text-slate-800">45%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-medium text-slate-600">Google Places API Quota</span>
                                        <span className="text-xs font-bold text-slate-800">62%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-medium text-slate-600">Server Memory Load</span>
                                        <span className="text-xs font-bold text-slate-800">28%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800 mb-3">Active Services</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-sm font-medium text-slate-600 flex-1">Express Backend</span>
                                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">Online</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-sm font-medium text-slate-600 flex-1">AI Recommendation Engine</span>
                                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">Online</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Admin;
