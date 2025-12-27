import React, { useMemo } from "react";
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import { useCreateReceiptMasterMutation, useCreateReceiptAdjustmentDetailMutation } from '../features/api/Hooks/billingApi.js';

const BillReceipt = () => {
  const location = useLocation();
  const { billDetails, tableRows, selectedPatient } = location.state || {};

  // Helper to compute totals from tableRows (fallback to billDetails where available)
  const totals = useMemo(() => {
    if (Array.isArray(tableRows) && tableRows.length > 0) {
      let totalAmount = 0;
      let totalDiscount = 0;
      let totalServiceCharge = 0;
      let totalNet = 0;
      tableRows.forEach((r) => {
        const rate = Number(r.RateGeneral || r.Rate) || 0;
        const qty = Number(r.Qty || r.Unit) || 1;
        const gross = rate * qty;
        // Try to obtain discount/service charge from row or compute zero
        const discount = Number(r.Discount || 0);
        const serviceCharge = Number(r.ServiceCharge || r.ServiceCharges || 0);
        const net = (gross - discount) + serviceCharge;
        totalAmount += gross;
        totalDiscount += discount;
        totalServiceCharge += serviceCharge;
        totalNet += net;
      });
      return {
        totalAmount,
        totalDiscount,
        totalServiceCharge,
        totalNet,
      };
    }
    // fallback to billDetails values if rows are not available
    return {
      totalAmount: Number(billDetails?.TotalAmt) || 0,
      totalDiscount: Number(billDetails?.DiscountAmt) || 0,
      totalServiceCharge: Number(billDetails?.ServiceChargeAmt) || 0,
      totalNet: Number(billDetails?.NetBillAmt) || 0,
    };
  }, [tableRows, billDetails]);

  const receiptNo = billDetails?.BillNo || '';
  const receiptDateTime = billDetails?.BillDate ? `${billDetails.BillDate} ${billDetails.BillTime || ''}` : new Date().toLocaleString();
  const branch = billDetails?.FK_BranchId || '';
  const doctor = billDetails?.FK_DoctorId || '';
  const payType = billDetails?.FK_PaytypeID || 'CASH';
  const partyName = selectedPatient ? `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}` : billDetails?.PartyName || 'Patient';

  const [createReceiptMaster] = useCreateReceiptMasterMutation();
  const [createReceiptAdjustmentDetail] = useCreateReceiptAdjustmentDetailMutation();
  const [posting, setPosting] = React.useState(false);

  const handleReceiptSubmit = async () => {
    if (posting) return;
    setPosting(true);
    try {
      // Build receipt payload
      const paymentDate = billDetails?.BillDate ? billDetails.BillDate.split('T')[0] : new Date().toISOString().slice(0,10);
      const paymentTime = billDetails?.BillTime || new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      const currencyAmount = Number(totals.totalNet) || 0;

      const receiptPayload = {
        fkBillingCompanyId: billDetails?.FK_BillingCompanyId || 'BC001',
        fkBranchId: billDetails?.FK_BranchId || 'BR001',
        fkFinyearId: billDetails?.FK_FinYearId || 'FY2024',
        fkRegId: selectedPatient?.patientId || billDetails?.FK_RegId || '',
        fkDepositHeadId: billDetails?.FK_DepositHeadId || 'DEP001',
        receiptNo: billDetails?.BillNo || `REC-${Date.now()}`,
        paymentDate,
        paymentTime,
        fkDoctorId: billDetails?.FK_DoctorId || selectedPatient?.doctorId || 'DOC001',
        fkCurrencyId: 'INR',
        currencyAmount,
        convertRatio: 1,
        amountINR: currencyAmount,
        fkPayTypeId: billDetails?.FK_PaytypeID || 'CASH',
        fkDepositTypeId: billDetails?.FK_DepositTypeId || 'OPD',
        isCoPayment: billDetails?.isCoPayment || false,
        fkPartyId: billDetails?.FK_PartyId || selectedPatient?.partyId || selectedPatient?.patientId || 'PAT001',
        fkCreatedById: billDetails?.FK_CreatedById || 1,
        userRemarks: billDetails?.Remarks || '',
        counterName: billDetails?.counterName || 'Front Desk',
        fkAppointmentID: billDetails?.FK_AppointmentID || billDetails?.FK_AppointmentId || selectedPatient?.appointmentId || '',
      };

      const receiptResp = await createReceiptMaster(receiptPayload).unwrap();
      const receiptId = receiptResp?.receiptId || receiptResp?.id || receiptResp?.PK_ReceiptId || receiptResp?.ReceiptId || `R${Date.now()}`;

      // Build adjustment payload
      const adjustmentPayload = {
        fkReceiptId: receiptId,
        fkAdjustedBillId: billDetails?.PK_BillId || billDetails?.BillNo || '',
        adjustedAmount: Number(currencyAmount) || 0,
        amountTDS: 0,
        amountDiscount: Number(totals.totalDiscount) || 0,
        amountDisAllow: 0,
        amountST: 0,
        fkAdjustedById: billDetails?.FK_CreatedById || 1,
        adjustedDatetime: new Date().toISOString(),
      };

      await createReceiptAdjustmentDetail(adjustmentPayload).unwrap();

      alert('Receipt and adjustment saved successfully');
    } catch (err) {
      console.error('Failed to post receipt:', err);
      alert('Failed to save receipt. See console for details.');
    } finally {
      setPosting(false);
    }
  };

  const { renderReceiptHtml } = require('./BillReceiptPrint');

  const handlePrint = () => {
    try {
      const html = renderReceiptHtml({ receiptNo, receiptDateTime, partyName, selectedPatient, totals, payType, billDetails });
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        alert('Popup blocked — allow popups for this site to print.');
        return;
      }
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    } catch (err) {
      console.error('Print failed', err);
      alert('Print failed, check console.');
    }
  };

  return (
    <Box sx={{ p: 1, backgroundColor: "#eaeaea" }}>
      <Paper sx={{ p: 1 }}>
        {/* ================= HEADER ================= */}
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField size="small" label="Receipt No" value={receiptNo} fullWidth />
          </Grid>
          <Grid item xs={1.5}>
            <TextField size="small" label="Year" value={new Date().getFullYear()} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField
              size="small"
              label="Receipt Date & Time"
              value={receiptDateTime}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField size="small" label="Branch" value={branch} fullWidth />
          </Grid>
          <Grid item xs={2.5}>
            <TextField size="small" label="Doctor" value={doctor} fullWidth />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        {/* ================= PATIENT & BILL INFO ================= */}
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField size="small" label="Patient" value={partyName} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Age / Sex" value={`${selectedPatient?.ageYMD || ''} / ${selectedPatient?.sex || ''}`} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Patient ID" value={selectedPatient?.patientId || ''} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Payment Type" value={payType} fullWidth />
          </Grid>

          <Grid item xs={3}>
            <TextField size="small" label="Bill No" value={billDetails?.BillNo || ''} fullWidth />
          </Grid>

          <Grid item xs={3}>
            <TextField size="small" label="Total Amount" value={totals.totalAmount} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Less Discount" value={totals.totalDiscount} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Net Amount" value={totals.totalNet} fullWidth />
          </Grid>
        </Grid>

        {/* ================= RECEIPT TABLE ================= */}
        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#c8f7c5" }}>
              <TableRow>
                <TableCell>Receipt No</TableCell>
                <TableCell>Pay Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Refunded</TableCell>
                <TableCell>Net Amount</TableCell>
                <TableCell>Pay Type</TableCell>
                <TableCell>Party Name</TableCell>
                <TableCell>Deposit Type</TableCell>
                <TableCell>Co-Pay</TableCell>
                <TableCell>Adjusted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{receiptNo}</TableCell>
                <TableCell>{receiptDateTime}</TableCell>
                <TableCell>{totals.totalAmount}</TableCell>
                <TableCell>0</TableCell>
                <TableCell>{totals.totalNet}</TableCell>
                <TableCell>{payType}</TableCell>
                <TableCell>{partyName}</TableCell>
                <TableCell>{billDetails?.FK_BillSerieseId || ''}</TableCell>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Checkbox checked />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* ================= ADJUST SECTION ================= */}
        <Box sx={{ mt: 1, backgroundColor: "#fffacd", p: 1 }}>
          <Typography fontWeight="bold">
            Double Click on Selected Row For Adjust Receipt for this Bill
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Party Name</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{partyName}</TableCell>
                    <TableCell>{totals.totalNet}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>

            <Grid item xs={6}>
              <Grid container spacing={1}>
                {[
                  ["Total Amount", totals.totalAmount],
                  ["Service Charge", totals.totalServiceCharge],
                  ["Less Discount", totals.totalDiscount],
                  ["Net Bill Amount", totals.totalNet],
                  ["Current Payable", 0],
                ].map(([label, value]) => (
                  <Grid item xs={12} key={label}>
                    <TextField
                      size="small"
                      label={label}
                      value={value}
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* ================= FOOTER ================= */}
        <Box sx={{ mt: 1, backgroundColor: "#f8caca", p: 1 }}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography fontWeight="bold">
                Balance Amount : {totals.totalNet}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Button variant="contained" sx={{ mr: 1 }}>
                Load Consumable
              </Button>
              <Button variant="contained" sx={{ mr: 1 }}>
                Update Consumable
              </Button>
              <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={handlePrint}>
                Print
              </Button>
              <Button variant="contained" color="success" onClick={handleReceiptSubmit} disabled={posting}>
                {posting ? 'Processing...' : 'Receipt & Payment'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default BillReceipt;
