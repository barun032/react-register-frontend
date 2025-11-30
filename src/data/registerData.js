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
      { name: 'Part No.' },
      { name: 'Ref No.' },
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
    'Part No.': 'ReplyPartNo',
    'Ref No.': 'receiveRef',
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
    { name: 'date', label: 'Date of receipt in office', type: 'date', required: true },
    { name: 'from', label: 'From whom received', type: 'text', required: true },
    { name: 'referenceNo', label: 'Reference Number', type: 'text' },
    { name: 'referenceDate', label: 'Reference Date', type: 'date' },
    { name: 'subject', label: 'Short subject', type: 'textarea', rows: 3, required: true },
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
      options: ['Returnable', 'Not Returnable', 'Attached to File'],
      required: true
    },
    { name: 'dispatchMemoNo', label: 'Dispatch Memo No.', type: 'text' },
    { name: 'dispatchDate', label: 'Dispatch Date', type: 'date' },
    { 
      name: 'endorsedTo', 
      label: 'Endorsed To', 
      type: 'select', 
      options: [
        'Rupali Santra',
        'Bikash Sen',
        'Sadhana Singha', 
        'Ummey Salma',
      ],
      required: true
    }
  ],
  [registerTypes.ISSUED]: [
    // Note: 'Consecutive No.' is auto-generated as 'id', so it's not in the form
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'to', label: 'To whom addressed', type: 'text', required: true },
    { name: 'subject', label: 'Short subject', type: 'textarea', rows: 3, required: true },
    { name: 'fileSerialNo', label: 'File No. & Serial No.', type: 'text' },
    { name: 'collectionTitle', label: 'No. & title of collection', type: 'text' },
    { name: 'fileInCollection', label: 'No. of file within the collection', type: 'text' },
    { name: 'replyDetails', label: 'No. and date of reply receive', type: 'text' },
    { name: 'receiveRef', label: 'Receive Register Ref.', type: 'text' },
    { name: 'reminderNumber', label: 'Reminder Number', type: 'text' },
    { name: 'reminderDate', label: 'Reminder Date', type: 'date' },
    { name: 'stampRupees', label: 'Stamp Value (Rs.)', type: 'number', min: 0 },
    { name: 'stampPaise', label: 'Stamp Value (P.)', type: 'number', min: 0, max: 99 },
    { name: 'remarks', label: 'Remarks', type: 'textarea' },
    { 
      name: 'officerName', 
      label: 'Name of the Officer', 
      type: 'select',
      options: [
        'Rupali Santra',
        'Bikash Sen',
        'Sadhana Singha', 
        'Ummey Salma',
      ],
      required: true
    }
  ]
};

export const registerFieldGroups = {
  [registerTypes.RECEIVE]: [
    {
      title: 'Core Receipt Details (Letter etc.)',
      fields: [
        { name: 'date', label: 'Date of receipt in office', type: 'date', required: true },
        { name: 'from', label: 'From whom received', type: 'text', required: true },
        { name: 'referenceNo', label: 'Reference Number', type: 'text' },
        { name: 'referenceDate', label: 'Reference Date', type: 'date' },
        { name: 'subject', label: 'Short subject', type: 'textarea', rows: 3, required: true },
      ]
    },
    {
      title: 'Reminder Details',
      fields: [
        { name: 'reminderNumber', label: 'Reminder Number', type: 'text' },
        { name: 'reminderDate', label: 'Reminder Date', type: 'date' },
      ]
    },
    {
      title: 'File Placement Details (Where the letter is placed)',
      fields: [
        { name: 'fileNo', label: 'File No.', type: 'text' },
        { name: 'serialNo', label: 'Sl. No.', type: 'text' },
        { name: 'collectionNumber', label: 'No. of the Collection', type: 'text' },
        { name: 'fileInCollection', label: 'No. of file within the collection', type: 'text' },
      ]
    },
    {
      title: 'Action & Dispatch Details',
      fields: [
        { 
          name: 'actionType', 
          label: 'Type of action', 
          type: 'select', 
          options: ['Returnable', 'Not Returnable', 'Attached to File'],
          required: true
        },
        { name: 'dispatchMemoNo', label: 'Dispatch Memo No.', type: 'text' },
        { name: 'dispatchDate', label: 'Dispatch Date', type: 'date' },
        { 
          name: 'endorsedTo', 
          label: 'Endorsed To', 
          type: 'select', 
          options: ['SI Rupali Santra', 'SI Bikash Sen', 'SI Sadhana Singha', 'SI Ummey Salma'],
          required: true
        }
      ]
    }
  ],
  [registerTypes.ISSUED]: [
    {
      title: 'Core Dispatch Details',
      fields: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'to', label: 'To whom addressed', type: 'text', required: true },
        { name: 'subject', label: 'Short subject', type: 'textarea', rows: 3, required: true },
      ]
    },
    {
      title: 'File Placement Details (Where the draft is placed)',
      fields: [
        { name: 'fileSerialNo', label: 'File No. & Serial No.', type: 'text' },
        { name: 'collectionTitle', label: 'No. & title of collection', type: 'text' },
        { name: 'fileInCollection', label: 'No. of file within the collection', type: 'text' },
      ]
    },
    {
      title: 'Reply & Receive Reference',
      fields: [
        { name: 'replyDetails', label: 'No. and date of reply receive', type: 'text' },
        { name: 'receiveRef', label: 'Receive Register Ref.', type: 'text' },
        { 
          name: 'ReplyPartNo', 
          label: 'Part No.', 
          type: 'select', 
          options: ['I', 'II', 'III', 'IV'],
          required: true
        }
      ]
    },
    {
      title: 'Reminder Details',
      fields: [
        { name: 'reminderNumber', label: 'Reminder Number', type: 'text' },
        { name: 'reminderDate', label: 'Reminder Date', type: 'date' },
      ]
    },
    {
      title: 'Stamp Value',
      fields: [
        { name: 'stampRupees', label: 'Stamp Value (Rs.)', type: 'number', min: 0 },
        { name: 'stampPaise', label: 'Stamp Value (P.)', type: 'number', min: 0, max: 99 },
      ]
    },
    {
      title: 'Finalization',
      fields: [
        { 
          name: 'officerName', 
          label: 'Name of the Officer', 
          type: 'select',
          options: ['SI Rupali Santra', 'SI Bikash Sen', 'SI Sadhana Singha', 'SI Ummey Salma'],
          required: true
        },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    }
  ]
};

export const statusTypes = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  ACKNOWLEDGED: 'Acknowledged',
  PARTIALLY_ISSUED: 'Partially Issued'
};