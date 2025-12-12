import React from 'react';
import { useRegister } from '../context/RegisterContext';
import { statusTypes, registerTypes } from '../data/registerData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faHourglassHalf, faDatabase } from '@fortawesome/free-solid-svg-icons';

const StatusCards = () => {
  const { currentRecords: records, selectedRegister, selectedPart } = useRegister();
  
  const calculateStats = () => {
    if (selectedRegister === registerTypes.ISSUED) {
      return { totalRecords: records.length, pendingRecords: 0, completedRecords: 0 };
    }
    const pendingRecords = records.filter(record =>
      record.status === statusTypes.PENDING || record.status === statusTypes.IN_PROGRESS || record.status === statusTypes.PARTIALLY_ISSUED
    ).length;
    const completedRecords = records.filter(record =>
      record.status === statusTypes.COMPLETED || record.status === statusTypes.ACKNOWLEDGED
    ).length;
    return { totalRecords: records.length, pendingRecords, completedRecords };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, borderClass, textClass, icon, bgIconClass }) => (
    <div className={`bg-white rounded shadow-sm border border-gray-300 relative overflow-hidden group border-t-4 ${borderClass}`}>
      <div className="p-5 flex justify-between items-start">
        <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${textClass} font-mono`}>{value}</p>
        </div>
        <div className={`p-3 rounded-md border border-gray-200 ${bgIconClass}`}>
            <span className={`text-xl ${textClass}`}>{icon}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-2 border-t border-gray-200 flex justify-between items-center">
        <span className="text-[10px] text-gray-500 font-bold uppercase">Official Count</span>
        <span className="text-[10px] text-gray-400">Updated: Just now</span>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-100 border-b border-gray-200">
      <div className="mb-6 pb-2 border-b border-gray-300 flex flex-col sm:flex-row sm:items-baseline justify-between">
        <div>
            <h2 className="text-2xl font-bold text-blue-900 font-serif">
            {selectedRegister}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-medium">
            Government Record Overview
            </p>
        </div>
        {selectedRegister === registerTypes.RECEIVE && selectedPart && (
            <span className="text-sm font-bold text-gray-700 bg-white border border-gray-300 px-3 py-1 rounded shadow-sm mt-2 sm:mt-0">
                SECTION: {selectedPart}
            </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Database Records"
          value={stats.totalRecords}
          borderClass="border-blue-700"
          textClass="text-blue-800"
          bgIconClass="bg-blue-50"
          icon={<FontAwesomeIcon icon={faDatabase} />}
        />
        {selectedRegister === registerTypes.RECEIVE && (
          <>
            <StatCard
              title="Pending / Action Required"
              value={stats.pendingRecords}
              borderClass="border-amber-500"
              textClass="text-amber-700"
              bgIconClass="bg-amber-50"
              icon={<FontAwesomeIcon icon={faHourglassHalf} />}
            />
            <StatCard
              title="Disposed / Completed"
              value={stats.completedRecords}
              borderClass="border-green-600"
              textClass="text-green-700"
              bgIconClass="bg-green-50"
              icon={<FontAwesomeIcon icon={faCircleCheck} />}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default StatusCards;