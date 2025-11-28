// src/App.js
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { registerTypes, receivePartTypes } from './data/registerData';
import Header from './components/Header';
import StatusCards from './components/StatusCards';
import RecordTable from './components/RecordTable';
import CreateForm from './components/CreateForm';
import PrintView from './components/PrintView';

function App() {
  const [selectedRegister, setSelectedRegister] = useState(registerTypes.RECEIVE);
  const [selectedPart, setSelectedPart] = useState(receivePartTypes.PART_I);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPrintView, setIsPrintView] = useState(false);
  
  const [allRecords, setAllRecords] = useLocalStorage('onlineRegister', {
    [registerTypes.RECEIVE]: {
      [receivePartTypes.PART_I]: [],
      [receivePartTypes.PART_II]: [],
      [receivePartTypes.PART_III]: [],
      [receivePartTypes.PART_IV]: []
    },
    [registerTypes.ISSUED]: []
  });

  // Get current records based on register and part
  const getCurrentRecords = () => {
    if (selectedRegister === registerTypes.RECEIVE) {
      return allRecords[selectedRegister]?.[selectedPart] || [];
    }
    return allRecords[selectedRegister] || [];
  };

  const currentRecords = getCurrentRecords();

  // Function to get next consecutive number
  const getNextConsecutiveNumber = () => {
    if (selectedRegister === registerTypes.RECEIVE) {
      const partRecords = allRecords[selectedRegister]?.[selectedPart] || [];
      return partRecords.length + 1;
    } else {
      const issuedRecords = allRecords[selectedRegister] || [];
      return issuedRecords.length + 1;
    }
  };

  const handleCreateRecord = (newRecord) => {
    if (selectedRegister === registerTypes.RECEIVE) {
      setAllRecords(prev => ({
        ...prev,
        [selectedRegister]: {
          ...prev[selectedRegister],
          [selectedPart]: [...(prev[selectedRegister]?.[selectedPart] || []), newRecord]
        }
      }));
    } else {
      setAllRecords(prev => ({
        ...prev,
        [selectedRegister]: [...prev[selectedRegister], newRecord]
      }));
    }
  };

  const handleRegisterChange = (register) => {
    setSelectedRegister(register);
    // Reset to Part I when switching to Receive Register
    if (register === registerTypes.RECEIVE) {
      setSelectedPart(receivePartTypes.PART_I);
    }
  };

  const handlePartChange = (part) => {
    setSelectedPart(part);
  };

  const handlePrint = () => {
    setIsPrintView(true);
  };

  const closePrintView = () => {
    setIsPrintView(false);
  };

  if (isPrintView) {
    return (
      <PrintView
        selectedRegister={selectedRegister}
        selectedPart={selectedPart}
        records={currentRecords}
        onClose={closePrintView}
      />
    );
  }

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
          onPrint={handlePrint}
        />
      </main>
      
      <CreateForm
        selectedRegister={selectedRegister}
        selectedPart={selectedPart}
        nextConsecutiveNumber={getNextConsecutiveNumber()}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateRecord}
      />
    </div>
  );
}

export default App;