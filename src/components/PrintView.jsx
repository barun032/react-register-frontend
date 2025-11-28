// src/components/PrintView.js
import React, { useEffect } from 'react';
import { registerTableHeaders, registerFieldMappings } from '../data/registerData';

const PrintView = ({ selectedRegister, records, onClose }) => {
  const tableHeaders = registerTableHeaders[selectedRegister] || [];
  const fieldMappings = registerFieldMappings[selectedRegister] || {};

  useEffect(() => {
    const printTimer = setTimeout(() => {
      window.print();
    }, 100);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearTimeout(printTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  // Get all column names for data rendering
  const getAllColumnNames = () => {
    const allColumns = [];
    tableHeaders.forEach(row => {
      row.forEach(header => {
        if (!allColumns.includes(header.name)) {
          allColumns.push(header.name);
        }
      });
    });
    return allColumns;
  };

  const allColumns = getAllColumnNames();

  return (
    <div className="p-8 bg-white">
      {/* Header */}
      <div className="text-center mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedRegister}</h1>
        <p className="text-gray-600">
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        <p className="text-gray-600">Total Records: {records.length}</p>
      </div>
      
      {/* Table */}
      {records.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            {/* Dynamic Header Rows */}
            {tableHeaders.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((header, headerIndex) => (
                  <th
                    key={headerIndex}
                    rowSpan={header.rowspan || 1}
                    colSpan={header.colspan || 1}
                    className={`border border-gray-300 px-3 py-2 text-center font-bold ${header.className || 'bg-gray-100'}`}
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {allColumns.map((columnName, colIndex) => {
                  const fieldName = fieldMappings[columnName];
                  const value = record[fieldName];
                  
                  return (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-3 py-2"
                    >
                      {value || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No records to display
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600 text-right">
        Page 1 of 1
      </div>
    </div>
  );
};

export default PrintView;