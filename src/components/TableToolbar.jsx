// src/components/TableToolbar.jsx
import React from 'react';

const TableToolbar = ({
  searchQuery,
  setSearchQuery,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onPrint,
  totalRecords,
  filteredCount,
  sortOrder,
  selectedRegister,
}) => {
  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left: Title + Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Records</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCount} record{filteredCount !== 1 ? 's' : ''} in {selectedRegister}
            {searchQuery && ` • Searching "${searchQuery}"`}
            {(dateFrom || dateTo) && ` • Date: ${dateFrom || '...'} to ${dateTo || '...'}`}
            {sortOrder === 'desc' ? ' • Sorted newest first' : ' • Sorted oldest first'}
          </p>
        </div>

        {/* Right: Filters + Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm border-0 focus:ring-0 focus:outline-none"
              />
              <span className="text-gray-400">→</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm border-0 focus:ring-0 focus:outline-none"
              />
            </div>
            {(dateFrom || dateTo) && (
              <button
                onClick={clearDateFilter}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Clear date filter"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by No., Subject, Name..."
              className="w-full sm:w-80 px-4 py-2.5 pl-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none transition-colors"
            />
            <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
          >
            <i className="fa-solid fa-print"></i>
            <span>Export / Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableToolbar;