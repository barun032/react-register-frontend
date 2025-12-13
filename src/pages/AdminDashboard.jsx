import React, { useState } from 'react';
import { useRegister } from '../context/RegisterContext';
import { registerTypes, statusTypes } from '../data/registerData';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; 
import UserManagement from '../components/UserManagement'; 
import OfficerManagement from '../components/OfficerManagement';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { allRecords } = useRegister(); 
    const [notification, setNotification] = useState(null);

    // --- STATISTICS CALCULATION ---
    const getStats = () => {
        const receiveData = allRecords[registerTypes.RECEIVE] || {};
        const issuedData = allRecords[registerTypes.ISSUED] || [];

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

    // --- DATA MANAGEMENT HANDLERS ---
    const handleExcelExport = () => {
        const wb = XLSX.utils.book_new();
        let hasData = false;

        // Process Receive Register
        const receiveParts = allRecords[registerTypes.RECEIVE] || {};
        Object.entries(receiveParts).forEach(([partName, records]) => {
            if (records && records.length > 0) {
                const ws = XLSX.utils.json_to_sheet(records);
                const safeName = partName.replace(/[:\/\\?*\[\]]/g, "").substring(0, 30);
                XLSX.utils.book_append_sheet(wb, ws, safeName);
                hasData = true;
            }
        });

        // Process Dispatch Register
        const issuedRecords = allRecords[registerTypes.ISSUED] || [];
        if (issuedRecords.length > 0) {
            const ws = XLSX.utils.json_to_sheet(issuedRecords);
            XLSX.utils.book_append_sheet(wb, ws, "Dispatch Register");
            hasData = true;
        }

        if (!hasData) {
            alert("No records to export!");
            return;
        }

        const fileName = `Register_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        showNotification("Excel file generated successfully!");
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allRecords));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `register_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showNotification("JSON Backup downloaded!");
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-300 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 uppercase tracking-tight font-serif">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1 text-sm font-medium">System Analytics & Central Control</p>
                </div>
                
                <button
    onClick={() => navigate('/')}
    className="group relative overflow-hidden px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded shadow-sm cursor-pointer text-sm"
>
    {/* 1. The Sliding Gray Background Layer */}
    <span className="absolute inset-0 w-full h-full bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 ease-out"></span>
    
    {/* 2. The Text Content (Must be relative to sit on top of the background) */}
    <span className="relative flex items-center gap-2">
        <span>&larr;</span> Back to Registers
    </span>
</button>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    label="Total Inward Records" 
                    value={stats.totalReceive} 
                    icon="📥" 
                    trend="Received Volume" 
                    color="blue" 
                />
                <StatCard 
                    label="Total Outward Records" 
                    value={stats.totalIssued} 
                    icon="📤" 
                    trend="Dispatched Volume" 
                    color="indigo" 
                />
                <StatCard 
                    label="Pending Actions" 
                    value={stats.totalPending} 
                    icon="⏳" 
                    trend="Requires Attention" 
                    color="amber" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Main Chart Section */}
                <div className="lg:col-span-2 bg-white p-5 rounded border border-gray-300 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
                        Volume by Register Section
                    </h3>
                    <div className="space-y-4">
                        {stats.partCounts.map((part) => (
                            <div key={part.name} className="relative">
                                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1 uppercase">
                                    <span>{part.name}</span>
                                    <span className="text-blue-900">{part.count} records</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-300">
                                    <div
                                        className="bg-blue-800 h-3 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${stats.totalReceive > 0 ? (part.count / stats.totalReceive) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Management Section */}
                <div className="bg-white p-5 rounded border border-gray-300 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 uppercase tracking-wide">Data Management</h3>
                        <p className="text-gray-500 text-xs mb-4">
                            Generate official reports or system backups.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {/* EXCEL BUTTON */}
                        <button
                            onClick={handleExcelExport}
                            className="w-full py-2.5 bg-green-700 text-white rounded font-bold hover:bg-green-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-green-800 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Excel Report
                        </button>

                        {/* JSON BUTTON */}
                        <button
                            onClick={handleExport}
                            className="w-full py-2.5 bg-gray-700 text-white rounded font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-gray-800 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download System Backup
                        </button>
                    </div>
                </div>
            </div>

            {/* --- USER MANAGEMENT SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <UserManagement />
                <OfficerManagement /> 
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-6 right-6 bg-green-800 text-white px-6 py-3 rounded shadow-lg animate-bounce z-50 flex items-center gap-2 border border-green-900">
                    <i className="fa-solid fa-check-circle"></i>
                    <span className="font-bold text-sm">{notification}</span>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon, trend, color }) => {
    // Official Government Colors - UPDATED to target TOP BORDER only
    const borderTopColors = {
        blue: "border-t-blue-800",
        indigo: "border-t-indigo-700",
        amber: "border-t-amber-600"
    };
    
    const iconBgColors = {
        blue: "bg-blue-100 text-blue-800",
        indigo: "bg-indigo-100 text-indigo-800",
        amber: "bg-amber-100 text-amber-800"
    };

    return (
        <div className={`bg-white p-5 rounded shadow-sm border border-gray-300 border-t-4 ${borderTopColors[color]} hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1 font-mono">{value}</h3>
                </div>
                <div className={`p-2 rounded-md ${iconBgColors[color]}`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status: <span className="text-gray-800 font-bold">{trend}</span>
                </span>
            </div>
        </div>
    );
};

export default AdminDashboard;