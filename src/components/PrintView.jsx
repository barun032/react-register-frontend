// src/components/PrintView.js
import React, { useEffect } from 'react';
import { registerTableHeaders, registerFieldMappings, registerTypes } from '../data/registerData';

const PrintView = ({ selectedRegister, selectedPart, records, onClose }) => {
  const tableHeaders = registerTableHeaders[selectedRegister] || [];
  const fieldMappings = registerFieldMappings[selectedRegister] || {};

  // Get Current Year
  const currentYear = new Date().getFullYear();

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
        'Part No.',           // NOW INCLUDED
        'Ref No.',            // NOW INCLUDED
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
      /* Increased top padding for print specifically */
      .print\\:pt-10 {
        padding-top: 5rem; 
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

      {/* Added print:pt-10 to add more space at the very top of the page */}
      <div className="p-8 bg-white print:p-4 print:pt-16 print:m-0">

        {/* Header Container */}
        <div className="mb-6 border-b border-gray-300 pb-4">

          {/* New Row: Year (Left) and Department (Right) */}


          {/* Main Title - Centered */}
          <div className="text-center mt-4">
            <span className="text-2xl font-bold text-gray-900">
              Register of Letters {selectedRegister?.replace(' Register', '')}
            </span>
            {selectedRegister === registerTypes.RECEIVE && selectedPart && (
              <span className="text-xl border border-black-1 rounded-md px-2 ml-2 font-semibold">
                {selectedPart}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center w-full font-bold text-gray-800 text-sm uppercase">
            <div className="inline-block border-b-2 border-dotted border-black">
              Year: {currentYear}
            </div>
            <div className="inline-block border-b-2 border-dotted border-black">
              Department: MPB
            </div>
          </div>
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
                <tr key={record.id} className="bg-white">
                  {allColumns.map((columnName, colIndex) => {
                    const fieldName = fieldMappings[columnName];
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