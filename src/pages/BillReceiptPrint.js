import React from 'react';

// Render receipt HTML string for printing (used by Print button)
export function renderReceiptHtml({ receiptNo = '', receiptDateTime = '', partyName = '', selectedPatient = {}, totals = {}, payType = 'CASH', billDetails = {} } = {}) {
  const date = new Date().toLocaleDateString();
  return `
    <html>
    <head>
      <title>Receipt ${receiptNo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px }
        td, th { padding: 6px; border: 1px solid #000; font-size: 12px; }
        .no-border td { border: none; }
        .right { text-align: right; }
        .muted { color: #666; font-size: 12px }
      </style>
    </head>
    <body>
      <div class="header"><h2>Receipt</h2></div>
      <table>
        <tr><th>Receipt No</th><td>${receiptNo}</td><th>Receipt Date</th><td>${receiptDateTime}</td></tr>
        <tr><th>Patient</th><td colspan="3">${partyName}</td></tr>
        <tr><th>Patient ID</th><td>${selectedPatient?.patientId || ''}</td><th>Age/Sex</th><td>${selectedPatient ? `${selectedPatient.ageYMD || ''} / ${selectedPatient.sex || ''}` : ''}</td></tr>
        <tr><th>Total Amount</th><td>${totals.totalAmount}</td><th>Less Discount</th><td>${totals.totalDiscount}</td></tr>
        <tr><th>Net Amount</th><td>${totals.totalNet}</td><th>Pay Type</th><td>${payType}</td></tr>
      </table>

      <p><strong>Received Amount :</strong> Rs ${totals.totalNet} Only.</p>
      <p style="margin-top:40px;">Received With Thanks.</p>

      <div style="margin-top:60px; display:flex; justify-content:space-between;">
        <div>Prepared by: Reception</div>
        <div>Date: ${date}</div>
      </div>
    </body>
    </html>
  `;
}

// React component rendering the same receipt (useful if you want an on-page preview)
export default function BillReceiptPrint({ receiptNo, receiptDateTime, partyName, selectedPatient, totals, payType, billDetails }) {
  return (
    <div style={{ padding: 20, color: '#000', fontFamily: 'Arial' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2>Receipt</h2>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <tbody>
          <tr>
            <th style={{ padding: 6, border: '1px solid #000' }}>Receipt No</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{receiptNo}</td>
            <th style={{ padding: 6, border: '1px solid #000' }}>Receipt Date</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{receiptDateTime}</td>
          </tr>
          <tr>
            <th style={{ padding: 6, border: '1px solid #000' }}>Patient</th>
            <td style={{ padding: 6, border: '1px solid #000' }} colSpan={3}>{partyName}</td>
          </tr>
          <tr>
            <th style={{ padding: 6, border: '1px solid #000' }}>Patient ID</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{selectedPatient?.patientId || ''}</td>
            <th style={{ padding: 6, border: '1px solid #000' }}>Age/Sex</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{selectedPatient ? `${selectedPatient.ageYMD || ''} / ${selectedPatient.sex || ''}` : ''}</td>
          </tr>
          <tr>
            <th style={{ padding: 6, border: '1px solid #000' }}>Total Amount</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{totals.totalAmount}</td>
            <th style={{ padding: 6, border: '1px solid #000' }}>Less Discount</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{totals.totalDiscount}</td>
          </tr>
          <tr>
            <th style={{ padding: 6, border: '1px solid #000' }}>Net Amount</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{totals.totalNet}</td>
            <th style={{ padding: 6, border: '1px solid #000' }}>Pay Type</th>
            <td style={{ padding: 6, border: '1px solid #000' }}>{payType}</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Received Amount :</strong> Rs {totals.totalNet} Only.</p>
      <p style={{ marginTop: 40 }}>Received With Thanks.</p>

      <div style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between' }}>
        <div>Prepared by: Reception</div>
        <div>Date: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  );
}
