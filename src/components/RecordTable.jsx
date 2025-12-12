import React, { useState, useMemo, useEffect } from 'react';
import { useRegister } from '../context/RegisterContext';
import { registerTableHeaders, registerFieldMappings, registerTypes, statusTypes } from '../data/registerData';
import Pagination from './Pagination';
import TableToolbar from './TableToolbar';

const columnConfig = { 'Consecutive No.': 'w-16 min-w-[60px]', 'Date': 'min-w-[110px]', 'Short subject': 'min-w-[300px] max-w-[500px]', 'Remarks': 'min-w-[200px]', 'From whom received': 'min-w-[200px]', 'To whom addressed': 'min-w-[200px]', 'Name of the Officer.': 'min-w-[150px]', 'Date of receipt in office': 'min-w-[120px]', 'Reference Date': 'min-w-[120px]', };

const getStatusFromRecord = (record) => {
  if (record.dispatchMemoNo && record.dispatchMemoNo.trim() !== '') return statusTypes.COMPLETED || 'Completed';
  const actionType = record.actionType;
  if (!actionType) return statusTypes.PENDING || 'Pending';
  switch (actionType) {
    case 'Not Returnable': return statusTypes.ACTION_TAKEN || 'Action Taken';
    case 'Attached to File': return statusTypes.IN_PROGRESS || 'In Progress';
    case 'Returnable': return statusTypes.PENDING || 'Pending';
    default: return statusTypes.PENDING || 'Pending';
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

  const processedRecords = useMemo(() => {
    let result = [...records];
    if (dateFrom || dateTo) {
      result = result.filter(record => {
        const recordDate = record.date ? new Date(record.date) : null;
        if (!recordDate) return false;
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        if (from && to) return recordDate >= from && recordDate <= to;
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
            const person = selectedRegister === registerTypes.RECEIVE ? (record.from || '').toLowerCase() : (record.to || '').toLowerCase();
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

  useEffect(() => { setCurrentPage(1); }, [selectedRegister, records, searchQuery, dateFrom, dateTo, rowsPerPage]);

  const totalPages = Math.ceil(processedRecords.length / rowsPerPage);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedRecords.slice(start, start + rowsPerPage);
  }, [processedRecords, currentPage, rowsPerPage]);

  const toggleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  const getStatusColor = (status) => {
    switch (status) {
      case statusTypes.ACTION_TAKEN:
      case statusTypes.COMPLETED:
      case statusTypes.ACKNOWLEDGED: return 'bg-green-100 text-green-800 border-green-300';
      case statusTypes.PENDING: return 'bg-orange-100 text-orange-800 border-orange-300';
      case statusTypes.IN_PROGRESS:
      case statusTypes.PARTIALLY_ISSUED: return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case statusTypes.ACTION_TAKEN: return <i className="fa-solid fa-circle-check"></i>;
      case statusTypes.COMPLETED: return <i className="fa-solid fa-check-double"></i>;
      case statusTypes.ACKNOWLEDGED: return <i className="fa-solid fa-thumbs-up"></i>;
      case statusTypes.PENDING: return <i className="fa-solid fa-clock"></i>;
      case statusTypes.IN_PROGRESS:
      case statusTypes.PARTIALLY_ISSUED: return <i className="fa-solid fa-arrows-rotate fa-spin"></i>;
      default: return <i className="fa-solid fa-circle"></i>;
    }
  };

  const getAllColumnNames = () => {
    if (selectedRegister === registerTypes.RECEIVE) {
      return ['Consecutive No.', 'Date of receipt in office', 'From whom received', 'Reference Number', 'Reference Date', 'Short subject', 'Reminder Number', 'Reminder Date', 'File No.', 'Sl. No.', 'No. of the Collection', 'No. of the file within the collection', 'Type of action', 'Memo No.', 'Dispatch Date', 'Endorsed To', 'Status'];
    } else if (selectedRegister === registerTypes.ISSUED) {
      return ['Consecutive No.', 'Date', 'To whom addressed', 'Short subject', 'File No. & Serial No.', 'No. & title of collection', 'No. of file within the collection', 'No. and date of reply receive', 'Part No.', 'Ref No.', 'Reminder No.', 'Reminder Date', 'Rs.', 'P.', 'Remarks', 'Name of the Officer.', 'Status'];
    }
    return [];
  };
  const allColumns = getAllColumnNames();

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
        <TableToolbar
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo} onPrint={onPrint} filteredCount={processedRecords.length}
          sortOrder={sortOrder} selectedRegister={selectedRegister}
        />

        <div className="overflow-x-auto relative">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              {tableHeaders.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((header, headerIndex) => {
                    const isConsecutiveHeader = header.name === 'Consecutive No.';
                    const widthClass = columnConfig[header.name] || columnConfig.default;
                    return (
                      <th key={headerIndex} rowSpan={header.rowspan || 1} colSpan={header.colspan || 1} onClick={isConsecutiveHeader ? toggleSort : undefined}
                        className={`px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300 ${widthClass} ${header.className || ''} ${isConsecutiveHeader ? 'cursor-pointer hover:bg-gray-200 select-none' : ''}`}>
                        <div className="flex items-center justify-center gap-1">
                          {header.name}
                          {isConsecutiveHeader && <span className="text-gray-500 text-[10px] ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                        </div>
                      </th>
                    );
                  })}
                  {rowIndex === 0 && selectedRegister === registerTypes.RECEIVE && <th rowSpan={tableHeaders.length} className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Status</th>}
                  {rowIndex === 0 && <th rowSpan={tableHeaders.length} className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase border border-gray-300">Action</th>}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white">
              {paginatedRecords.length === 0 ? (
                <tr><td colSpan="50" className="text-center py-10 text-gray-500 italic">No records found matching criteria</td></tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50 transition-colors duration-150 odd:bg-white even:bg-gray-50">
                    {allColumns.map((columnName, colIndex) => {
                      const isStatusColumn = columnName === 'Status';
                      const isIdColumn = columnName === 'Consecutive No.';
                      const fieldName = isIdColumn ? 'id' : isStatusColumn ? 'status' : fieldMappings[columnName];
                      const value = record[fieldName];

                      if (isStatusColumn) {
                        if (selectedRegister !== registerTypes.RECEIVE) return null;
                        const computedStatus = getStatusFromRecord(record);
                        return (
                          <td key={colIndex} className="px-3 py-2 whitespace-nowrap text-sm border border-gray-300 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusColor(computedStatus)}`}>
                                <span className="mr-1.5">{getStatusIcon(computedStatus)}</span> {computedStatus}
                              </span>
                          </td>
                        );
                      }
                      if (isIdColumn) {
                        return (
                          <td key={colIndex} className="px-3 py-2 whitespace-nowrap text-center border border-gray-300 bg-gray-50">
                            <span className="text-sm font-mono font-bold text-blue-900">{record.id || value}</span>
                          </td>
                        );
                      }
                      return (
                        <td key={colIndex} className="px-3 py-2 text-sm text-gray-800 border border-gray-300 leading-snug">
                          {value ?? ''}
                        </td>
                      );
                    })}
                    <td className="px-2 py-1 text-center border border-gray-300">
                      <button onClick={() => onEdit && onEdit(record)} className="text-center cursor-pointer p-1.5 rounded hover:bg-gray-200 transition" title="Modify Record">
                        <i className="fa-solid fa-pen-to-square text-blue-600 hover:text-blue-800 text-base"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {processedRecords.length > 0 && (
           <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={processedRecords.length} itemsPerPage={rowsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setRowsPerPage} />
        )}
      </div>
    </div>
  );
};
export default RecordTable;