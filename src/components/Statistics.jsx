// src/components/Statistics.js
import React from 'react';
import { registerTypes, statusTypes } from '../data/registerData';

const Statistics = ({ allRecords }) => {
  // Calculate statistics from all registers
  const calculateStats = () => {
    let totalRecords = 0;
    let pendingRecords = 0;
    let completedRecords = 0;

    // Inside calculateStats()
    Object.values(registerTypes).forEach(registerType => {
      const records = allRecords[registerType] || [];
      totalRecords += records.length;

      // Only count status if it's Receive Register
      if (registerType === registerTypes.RECEIVE) {
        records.forEach(record => {
          if (record.status === statusTypes.PENDING ||
            record.status === statusTypes.IN_PROGRESS ||
            record.status === statusTypes.PARTIALLY_ISSUED) {
            pendingRecords++;
          } else if (record.status === statusTypes.COMPLETED ||
            record.status === statusTypes.ACKNOWLEDGED) {
            completedRecords++;
          }
        });
      }
    });

    return { totalRecords, pendingRecords, completedRecords };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, color, icon }) => (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.replace('text-', 'bg-').replace('border-', 'bg-')} bg-opacity-10`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Records"
          value={stats.totalRecords}
          color="text-blue-600 border-blue-200"
          icon="📊"
        />
        <StatCard
          title="Pending"
          value={stats.pendingRecords}
          color="text-yellow-600 border-yellow-200"
          icon="⏳"
        />
        <StatCard
          title="Completed"
          value={stats.completedRecords}
          color="text-green-600 border-green-200"
          icon="✅"
        />
      </div>

    </div>
  );
};

export default Statistics;