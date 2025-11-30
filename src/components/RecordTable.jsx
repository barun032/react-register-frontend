// src/components/RecordTable.js (With Soft Borders)
import React from 'react';
import { registerTableHeaders, registerFieldMappings, registerTypes, statusTypes } from '../data/registerData';

const RecordTable = ({ selectedRegister, records, onPrint }) => {
  const tableHeaders = registerTableHeaders[selectedRegister] || [];
  const fieldMappings = registerFieldMappings[selectedRegister] || {};

  const getStatusColor = (status) => {
    switch (status) {
      case statusTypes.COMPLETED:
      case statusTypes.ACKNOWLEDGED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case statusTypes.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case statusTypes.IN_PROGRESS:
      case statusTypes.PARTIALLY_ISSUED:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case statusTypes.COMPLETED:
      case statusTypes.ACKNOWLEDGED:
        return '✅';
      case statusTypes.PENDING:
        return '⏳';
      case statusTypes.IN_PROGRESS:
      case statusTypes.PARTIALLY_ISSUED:
        return '🔄';
      default:
        return '📄';
    }
  };

  // 🐛 FIX: This function is the root cause of the issue. 
  // It must return all column names in the correct display order, 
  // including the 'rowspan: 2' headers from Row 1, and the implicit 'Status' column.
  const getAllColumnNames = () => {
    if (selectedRegister === registerTypes.RECEIVE) {
      return [
        'Consecutive No.',
        'Date of receipt in office',
        'From whom received', // Sub-header under 'Letter etc.'
        'Reference Number',   // Sub-header under 'Letter etc.'
        'Reference Date',     // Sub-header under 'Letter etc.'
        'Short subject',
        'Reminder Number',    // Sub-header under 'Remainders'
        'Reminder Date',      // Sub-header under 'Remainders'
        'File No.',           // Sub-header under 'Where the letter is placed'
        'Sl. No.',            // Sub-header under 'Where the letter is placed'
        'No. of the Collection', // Sub-header under 'Where the letter is placed'
        'No. of the file within the collection', // Sub-header under 'Where the letter is placed'
        'Type of action',
        'Memo No.',           // Sub-header under 'Dispatch Register'
        'Dispatch Date',      // Sub-header under 'Dispatch Register'
        'Endorsed To',
        'Status' // The implicitly required column for status display
      ];
    } else if (selectedRegister === registerTypes.ISSUED) {
      return [
        'Consecutive No.',
        'Date',
        'To whom addressed',
        'Short subject',
        'File No. & Serial No.',       // Sub-header under 'Where the draft is placed'
        'No. & title of collection',   // Sub-header under 'Where the draft is placed'
        'No. of file within the collection', // Sub-header under 'Where the draft is placed'
        'No. and date of reply receive',
        'Part No.',
        'Ref No.',
        'Reminder No.',                // Sub-header under 'Reminder'
        'Reminder Date',               // Sub-header under 'Reminder'
        'Rs.',                         // Sub-header under 'Value of Stamp.'
        'P.',                          // Sub-header under 'Value of Stamp.'
        'Remarks',
        'Name of the Officer.',
        'Status' // The implicitly required column for status display
      ];
    }
    
    return [];
  };

  const allColumns = getAllColumnNames();

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Records</h2>
              <p className="text-sm text-gray-600 mt-1">
                {records.length} records in {selectedRegister}
              </p>
            </div>
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>📄</span>
              <span>Export / Print</span>
            </button>
          </div>
        </div>
        
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              {/* Dynamic Header Rows */}
              {tableHeaders.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((header, headerIndex) => (
                    <th
                      key={headerIndex}
                      rowSpan={header.rowspan || 1}
                      colSpan={header.colspan || 1}
                      className={`px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider border border-gray-200 ${header.className || ''}`}
                    >
                      {header.name}
                    </th>
                  ))}
                  {/* Add 'Status' column header explicitly if it's the last column */}
                  {rowIndex === 0 && <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider border border-gray-200">Status</th>}
                </tr>
              ))}
              {/* This is the final row, so we don't need to check for rowIndex==1 if we fix the above logic */}
              {tableHeaders.length === 1 && <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider border border-gray-200">Status</th>}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr 
                  key={record.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {allColumns.map((columnName, colIndex) => {
                    // Special case for 'Status' field, which is not in fieldMappings but is a record property
                    const isStatusColumn = columnName === 'Status';
                    // Special case for 'Consecutive No.', which uses 'id' but is custom rendered
                    const isIdColumn = columnName === 'Consecutive No.';
                    
                    const fieldName = isIdColumn ? 'id' : isStatusColumn ? 'status' : fieldMappings[columnName];
                    const value = record[fieldName];
                    
                    // console.log(`Column: ${columnName}, Field: ${fieldName}, Value:`, value);

                    if (isStatusColumn) {
                      // Status rendering logic
                      return (
                        <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm border border-gray-200">
                          <div className="flex items-center justify-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
                              <span className="mr-1.5">{getStatusIcon(value)}</span>
                              {value}
                            </span>
                          </div>
                        </td>
                      );
                    }
                    
                    if (isIdColumn) {
                      // Consecutive No. rendering logic
                      return (
                        <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-center border border-gray-200">
                          <span className="text-sm font-mono font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            {record.id || value}
                          </span>
                        </td>
                      );
                    }

                    if (columnName === 'Rs.' || columnName === 'P.') {
                      // Stamp Value rendering logic
                      return (
                        <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center border border-gray-200">
                          {value || '0'}
                        </td>
                      );
                    }
                    
                    return (
                      <td
                        key={colIndex}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border border-gray-200"
                      >
                        {value || '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {records.length === 0 && (
            <div className="text-center py-12 px-6 border-gray-200 border-t-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Get started by creating your first record in the {selectedRegister}.
              </p>
            </div>
          )}
        </div>

        {/* Table Footer */}
        {records.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
              <span>Showing {records.length} records</span>
              <span className="mt-2 sm:mt-0">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordTable;