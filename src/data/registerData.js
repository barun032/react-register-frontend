// src/data/registerData.js
export const registerTypes = {
  DISPATCH: 'Dispatch Register',
  RECEIVE: 'Receive Register',
  ISSUED: 'Issued Register'
};

export const registerTableHeaders = {
  [registerTypes.DISPATCH]: [
    // Row 1 - Main headers with rowspan
    [
      { name: 'Consecutive No.', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Date', rowspan: 2, className: 'bg-blue-100' },
      { name: 'To whom addressed', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Short subject', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Where the draft is placed', colspan: 3, className: 'bg-green-100' },
      { name: 'No. and date of reply received', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Reminder', colspan: 2, className: 'bg-yellow-100' },
      { name: 'Value of Stamp', colspan: 2, className: 'bg-purple-100' },
      { name: 'Remarks', rowspan: 2, className: 'bg-blue-100' }
    ],
    // Row 2 - Subheaders
    [
      { name: 'File No. & Serial No.', className: 'bg-green-50' },
      { name: 'No. & title of collection', className: 'bg-green-50' },
      { name: 'No. of file within the collection', className: 'bg-green-50' },
      { name: 'No.', className: 'bg-yellow-50' },
      { name: 'Date', className: 'bg-yellow-50' },
      { name: 'Rs.', className: 'bg-purple-50' },
      { name: 'P.', className: 'bg-purple-50' }
    ]
  ],
  [registerTypes.RECEIVE]: [
    // Row 1 - Main headers with rowspan
    [
      { name: 'Consecutive No.', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Date', rowspan: 2, className: 'bg-blue-100' },
      { name: 'From whom received', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Short subject', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Reference details', colspan: 3, className: 'bg-green-100' },
      { name: 'Action Required', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Follow-up', colspan: 2, className: 'bg-yellow-100' },
      { name: 'Status', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Remarks', rowspan: 2, className: 'bg-blue-100' }
    ],
    // Row 2 - Subheaders
    [
      { name: 'Reference No.', className: 'bg-green-50' },
      { name: 'Reference Date', className: 'bg-green-50' },
      { name: 'Department', className: 'bg-green-50' },
      { name: 'Follow-up Date', className: 'bg-yellow-50' },
      { name: 'Follow-up Type', className: 'bg-yellow-50' }
    ]
  ],
  [registerTypes.ISSUED]: [
    // Row 1 - Main headers with rowspan
    [
      { name: 'Consecutive No.', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Date', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Item Details', colspan: 3, className: 'bg-green-100' },
      { name: 'Distribution Details', colspan: 2, className: 'bg-yellow-100' },
      { name: 'Authorization', colspan: 2, className: 'bg-purple-100' },
      { name: 'Status', rowspan: 2, className: 'bg-blue-100' },
      { name: 'Remarks', rowspan: 2, className: 'bg-blue-100' }
    ],
    // Row 2 - Subheaders
    [
      { name: 'Item Name', className: 'bg-green-50' },
      { name: 'Quantity', className: 'bg-green-50' },
      { name: 'Unit', className: 'bg-green-50' },
      { name: 'Issued To', className: 'bg-yellow-50' },
      { name: 'Department', className: 'bg-yellow-50' },
      { name: 'Authorized By', className: 'bg-purple-50' },
      { name: 'Authorization Date', className: 'bg-purple-50' }
    ]
  ]
};

// Define the actual data fields that correspond to each header
export const registerFieldMappings = {
  [registerTypes.DISPATCH]: {
    'Consecutive No.': 'id',
    'Date': 'date',
    'To whom addressed': 'to',
    'Short subject': 'subject',
    'File No. & Serial No.': 'fileNo',
    'No. & title of collection': 'collectionTitle',
    'No. of file within the collection': 'fileNumber',
    'No. and date of reply received': 'replyDetails',
    'No.': 'reminderNumber',
    'Date': 'reminderDate',
    'Rs.': 'stampRupees',
    'P.': 'stampPaise',
    'Remarks': 'remarks'
  },
  [registerTypes.RECEIVE]: {
    'Consecutive No.': 'id',
    'Date': 'date',
    'From whom received': 'from',
    'Short subject': 'subject',
    'Reference No.': 'referenceNo',
    'Reference Date': 'referenceDate',
    'Department': 'department',
    'Action Required': 'actionRequired',
    'Follow-up Date': 'followupDate',
    'Follow-up Type': 'followupType',
    'Status': 'status',
    'Remarks': 'remarks'
  },
  [registerTypes.ISSUED]: {
    'Consecutive No.': 'id',
    'Date': 'date',
    'Item Name': 'itemName',
    'Quantity': 'quantity',
    'Unit': 'unit',
    'Issued To': 'issuedTo',
    'Department': 'department',
    'Authorized By': 'authorizedBy',
    'Authorization Date': 'authorizationDate',
    'Status': 'status',
    'Remarks': 'remarks'
  }
};

// Updated form fields to match the new structure
export const registerFields = {
  [registerTypes.DISPATCH]: [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'to', label: 'To whom addressed', type: 'text', required: true },
    { name: 'subject', label: 'Short subject', type: 'text', required: true },
    { name: 'fileNo', label: 'File No. & Serial No.', type: 'text' },
    { name: 'collectionTitle', label: 'No. & title of collection', type: 'text' },
    { name: 'fileNumber', label: 'No. of file within the collection', type: 'text' },
    { name: 'replyDetails', label: 'No. and date of reply received', type: 'text' },
    { name: 'reminderNumber', label: 'Reminder No.', type: 'number' },
    { name: 'reminderDate', label: 'Reminder Date', type: 'date' },
    { name: 'stampRupees', label: 'Stamp Value (Rs.)', type: 'number' },
    { name: 'stampPaise', label: 'Stamp Value (P.)', type: 'number' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ],
  [registerTypes.RECEIVE]: [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'from', label: 'From whom received', type: 'text', required: true },
    { name: 'subject', label: 'Short subject', type: 'text', required: true },
    { name: 'referenceNo', label: 'Reference No.', type: 'text' },
    { name: 'referenceDate', label: 'Reference Date', type: 'date' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'actionRequired', label: 'Action Required', type: 'text' },
    { name: 'followupDate', label: 'Follow-up Date', type: 'date' },
    { name: 'followupType', label: 'Follow-up Type', type: 'text' },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      options: ['Pending', 'Completed', 'Acknowledged'],
      required: true,
      default: 'Pending'
    },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ],
  [registerTypes.ISSUED]: [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'itemName', label: 'Item Name', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'unit', label: 'Unit', type: 'text', required: true },
    { name: 'issuedTo', label: 'Issued To', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'authorizedBy', label: 'Authorized By', type: 'text', required: true },
    { name: 'authorizationDate', label: 'Authorization Date', type: 'date', required: true },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      options: ['Pending', 'Completed', 'Partially Issued'],
      required: true,
      default: 'Pending'
    },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ]
};

export const statusTypes = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  ACKNOWLEDGED: 'Acknowledged',
  PARTIALLY_ISSUED: 'Partially Issued'
};