import React, { useRef } from 'react';

const TableToolbar = ({ searchQuery, setSearchQuery, dateFrom, setDateFrom, dateTo, setDateTo, onPrint, filteredCount, sortOrder, selectedRegister }) => {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const clearDateFilter = () => { setDateFrom(''); setDateTo(''); };
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const openFrom = () => fromInputRef.current?.showPicker?.();
  const openTo = () => toInputRef.current?.showPicker?.();
  const handleContainerClick = (e) => {
    if (e.target.closest('button')) return;
    if (!dateFrom) openFrom(); else if (!dateTo) openTo(); else openFrom();
  };

  const displayFrom = dateFrom ? formatDate(dateFrom) : 'DD/MM/YYYY';
  const displayTo = dateTo ? formatDate(dateTo) : 'DD/MM/YYYY';

  return (
    <div className="px-5 py-4 border-b border-gray-300 bg-gray-50/80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-l-4 border-blue-800 pl-3">Record List</h2>
          <p className="text-xs text-gray-500 mt-1 pl-3">
            Showing <span className="font-bold text-blue-800">{filteredCount}</span> entries
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* DATE RANGE */}
          <div onClick={handleContainerClick} className="relative flex items-center bg-white border border-gray-300 rounded hover:border-blue-500 transition-colors cursor-pointer min-w-64 h-9 shadow-sm group">
            <div onClick={(e) => { e.stopPropagation(); openFrom(); }} className="absolute inset-0 left-0 right-1/2 z-10" title="Start Date" />
            <div onClick={(e) => { e.stopPropagation(); openTo(); }} className="absolute inset-0 left-1/2 right-0 z-10" title="End Date" />
            <input ref={fromInputRef} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="sr-only" />
            <input ref={toInputRef} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="sr-only" />

            <div className="flex items-center gap-2 pl-3 pr-8 w-full justify-between pointer-events-none">
              <span className={`text-xs font-mono ${dateFrom ? 'text-blue-900 font-bold' : 'text-gray-400'}`}>{displayFrom}</span>
              <span className="text-gray-400 text-xs">TO</span>
              <span className={`text-xs font-mono ${dateTo ? 'text-blue-900 font-bold' : 'text-gray-400'}`}>{displayTo}</span>
            </div>

            {(dateFrom || dateTo) && (
              <button onClick={(e) => { e.stopPropagation(); clearDateFilter(); }} className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 z-20 transition-colors p-1">
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Records..."
              className="w-full sm:w-64 px-3 py-1.5 pl-9 h-9 border border-gray-300 rounded bg-white text-sm text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none shadow-sm placeholder-gray-400"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
          </div>

          {/* Print Button */}
          <button onClick={onPrint} className="px-4 py-1.5 h-9 bg-blue-800 text-white text-sm font-bold rounded shadow-sm hover:bg-blue-900 transition-colors flex items-center gap-2 border border-blue-900 cursor-pointer">
            <i className="fa-solid fa-print"></i>
            <span>Print / Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default TableToolbar;