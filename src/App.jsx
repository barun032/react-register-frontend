// src/App.jsx
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { registerTypes, receivePartTypes, statusTypes } from './data/registerData';
import Header from './components/Header';
import StatusCards from './components/StatusCards';
import RecordTable from './components/RecordTable';
import CreateForm from './components/CreateForm';
import PrintView from './components/PrintView';
// 1. IMPORT THE SEPARATE MODAL FILE
import PrintRangeModal from './components/PrintRangeModal'; 

// 2. DELETED THE INLINE "const PrintRangeModal = ..." COMPONENT FROM HERE

function App() {
  const [selectedRegister, setSelectedRegister] = useState(registerTypes.RECEIVE);
  const [selectedPart, setSelectedPart] = useState(receivePartTypes.PART_I);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Print states
  const [isPrintRangeModalOpen, setIsPrintRangeModalOpen] = useState(false);
  const [recordsToPrint, setRecordsToPrint] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  // LocalStorage persistence
  const [allRecords, setAllRecords] = useLocalStorage('onlineRegister', {
    [registerTypes.RECEIVE]: {
      [receivePartTypes.PART_I]: [],
      [receivePartTypes.PART_II]: [],
      [receivePartTypes.PART_III]: [],
      [receivePartTypes.PART_IV]: []
    },
    [registerTypes.ISSUED]: []
  });

  // Get current visible records
  const getCurrentRecords = () => {
    if (selectedRegister === registerTypes.RECEIVE) {
      return allRecords[selectedRegister]?.[selectedPart] || [];
    }
    return allRecords[selectedRegister] || [];
  };

  const currentRecords = getCurrentRecords();

  // Next Consecutive Number
  const getNextConsecutiveNumber = (register, part) => {
    const records = register === registerTypes.RECEIVE
      ? allRecords[register]?.[part] || []
      : allRecords[register] || [];
    const maxId = records.reduce((max, r) => Math.max(max, parseInt(r.id || 0)), 0);
    return maxId + 1;
  };

  // Handlers
  const handleRegisterChange = (register) => {
    setSelectedRegister(register);
    if (register === registerTypes.RECEIVE) {
      setSelectedPart(receivePartTypes.PART_I);
    }
  };

  const handlePartChange = (part) => setSelectedPart(part);

  const handlePrintClick = () => {
    setIsPrintRangeModalOpen(true);
  };

  const handlePrintRange = (selectedRecords) => {
    setRecordsToPrint(selectedRecords);
    setIsPrinting(true);
  };

  const closePrintView = () => {
    setIsPrinting(false);
    setRecordsToPrint([]);
  };

  // Create record handler
  const handleNewRecord = (formData) => {
    const newRecordId = getNextConsecutiveNumber(selectedRegister, selectedPart);
    const newRecord = {
      id: newRecordId,
      status: statusTypes.PENDING,
      date: formData.date || new Date().toISOString().split('T')[0],
      ...formData
    };

    setAllRecords(prev => {
      const updated = { ...prev, [registerTypes.RECEIVE]: { ...prev[registerTypes.RECEIVE] } };

      if (selectedRegister === registerTypes.RECEIVE) {
        updated[selectedRegister][selectedPart] = [...(updated[selectedRegister][selectedPart] || []), newRecord];
      } else if (selectedRegister === registerTypes.ISSUED) {
        updated[selectedRegister] = [...(updated[selectedRegister] || []), newRecord];

        const refPart = formData.receiveRefPart;
        const refNo = String(formData.receiveRefNo || '').trim();

        if (refPart && refNo) {
          const partRecords = updated[registerTypes.RECEIVE][refPart] || [];
          const idx = partRecords.findIndex(r => String(r.id).trim() === refNo);
          if (idx !== -1) {
            partRecords[idx] = {
              ...partRecords[idx],
              dispatchMemoNo: String(newRecordId),
              dispatchDate: newRecord.date,
              status: statusTypes.COMPLETED
            };
            updated[registerTypes.RECEIVE][refPart] = [...partRecords];
          }
        }
      }
      return updated;
    });

    setIsFormOpen(false);
  };

  // ONLY render PrintView when printing
  if (isPrinting) {
    return (
      <PrintView
        selectedRegister={selectedRegister}
        selectedPart={selectedRegister === registerTypes.RECEIVE ? selectedPart : null}
        records={recordsToPrint}
        onClose={closePrintView}
      />
    );
  }

  // Normal UI when NOT printing
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedRegister={selectedRegister}
        selectedPart={selectedPart}
        onRegisterChange={handleRegisterChange}
        onPartChange={handlePartChange}
        onCreateClick={() => setIsFormOpen(true)}
      />

      <main className="max-w-7xl mx-auto">
        <StatusCards
          records={currentRecords}
          selectedRegister={selectedRegister}
          selectedPart={selectedPart}
        />

        <RecordTable
          selectedRegister={selectedRegister}
          records={currentRecords}
          onPrint={handlePrintClick}
        />
      </main>

      {/* Modals */}
      <CreateForm
        selectedRegister={selectedRegister}
        selectedPart={selectedPart}
        nextConsecutiveNumber={getNextConsecutiveNumber(selectedRegister, selectedPart)}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleNewRecord}
      />

      {/* 3. UPDATED PROPS TO MATCH EXTERNAL COMPONENT */}
      <PrintRangeModal
        isOpen={isPrintRangeModalOpen}
        onClose={() => setIsPrintRangeModalOpen(false)}
        totalRecords={currentRecords} // Changed from allRecords/currentRecords complexity to just passing the list
        onConfirm={handlePrintRange}  // Changed from onPrintRange to onConfirm
      />
    </div>
  );
}

export default App;