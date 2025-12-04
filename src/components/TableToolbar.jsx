// src/components/TableToolbar.jsx
import React, { useRef } from 'react';

const TableToolbar = ({
  searchQuery,
  setSearchQuery,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onPrint,
  filteredCount,
  sortOrder,
  selectedRegister,
}) => {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y.slice(-2)}`;
  };

  const openFrom = () => fromInputRef.current?.showPicker?.();
  const openTo = () => toInputRef.current?.showPicker?.();

  const handleContainerClick = (e) => {
    if (e.target.closest('button')) return; // ignore clear button

    if (!dateFrom) openFrom();
    else if (!dateTo) openTo();
    else openFrom(); // both filled → reopen from
  };

  const displayFrom = dateFrom ? formatDate(dateFrom) : 'dd-mm-yy';
  const displayTo = dateTo ? formatDate(dateTo) : 'dd-mm-yy';

  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        {/* Left */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Records</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCount} record{filteredCount !== 1 ? 's' : ''} in {selectedRegister}
            {searchQuery && ` • Searching "${searchQuery}"`}
            {(dateFrom || dateTo) && ` • Date: ${displayFrom} to ${displayTo}`}
            {sortOrder === 'desc' ? ' • Sorted newest first' : ' • Sorted oldest first'}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

          {/* PERFECT DATE RANGE PICKER */}
          <div
            onClick={handleContainerClick}
            // CHANGED: Increased min-w-64 to min-w-72 to give dates more breathing room
            className="relative flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors cursor-pointer select-none min-w-72 group"
          >
            {/* Invisible clickable layer for FROM date (left ~45%) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openFrom();
              }}
              className="absolute inset-0 left-0 right-1/2 z-10"
              title="Select start date"
            />

            {/* Invisible clickable layer for TO date (right ~45%) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                openTo();
              }}
              className="absolute inset-0 left-1/2 right-0 z-10"
              title="Select end date"
            />

            {/* Hidden native inputs */}
            <input
              ref={fromInputRef}
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="sr-only"
            />
            <input
              ref={toInputRef}
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="sr-only"
            />

            {/* Visible content */}
            {/* CHANGED: Replaced 'px-3' with 'pl-3 pr-9'. 
                The pr-9 reserves space on the right so text doesn't slide under the X button. */}
            <div className="flex items-center gap-2 pl-3 pr-9 py-2 w-full justify-between pointer-events-none">
              <span className={`text-sm ${dateFrom ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {displayFrom}
              </span>
              <span className="text-gray-400">→</span>
              <span className={`text-sm ${dateTo ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {displayTo}
              </span>
            </div>

            {/* Clear button */}
            {(dateFrom || dateTo) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearDateFilter();
                }}
                className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 z-20 transition-colors p-1"
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
            className="px-4 py-2 bg-slate-700 text-white cursor-pointer font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
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