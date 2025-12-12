import React from 'react';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  if (totalPages <= 1) return null;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }

  return (
    <div className="px-5 py-3 border-t border-gray-300 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
      <div className="flex items-center gap-3">
        <span className="text-gray-500">Show</span>
        <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 bg-white border border-gray-300 rounded focus:border-blue-600 outline-none text-gray-800">
          {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="text-gray-500">entries | Showing {start} to {end} of {totalItems}</span>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700">Prev</button>
        {pages.map((p, i) => (
          <button key={i} onClick={() => typeof p === 'number' && onPageChange(p)} disabled={p === '...'}
            className={`min-w-[32px] h-8 rounded border flex items-center justify-center ${p === currentPage ? 'bg-blue-800 text-white border-blue-800 font-bold' : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'} ${p === '...' ? 'border-none bg-transparent' : ''}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700">Next</button>
      </div>
    </div>
  );
};
export default Pagination;