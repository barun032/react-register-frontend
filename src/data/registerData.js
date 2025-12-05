export const registerHasStatus = (registerType) => {
  return registerType === registerTypes.RECEIVE;
};

// src/data/registerData.js
export const registerTypes = {
  RECEIVE: 'Receive Register',
  ISSUED: 'Dispatch Register'
};

// Update part types for Receive Register to Roman numerals
export const receivePartTypes = {
  PART_I: 'Part I',
  PART_II: 'Part II', 
  PART_III: 'Part III',
  PART_IV: 'Part IV'
};

export const registerTableHeaders = {
  [registerTypes.RECEIVE]: [
    // Row 1 - Main headers with rowspan
    [
      { name: 'Consecutive No.', rowspan: 2 },
      { name: 'Date of receipt in office', rowspan: 2 },
      { name: 'Letter etc.', colspan: 3 },
      { name: 'Short subject', rowspan: 2 },
      { name: 'Remainders', colspan: 2 },
      { name: 'Where the letter is placed', colspan: 4 },
      { name: 'Type of action', rowspan: 2 },
      { name: 'Dispatch Register', colspan: 2 },
      { name: 'Endorsed To', rowspan: 2 }
    ],
    // Row 2 - Subheaders
    [
      { name: 'From whom received' },
      { name: 'Reference Number' },
      { name: 'Reference Date' },
      { name: 'Reminder Number' },
      { name: 'Reminder Date' },
      { name: 'File No.' },
      { name: 'Sl. No.' },
      { name: 'No. of the Collection' },
      { name: 'No. of the file within the collection' },
      { name: 'Memo No.'},
      { name: 'Dispatch Date'},
    ]
  ],
  [registerTypes.ISSUED]: [
    // Row 1 - Main headers with rowspan
    [
      { name: 'Consecutive No.', rowspan: 2 },
      { name: 'Date', rowspan: 2 },
      { name: 'To whom addressed', rowspan: 2 },
      { name: 'Short subject', rowspan: 2 },
      { name: 'Where the draft is placed', colspan: 3 },
      { name: 'No. and date of reply receive', rowspan: 2 },
      { name: 'Receive Register Ref.', colspan: 2 },
      { name: 'Reminder', colspan: 2 },
      { name: 'Value of Stamp.', colspan: 2 },
      { name: 'Remarks', rowspan: 2 },
      { name: 'Name of the Officer.', rowspan: 2 }
    ],
    // Row 2 - Subheaders
    [
      { name: 'File No. & Serial No.' },
      { name: 'No. & title of collection' },
      { name: 'No. of file within the collection' },
      {name: 'Part No.'},
      {name: 'Ref No.'},
      { name: 'Reminder No.' },
      { name: 'Reminder Date' },
      { name: 'Rs.' },
      { name: 'P.' }
    ]
  ]
};

// Define the actual data fields that correspond to each header
export const registerFieldMappings = {
  [registerTypes.RECEIVE]: {
    'Consecutive No.': 'id',
    'Date of receipt in office': 'date',
    'From whom received': 'from',
    'Reference Number': 'referenceNo',
    'Reference Date': 'referenceDate',
    'Short subject': 'subject',
    'Reminder Number': 'reminderNumber',
    'Reminder Date': 'reminderDate',
    'File No.': 'fileNo',
    'Sl. No.': 'serialNo',
    'No. of the Collection': 'collectionNumber',
    'No. of the file within the collection': 'fileInCollection',
    'Type of action': 'actionType',
    'Memo No.': 'dispatchMemoNo',
    'Dispatch Date': 'dispatchDate',
    'Endorsed To': 'endorsedTo'
  },
  [registerTypes.ISSUED]: {
  'Consecutive No.': 'id',
  'Date': 'date',
  'To whom addressed': 'to',
  'Short subject': 'subject',
  'File No. & Serial No.': 'fileSerialNo',
  'No. & title of collection': 'collectionTitle',
  'No. of file within the collection': 'fileInCollection',
  'No. and date of reply receive': 'replyDetails',
  'Part No.': 'receiveRefPart',
  'Ref No.': 'receiveRefNo',
  'Reminder No.': 'reminderNumber',
  'Reminder Date': 'reminderDate',
  'Rs.': 'stampRupees',
  'P.': 'stampPaise',
  'Remarks': 'remarks',
  'Name of the Officer.': 'officerName'
}
};

// Updated form fields to match the table structure exactly
export const registerFields = {
  [registerTypes.RECEIVE]: [
    // Note: 'Consecutive No.' is auto-generated as 'id', so it's not in the form
    { name: 'from', label: 'From whom received', type: 'textarea', rows: 3 },
    { name: 'date', label: 'Date of receipt in office', type: 'date' },
    { name: 'referenceNo', label: 'Reference Number', type: 'text' },
    { name: 'referenceDate', label: 'Reference Date', type: 'date' },
    { name: 'subject', label: 'Short subject', type: 'textarea', rows: 3 },
    { name: 'reminderNumber', label: 'Reminder Number', type: 'text' },
    { name: 'reminderDate', label: 'Reminder Date', type: 'date' },
    { name: 'fileNo', label: 'File No.', type: 'text' },
    { name: 'serialNo', label: 'Serial No.', type: 'text' },
    { name: 'collectionNumber', label: 'No. of the Collection', type: 'text' },
    { name: 'fileInCollection', label: 'No. of file within the collection', type: 'text' },
    { 
      name: 'actionType', 
      label: 'Type of action', 
      type: 'select', 
      options: ['Returnable', 'Not Returnable', 'Attached to File']
    },
    { name: 'dispatchMemoNo', label: 'Dispatch Memo No.', type: 'number' },
    { name: 'dispatchDate', label: 'Dispatch Date', type: 'date' },
    { 
      name: 'endorsedTo', 
      label: 'Endorsed To', 
      type: 'select', 
      options: [
        'SI Rupali Santra',
        'SI Bikash Sen',
        'SI Sadhana Singha', 
        'SI Ummey Salma',
      ]
    }
  ],
  [registerTypes.ISSUED]: [
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'to', label: 'To whom addressed', type: 'textarea', rows: 3 },
    { name: 'subject', label: 'Short subject', type: 'textarea', rows: 3 },
    { name: 'fileSerialNo', label: 'File No. & Serial No.', type: 'text' },
    { name: 'collectionTitle', label: 'No. & title of collection', type: 'text' },
    { name: 'fileInCollection', label: 'No. of file within the collection', type: 'text' },
    { name: 'replyDetails', label: 'No. and date of reply receive', type: 'text' },

    // REPLACE the single field with TWO proper fields
    {
      name: 'receiveRefPart',
      label: 'Receive Register Part',
      type: 'select',
      options: Object.values(receivePartTypes), // ['Part I', 'Part II', ...]
      required: false,
      description: 'Select the part of Receive Register this dispatch replies to'
    },
    {
      name: 'receiveRefNo',
      label: 'Receive Register Ref. No.',
      type: 'number',
      required: false,
      description: 'Enter the Consecutive No. from the selected Receive Register Part'
    },

    { name: 'reminderNumber', label: 'Reminder Number', type: 'text' },
    { name: 'reminderDate', label: 'Reminder Date', type: 'date' },
    { name: 'stampRupees', label: 'Stamp Value (Rs.)', type: 'number', min: 0 },
    { name: 'stampPaise', label: 'Stamp Value (P.)', type: 'number', min: 0, max: 99 },
    {
      name: 'officerName',
      label: 'Name of the Officer',
      type: 'select',
      options: ['SI Rupali Santra', 'SI Bikash Sen', 'SI Sadhana Singha', 'SI Ummey Salma']
    },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ]
};

export const statusTypes = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  ACTION_TAKEN: 'Action Taken',       
  COMPLETED: 'Completed'
};