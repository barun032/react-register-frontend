import React, { useState } from 'react';
import { useRegister } from '../context/RegisterContext';
import { registerTypes, statusTypes } from '../data/registerData';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; 
import UserManagement from '../components/UserManagement'; 

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
        showNotification("JSON File downloaded!");
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Analytics and Data Management</p>
                </div>
                
                <button
                    onClick={() => navigate('/')} 
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm cursor-pointer"
                >
                    &larr; Back to Registers
                </button>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Received" value={stats.totalReceive} icon="📥" trend="+12% this month" color="blue" />
                <StatCard label="Total Dispatched" value={stats.totalIssued} icon="📤" trend="Active workflow" color="indigo" />
                <StatCard label="Pending Actions" value={stats.totalPending} icon="⏳" trend="Requires attention" color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Main Chart Section - COMPACT VERSION */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    {/* Reduced mb-6 to mb-4 */}
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Volume by Register Part</h3>
                    {/* Reduced space-y-4 to space-y-3 */}
                    <div className="space-y-3">
                        {stats.partCounts.map((part) => (
                            <div key={part.name} className="relative">
                                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                    <span>{part.name}</span>
                                    <span className="text-gray-900">{part.count} records</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-slate-700 h-3 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${stats.totalReceive > 0 ? (part.count / stats.totalReceive) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Management Section - COMPACT VERSION */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl text-white shadow-lg flex flex-col justify-center">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Data Management</h3>
                        {/* Reduced margin bottom */}
                        <p className="text-slate-300 text-xs mb-4">
                            Export Excel reports or JSON backups.
                        </p>
                    </div>

                    {/* Reduced vertical spacing */}
                    <div className="space-y-2">
                        {/* EXCEL BUTTON - Reduced padding */}
                        <button
                            onClick={handleExcelExport}
                            className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Excel
                        </button>

                        {/* JSON BUTTON - Reduced padding */}
                        <button
                            onClick={handleExport}
                            className="w-full py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download JSON
                        </button>
                    </div>
                </div>
            </div>

            {/* --- USER MANAGEMENT SECTION --- */}
            <div className="mt-2">
                <UserManagement />
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
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
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-xl ${colorClasses[color]}`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
            <div className="mt-3 flex items-center text-xs">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    {trend}
                </span>
            </div>
        </div>
    );
};

export default AdminDashboard;