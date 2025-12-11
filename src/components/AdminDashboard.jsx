import React, { useRef, useState } from 'react';
import { useRegister } from '../context/RegisterContext';
import { registerTypes, receivePartTypes, statusTypes } from '../data/registerData';

const AdminDashboard = ({ onClose }) => {
    const { allRecords, restoreData } = useRegister();
    const fileInputRef = useRef(null);
    const [notification, setNotification] = useState(null);

    // --- 1. STATISTICS CALCULATION ---
    const getStats = () => {
        const receiveData = allRecords[registerTypes.RECEIVE] || {};
        const issuedData = allRecords[registerTypes.ISSUED] || [];

        // Calculate totals per part
        const partCounts = Object.entries(receiveData).map(([part, records]) => ({
            name: part,
            count: records.length,
            pending: records.filter(r => r.status === statusTypes.PENDING).length
        }));

        const totalReceive = partCounts.reduce((acc, curr) => acc + curr.count, 0);
        const totalIssued = issuedData.length;
        const totalPending = partCounts.reduce((acc, curr) => acc + curr.pending, 0);

        return { totalReceive, totalIssued, totalPending, partCounts };
    };

    const stats = getStats();

    // --- 2. DATA MANAGEMENT HANDLERS ---
    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allRecords));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `register_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showNotification("Data exported successfully!");
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsedData = JSON.parse(event.target.result);
                // Basic validation check
                if (parsedData[registerTypes.RECEIVE] && parsedData[registerTypes.ISSUED]) {
                    if (window.confirm("WARNING: This will overwrite all current data. Are you sure?")) {
                        restoreData(parsedData);
                        showNotification("Database restored successfully!");
                    }
                } else {
                    alert("Invalid backup file format.");
                }
            } catch (err) {
                alert("Error reading file. Please check the JSON format.");
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = null;
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    // --- 3. COMPONENT RENDER ---
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Analytics and Data Management</p>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                    &larr; Back to Registers
                </button>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Received"
                    value={stats.totalReceive}
                    icon="📥"
                    trend="+12% this month" // Placeholder for future logic
                    color="blue"
                />
                <StatCard
                    label="Total Dispatched"
                    value={stats.totalIssued}
                    icon="📤"
                    trend="Active workflow"
                    color="indigo"
                />
                <StatCard
                    label="Pending Actions"
                    value={stats.totalPending}
                    icon="⏳"
                    trend="Requires attention"
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Volume by Register Part</h3>
                    <div className="space-y-4">
                        {stats.partCounts.map((part) => (
                            <div key={part.name} className="relative">
                                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                    <span>{part.name}</span>
                                    <span className="text-gray-900">{part.count} records</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-slate-700 h-4 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${stats.totalReceive > 0 ? (part.count / stats.totalReceive) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Management Section */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Data Management</h3>
                        <p className="text-slate-300 text-sm mb-6">
                            Your data is stored locally in your browser. Create regular backups to prevent data loss.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleExport}
                            className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download Backup
                        </button>

                        <button
                            onClick={handleImportClick}
                            className="w-full py-3 bg-slate-700 text-slate-200 border border-slate-600 rounded-xl font-bold hover:bg-slate-600 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Restore Data
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
                    {notification}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon, trend, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600"
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    {trend}
                </span>
            </div>
        </div>
    );
};

export default AdminDashboard;