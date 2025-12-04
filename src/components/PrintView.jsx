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
        'Part No.',
        'Ref No.',
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
  // Calculate total columns for the colspan of the header
  const totalColumns = allColumns.length > 0 ? allColumns.length : 1;

  return (
    <>
      {/* --- ADDED THIS STYLE BLOCK TO REMOVE BROWSER MARGINS --- */}
      <style>
        {`
          @media print {
            @page {
              margin: 0; /* This removes the browser's default left/right/top/bottom margins */
              size: auto;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
        `}
      </style>

      {/* Updated ClassName:
         1. w-full: Forces width to 100%
         2. print:w-full: Ensures print view uses full width
         3. print:max-w-none: Overrides any max-width constraints from parent components
         4. print:p-0: Removes all padding inside the div
      */}
      <div className="p-8 bg-white w-full print:w-full print:max-w-none print:p-0 print:m-0">
        
        {/* Extra breathing space at the top - visible in print */}
        <div className="h-0"></div>

        {records.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              {/* --- HEADER INSIDE THEAD --- */}
              <tr className="border-b-0">
                <th colSpan={totalColumns} className="p-0 border-x border-t border-gray-300 bg-white">
                  
                  {/* Header Content Container */}
                  <div className="mb-2 pb-2 px-4 pt-4">
                    {/* Single Line: Year (Left) | Title (Center) | Department (Right) */}
                    <div className="flex items-center justify-between text-sm font-bold uppercase text-gray-800">
                      
                      {/* Left: Year */}
                      <div className="border-b-2 border-dotted border-black whitespace-nowrap">
                        Year: {currentYear}
                      </div>

                      {/* Center: Main Title */}
                      <div className="text-center flex-1 px-4">
                        <div className="text-2xl font-bold text-gray-900 leading-tight">
                          Register of Letters {selectedRegister?.replace(' Register', '')}
                          {selectedRegister === registerTypes.RECEIVE && selectedPart && (
                            <span className="text-xl border border-black rounded-md px-2 ml-2 font-semibold align-middle inline-block">
                              {selectedPart}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Department */}
                      <div className="border-b-2 border-dotted border-black whitespace-nowrap">
                        Department: MPB
                      </div>
                    </div>
                  </div>
                  
                </th>
              </tr>

              {/* Existing Table Headers */}
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
                <tr key={record.id} className="bg-white break-inside-avoid">
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