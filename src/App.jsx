// src/App.jsx
import React, { useState } from 'react';
import { registerTypes } from './data/registerData';
import { useRegister } from './context/RegisterContext';

import Header from './components/Header';
import StatusCards from './components/StatusCards';
import RecordTable from './components/RecordTable';
import CreateForm from './components/CreateForm';
import PrintView from './components/PrintView';
import PrintRangeModal from './components/PrintRangeModal'; 

function App() {
  const { 
    selectedRegister, 
    selectedPart, 
    currentRecords,
    addNewRecord,
    getNextConsecutiveNumber
  } = useRegister();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPrintRangeModalOpen, setIsPrintRangeModalOpen] = useState(false);
  const [recordsToPrint, setRecordsToPrint] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintClick = () => setIsPrintRangeModalOpen(true);

  const handlePrintRange = (selectedRecords) => {
    setRecordsToPrint(selectedRecords);
    setIsPrinting(true);
    setIsPrintRangeModalOpen(false); // Close the modal
  };

  const closePrintView = () => {
    setIsPrinting(false);
    setRecordsToPrint([]);
  };

  const handleFormSubmit = (formData) => {
    addNewRecord(formData);
    setIsFormOpen(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCreateClick={() => setIsFormOpen(true)}
      />

      <main className="max-w-7xl mx-auto">
        <StatusCards /> 
        
        <RecordTable 
          onPrint={handlePrintClick}
        />
      </main>

      <CreateForm
        selectedRegister={selectedRegister}
        selectedPart={selectedPart}
        nextConsecutiveNumber={getNextConsecutiveNumber()}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <PrintRangeModal
        isOpen={isPrintRangeModalOpen}
        onClose={() => setIsPrintRangeModalOpen(false)}
        totalRecords={currentRecords}
        onConfirm={handlePrintRange}
      />
    </div>
  );
}

export default App;