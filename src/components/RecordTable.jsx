// src/components/RecordTable.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useRegister } from '../context/RegisterContext';
import { registerTableHeaders, registerFieldMappings, registerTypes, statusTypes } from '../data/registerData';
import Pagination from './Pagination';
import TableToolbar from './TableToolbar';

// 1. DEFINE COLUMN WIDTHS HERE
// keys must match the exact text in your table headers
const columnConfig = {
  // Common
  'Consecutive No.': 'w-16 min-w-[60px]', // Fixed narrow width
  'Date': 'min-w-[120px]',
  'Short subject': 'min-w-[350px] max-w-[500px]', // Wide column for subject
  'Remarks': 'min-w-[200px]',
  'From whom received': 'min-w-[200px]',
  'To whom addressed': 'min-w-[200px]',
  'Name of the Officer.': 'min-w-[150px]',
  'Date of receipt in office': 'min-w-[120px]',
  'Reference Date': 'min-w-[120px]',
};

const getStatusFromRecord = (record) => {
  if (record.dispatchMemoNo && record.dispatchMemoNo.trim() !== '') {
    return statusTypes.COMPLETED || 'Completed';
  }

  const actionType = record.actionType;
  if (!actionType) return statusTypes.PENDING || 'Pending';

  switch (actionType) {
    case 'Not Returnable':
      return statusTypes.ACTION_TAKEN || 'Action Taken';
    case 'Attached to File':
      return statusTypes.IN_PROGRESS || 'In Progress';
    case 'Returnable':
      return statusTypes.PENDING || 'Pending';
    default:
      return statusTypes.PENDING || 'Pending';
  }
};

const RecordTable = ({ onPrint, onEdit }) => {
  const { currentRecords: records, selectedRegister } = useRegister();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');

  const tableHeaders = registerTableHeaders[selectedRegister] || [];
  const fieldMappings = registerFieldMappings[selectedRegister] || {};

  // Filtered + Sorted + Date-filtered records
  const processedRecords = useMemo(() => {
    let result = [...records];

    if (dateFrom || dateTo) {
      result = result.filter(record => {
        const recordDate = record.date ? new Date(record.date) : null;
        if (!recordDate) return false;

        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;

        if (from && to) {
          return recordDate >= from && recordDate <= to;
        }
        if (from) return recordDate >= from;
        if (to) return recordDate <= to;

        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(record => {
        const id = (record.id || '').toString();
        const subject = (record.subject || '').toLowerCase();
        const person = selectedRegister === registerTypes.RECEIVE
          ? (record.from || '').toLowerCase()
          : (record.to || '').toLowerCase();
        return id.includes(q) || subject.includes(q) || person.includes(q);
      });
    }

    result.sort((a, b) => {
      const idA = parseInt(a.id || '0', 10);
      const idB = parseInt(b.id || '0', 10);
      return sortOrder === 'asc' ? idA - idB : idB - idA;
    });

    return result;
  }, [records, searchQuery, dateFrom, dateTo, selectedRegister, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegister, records, searchQuery, dateFrom, dateTo, rowsPerPage]);

  const totalPages = Math.ceil(processedRecords.length / rowsPerPage);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedRecords.slice(start, start + rowsPerPage);
  }, [processedRecords, currentPage, rowsPerPage]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case statusTypes.ACTION_TAKEN:
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
      case statusTypes.ACTION_TAKEN:
        return <i className="fa-solid fa-circle-check"></i>;
      case statusTypes.COMPLETED:
        return <i className="fa-solid fa-check-double"></i>;
      case statusTypes.ACKNOWLEDGED:
        return <i className="fa-solid fa-circle-check"></i>;
      case statusTypes.PENDING:
        return <i className="fa-solid fa-hourglass-half"></i>;
      case statusTypes.IN_PROGRESS:
      case statusTypes.PARTIALLY_ISSUED:
        return <i className="fa-solid fa-sync-alt fa-spin"></i>;
      default:
        return <i className="fa-solid fa-file-lines"></i>;
    }
  };

  const getAllColumnNames = () => {
    if (selectedRegister === registerTypes.RECEIVE) {
      return [
        'Consecutive No.', 'Date of receipt in office', 'From whom received', 'Reference Number',
        'Reference Date', 'Short subject', 'Reminder Number', 'Reminder Date', 'File No.', 'Sl. No.',
        'No. of the Collection', 'No. of the file within the collection', 'Type of action',
        'Memo No.', 'Dispatch Date', 'Endorsed To', 'Status'
      ];
    } else if (selectedRegister === registerTypes.ISSUED) {
      return [
        'Consecutive No.', 'Date', 'To whom addressed', 'Short subject',
        'File No. & Serial No.', 'No. & title of collection', 'No. of file within the collection',
        'No. and date of reply receive', 'Part No.', 'Ref No.', 'Reminder No.', 'Reminder Date',
        'Rs.', 'P.', 'Remarks', 'Name of the Officer.', 'Status'
      ];
    }
    return [];
  };
  const allColumns = getAllColumnNames();

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TableToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          onPrint={onPrint}
          filteredCount={processedRecords.length}
          sortOrder={sortOrder}
          selectedRegister={selectedRegister}
        />

        <div className="overflow-x-auto relative">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              {tableHeaders.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((header, headerIndex) => {
                    const isConsecutiveHeader = header.name === 'Consecutive No.';
                    const widthClass = columnConfig[header.name] || columnConfig.default;

                    return (
                      <th
                        key={headerIndex}
                        rowSpan={header.rowspan || 1}
                        colSpan={header.colspan || 1}
                        onClick={isConsecutiveHeader ? toggleSort : undefined}
                        className={`px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider border border-gray-200 
              ${widthClass} ${header.className || ''} 
              ${isConsecutiveHeader ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {header.name}
                          {isConsecutiveHeader && (
                            <div className="flex flex-col -space-y-1">
                              <svg
                                className={`w-3.5 h-3.5 transition-all ${sortOrder === 'asc' ? 'text-slate-800' : 'text-gray-400'
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <svg
                                className={`w-3.5 h-3.5 transition-all ${sortOrder === 'desc' ? 'text-slate-800' : 'text-gray-400'
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </th>
                    );
                  })}

                  {/* Status column – only in first header row */}
                  {rowIndex === 0 && selectedRegister === registerTypes.RECEIVE && (
                    <th
                      rowSpan={tableHeaders.length}
                      className={`px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider border border-gray-200 ${columnConfig['Status']}`}
                    >
                      Status
                    </th>
                  )}

                  {/* Actions column – only in first header row */}
                  {rowIndex === 0 && (
                    <th
                      rowSpan={tableHeaders.length}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider border border-gray-200"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              ))}
            </thead>


            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan="50" className="text-center py-16 text-gray-500 text-base">
                    {searchQuery || dateFrom || dateTo
                      ? `No records found for the selected filters`
                      : 'No records found'}
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr key={record.id} className="odd:bg-slate-50 transition-colors duration-150">
                    {allColumns.map((columnName, colIndex) => {
                      const isStatusColumn = columnName === 'Status';
                      const isIdColumn = columnName === 'Consecutive No.';
                      const fieldName = isIdColumn ? 'id' : isStatusColumn ? 'status' : fieldMappings[columnName];
                      const value = record[fieldName];

                      if (isStatusColumn) {
                        if (selectedRegister !== registerTypes.RECEIVE) return null;
                        const computedStatus = getStatusFromRecord(record);

                        return (
                          <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm border border-gray-200">
                            <div className="flex items-center justify-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(computedStatus)}`}>
                                <span className="mr-1.5">{getStatusIcon(computedStatus)}</span>
                                {computedStatus}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      if (isIdColumn) {
                        return (
                          <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-center border border-gray-200">
                            <span className="text-sm font-mono font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                              {record.id || value}
                            </span>
                          </td>
                        );
                      }

                      if (columnName === 'Rs.' || columnName === 'P.') {
                        return <td key={colIndex} className="px-4 py-3 text-center border border-gray-200">{value ?? ''}</td>;
                      }
                      if (columnName === 'Part No.') {
                        return <td key={colIndex} className="px-4 py-3 text-center border border-gray-200 text-xs font-medium text-gray-600">{value ?? ''}</td>;
                      }
                      if (columnName === 'Ref No.') {
                        return (
                          <td key={colIndex} className="px-4 py-3 text-center border border-gray-200 font-medium">
                            <span className="inline-block px-3 py-1 text-xs font-mono font-bold text-slate-800 bg-slate-100 rounded border border-slate-300">
                              {value ?? ''}
                            </span>
                          </td>
                        );
                      }

                      return (
                        // Optional: You can also add max-w classes here if you want to truncate text
                        <td key={colIndex} className="px-4 py-3 whitespace-normal text-sm text-gray-700 border border-gray-200 center">
                          {value ?? ''}
                        </td>
                      );
                    })}
                    <td className="px-2 py-1 text-center">
                      <button
                        onClick={() => onEdit && onEdit(record)}
                        className="text-center cursor-pointer text-xs font-medium text-gray-500 tracking-wider"
                      >
                        <i className="fa-solid fa-pen-to-square text-red-400 hover:text-red-500 transition text-[17px]"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {processedRecords.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={processedRecords.length}
            itemsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setRowsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default RecordTable;