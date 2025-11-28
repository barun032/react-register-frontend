// src/components/StatusCards.js
import React from 'react';
import { statusTypes, registerTypes } from '../data/registerData';

const StatusCards = ({ records, selectedRegister, selectedPart }) => {
  const calculateStats = () => {
    const totalRecords = records.length;
    
    const pendingRecords = records.filter(record => 
      record.status === statusTypes.PENDING || 
      record.status === statusTypes.IN_PROGRESS ||
      record.status === statusTypes.PARTIALLY_ISSUED
    ).length;
    
    const completedRecords = records.filter(record => 
      record.status === statusTypes.COMPLETED || 
      record.status === statusTypes.ACKNOWLEDGED
    ).length;

    return { totalRecords, pendingRecords, completedRecords };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color} bg-opacity-10`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          <span className='pr-2'>Register of Letter</span>
          {selectedRegister.replace(' Register', '')}
          {selectedRegister === registerTypes.RECEIVE && selectedPart && (
            <span className="text-lg font-semibold text-slate-700 ml-2 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {selectedPart}
            </span>
          )}
        </h2>
        <p className="text-gray-600">
          Track and manage your document workflow
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Records"
          value={stats.totalRecords}
          color="text-blue-500"
          icon="📊"
        />
        <StatCard
          title="Pending Actions"
          value={stats.pendingRecords}
          color="text-amber-500"
          icon="⏳"
        />
        <StatCard
          title="Completed"
          value={stats.completedRecords}
          color="text-emerald-500"
          icon="✅"
        />
      </div>
    </div>
  );
};

export default StatusCards;