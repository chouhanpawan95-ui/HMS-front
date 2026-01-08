import React from 'react';

// Helper: convert number to words (Indian style)
function numberToWordsIndian(num) {
  if (num === 0) return 'zero';
  const a = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const b = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

  function twoDigit(n) {
    if (n < 20) return a[n];
    const tens = Math.floor(n / 10);
    const units = n % 10;
    return b[tens] + (units ? ' ' + a[units] : '');
  }

  function threeDigit(n) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    return (h ? a[h] + ' hundred' + (rest ? ' ' : '') : '') + (rest ? twoDigit(rest) : '');
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num = num % 10000000;
  const lakh = Math.floor(num / 100000);
  num = num % 100000;
  const thousand = Math.floor(num / 1000);
  num = num % 1000;
  const hundred = num;

  if (crore) words += threeDigit(crore) + ' crore ';
  if (lakh) words += threeDigit(lakh) + ' lakh ';
  if (thousand) words += threeDigit(thousand) + ' thousand ';
  if (hundred) words += threeDigit(hundred);

  return words.trim();
}

function toRupeeWords(amount) {
  if (!isFinite(amount)) return '';
  const parts = Number(amount).toFixed(2).split('.');
  const intPart = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);
  const intWords = numberToWordsIndian(intPart) || 'zero';
  if (paise > 0) {
    const paiseWords = numberToWordsIndian(paise);
    return `Rupees ${intWords} and ${paiseWords} Paise`;
  }
  return `Rupees ${intWords}`;
}

export function renderBillHtml({ billNo = '', billDateTime = '', patientName = '', patient = {}, totals = {}, tableRows = [], paidAmount = 0, billDetails = {} } = {}) {
  const hospitalName = billDetails?.HospitalName || 'TRINITY EYE HOSPITAL';
  const address = billDetails?.Address || patient?.address || '';
  const patientId = patient?.patientId || billDetails?.PatientID || '';
  const ageSex = patient ? `${patient.ageYMD || ''} / ${patient.sex || ''}` : (billDetails?.AgeSex || '');

  const rows = (Array.isArray(tableRows) && tableRows.length > 0) ? tableRows : (billDetails?.items || []);

  let itemsHtml = '';
  if (rows && rows.length > 0) {
    itemsHtml = rows.map((r, idx) => {
      const serviceName = r.ServiceName || r.service || r.description || '';
      const rateNum = Number(r.RateGeneral || r.Rate || r.rate || 0);
      const rate = rateNum.toFixed(2);
      const qty = Number(r.Qty || r.Unit || r.qty || 1);
      const amount = (rateNum * qty).toFixed(2);
      return `<tr><td style="text-align:center;">${idx + 1}</td><td>${serviceName}</td><td style="text-align:right;">${rate}</td><td style="text-align:center;">${qty}</td><td style="text-align:right;">${amount}</td></tr>`;
    }).join('\n');
  } else {
    itemsHtml = `<tr><td style="text-align:center;">1</td><td>${billDetails?.ServiceName || 'Services'}</td><td style="text-align:right;">${Number(totals.totalAmount || 0).toFixed(2)}</td><td style="text-align:center;">1</td><td style="text-align:right;">${Number(totals.totalAmount || 0).toFixed(2)}</td></tr>`;
  }

  const totalAmount = Number(totals.totalAmount || 0).toFixed(2);
  const totalDiscount = Number(totals.totalDiscount || 0).toFixed(2);
  const serviceCharge = Number(totals.totalServiceCharge || 0).toFixed(2);
  const netAmount = Number(totals.totalNet || 0).toFixed(2);
  const paid = Number(paidAmount || netAmount).toFixed(2);
  const amountWords = toRupeeWords(netAmount);

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Bill Cum Receipt - ${billNo}</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #000; }
        .container { width: 1000px; margin: 0 auto; padding: 10px; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 6px; }
        .sub { text-align: center; font-size: 12px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
        .no-border td { border: none; padding: 4px; }
        .items th { background: #dbeff2; }
        .right { text-align: right; }
        .totals { width: 320px; float: right; border: 1px solid #000; margin-top: 10px; }
        .totals table { width: 100%; border: none; }
        .totals td { border: none; padding: 4px 8px; }
        .footer { margin-top: 40px; }
        @media print { body { margin: 0; } .container { width: auto; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">Bill Cum Receipt</div>
        <div class="sub">${hospitalName}</div>

        <table class="no-border" style="margin-bottom:8px;">
          <tr>
            <td style="width:33%;"><strong>Bill No</strong> ${billNo}</td>
            <td style="width:34%;"><strong>Bill Date &amp; Time</strong> ${billDateTime}</td>
            <td style="width:33%;"></td>
          </tr>
          <tr>
            <td><strong>Patient ID</strong> ${patientId}</td>
            <td><strong>Patient Name</strong> ${patientName}</td>
            <td><strong>Age/Sex</strong> ${ageSex}</td>
          </tr>
          <tr>
            <td colspan="3"><strong>Address</strong> ${address}</td>
          </tr>
        </table>

        <table class="items" style="margin-bottom:8px;">
          <thead>
            <tr>
              <th style="width:6%;">Sr.No.</th>
              <th style="width:62%;">Service Name</th>
              <th style="width:10%;">Rate</th>
              <th style="width:6%;">Qty</th>
              <th style="width:16%;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr><td class="right">Total Amount</td><td class="right">${totalAmount}</td></tr>
            <tr><td class="right">Net Bill Amount</td><td class="right">${netAmount}</td></tr>
            <tr><td class="right">Paid by Patient</td><td class="right">${paid}</td></tr>
          </table>
        </div>

        <div style="clear: both; margin-top: 8px;">
          <strong>Net Amount In (Words)</strong> ${amountWords} Only.
        </div>

        <div class="footer">
          <div style="float:left;">Prepared by<br/><br/>Reception</div>
          <div style="float:right; text-align:center;">FOR : ${hospitalName}</div>
          <div style="clear:both; margin-top:20px;"></div>
        </div>
      </div>
    </body>
  </html>
  `;
}

// React preview component
export default function BillPrint({ billNo, billDateTime, patientName, patient, totals, tableRows, paidAmount, billDetails }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: renderBillHtml({ billNo, billDateTime, patientName, patient, totals, tableRows, paidAmount, billDetails }) }} />
  );
}
