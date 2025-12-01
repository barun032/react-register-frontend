import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { registerTypes, receivePartTypes, statusTypes } from './data/registerData';
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

  // Initialize state using the custom hook for persistence
  const [allRecords, setAllRecords] = useLocalStorage('onlineRegister', {
    [registerTypes.RECEIVE]: {
      [receivePartTypes.PART_I]: [],
      [receivePartTypes.PART_II]: [],
      [receivePartTypes.PART_III]: [],
      [receivePartTypes.PART_IV]: []
    },
    [registerTypes.ISSUED]: []
  });

  // Helper to get records for the current view
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

  // HANDLER for creating a new record, including the cross-register update logic
  const handleNewRecord = (formData) => {

    // 1. Prepare new record data
    const newRecordId = getNextConsecutiveNumber(selectedRegister, selectedPart);

    const newRecord = {
      id: newRecordId,
      // Default status, assuming 'Pending' for new records
      status: statusTypes.PENDING,
      // Use the form date or today's date if not provided in the form
      date: formData.date || new Date().toISOString().split('T')[0],
      ...formData
    };

    // Keys and values for the potential Receive Register update
    const dispatchDate = newRecord.date;
    const dispatchMemoNo = String(newRecordId); // The Consecutive No. of the new Dispatch record

    // 2. Update the allRecords state immutably
    setAllRecords(prevRecords => {
      // Create a mutable copy of the overall state for easier manipulation
      const updatedRecords = {
        ...prevRecords,
        [registerTypes.RECEIVE]: { ...prevRecords[registerTypes.RECEIVE] }
      };

      if (selectedRegister === registerTypes.RECEIVE) {
        // Simple append for Receive Register
        updatedRecords[selectedRegister][selectedPart] = [
          ...updatedRecords[selectedRegister][selectedPart],
          newRecord
        ];
        console.log(`✅ New Receive Register record (ID: ${newRecordId}) added to ${selectedPart}.`);

      } else if (selectedRegister === registerTypes.ISSUED) {

        // Append the new Dispatch record
        updatedRecords[selectedRegister] = [
          ...updatedRecords[selectedRegister],
          newRecord
        ];

        // LINKAGE: Update Receive Register if reference is provided
        const refPart = formData.receiveRefPart;
        const refNo = formData.receiveRefNo;

        // Only proceed if both fields are filled
        if (refPart && refNo !== undefined && refNo !== null && String(refNo).trim() !== '') {
          const partRecords = updatedRecords[registerTypes.RECEIVE][refPart];

          if (partRecords && Array.isArray(partRecords)) {
            // Convert refNo to string and trim — safest way
            const searchId = String(refNo).trim();

            // Find exact match by id (as string)
            const matchIndex = partRecords.findIndex(record =>
              String(record.id).trim() === searchId
            );

            if (matchIndex !== -1) {
              const matchedRecord = partRecords[matchIndex];

              // Update the Receive Register record
              const updatedReceiveRecord = {
                ...matchedRecord,
                dispatchMemoNo: String(newRecordId),        // Memo No. = Dispatch Consecutive No.
                dispatchDate: newRecord.date,               // Dispatch Date
                status: statusTypes.COMPLETED               // Mark as replied
              };

              // Immutably update the array
              updatedRecords[registerTypes.RECEIVE][refPart] = [
                ...partRecords.slice(0, matchIndex),
                updatedReceiveRecord,
                ...partRecords.slice(matchIndex + 1)
              ];

              console.log(`LINKED: Receive #${searchId} (Part ${refPart}) → Updated with Memo No. ${newRecordId}`);
            } else {
              console.warn(`NOT FOUND: No Receive Record with ID ${searchId} in ${refPart}`);
            }
          }
        }
      }

      return updatedRecords;
    });

    // 4. Close the form
    setIsFormOpen(false);
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
        nextConsecutiveNumber={getNextConsecutiveNumber(selectedRegister, selectedPart)}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleNewRecord}
      />
    </div>
  );
}

export default App;