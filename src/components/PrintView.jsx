// src/components/PrintView.js
import React, { useEffect } from 'react';
import { registerTableHeaders, registerFieldMappings, registerTypes } from '../data/registerData';

const PrintView = ({ selectedRegister, selectedPart, records, onClose }) => {
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

  // In PrintView.jsx - REPLACE the existing getAllColumnNames function with this:

  const getAllColumnNames = () => {
    if (selectedRegister === registerTypes.RECEIVE) {
      return [
        'Consecutive No.',
        'Date of receipt in office',
        'From whom received',
        'Reference Number',
        'Reference Date',
        'Short subject',
        'Reminder Number',
        'Reminder Date',
        'File No.',
        'Sl. No.',
        'No. of the Collection',
        'No. of the file within the collection',
        'Type of action',
        'Memo No.',
        'Dispatch Date',
        'Endorsed To'
      ];
    } else if (selectedRegister === registerTypes.ISSUED) {
      return [
        'Consecutive No.',
        'Date',
        'To whom addressed',
        'Short subject',
        'File No. & Serial No.',
        'No. & title of collection',
        'No. of file within the collection',
        'No. and date of reply receive',
        'Receive Register Ref.',
        'Reminder No.',
        'Reminder Date',
        'Rs.',
        'P.',
        'Remarks',
        'Name of the Officer.'
      ];
    }
    return [];
  };

  const allColumns = getAllColumnNames();

  return (
    <>
      {/* CSS for Landscape Printing */}
      <style>
        {`
    @media print {
      @page {
        size: landscape;
        margin: 0.5cm;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .print\\:p-4 {
        padding: 1rem;
      }
      .print\\:m-0 {
        margin: 0;
      }
    }
  `}
      </style>

      <div className="p-8 bg-white print:p-4 print:m-0">
        {/* Header */}
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <span className="text-2xl font-bold text-gray-900 mb-2">{selectedRegister}</span>
          {selectedRegister === registerTypes.RECEIVE && selectedPart && (
            <span className="text-xl font-semibold text-gray-700 mb-2">-{selectedPart}</span>
          )}
        </div>

        {/* Table */}
        {records.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              {tableHeaders.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((header, headerIndex) => (
                    <th
                      key={headerIndex}
                      rowSpan={header.rowspan || 1}
                      colSpan={header.colspan || 1}
                      // Removed 'bg-gray-100' and replaced with 'bg-white'
                      className={`border border-gray-300 px-3 py-2 text-center font-bold bg-white`}
                    >
                      {header.name}
                    </th>
                  ))}

                </tr>
              ))}
            </thead>
            <tbody>
              {records.map((record, index) => (
                // Removed alternating background colors logic
                <tr key={record.id} className="bg-white">
                  {allColumns.map((columnName, colIndex) => {
                    const fieldName = fieldMappings[columnName];

                    // Ensure fieldName is a valid key from registerData before accessing record
                    const value = fieldName ? record[fieldName] : null;

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
      </div>
    </>
  );
};

export default PrintView;