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
  MenuItem,
} from "@mui/material";
import { useCreateReceiptMasterMutation, useCreateReceiptAdjustmentDetailMutation, useLazyGetBillDetailByBillIdQuery, useLazyGetReceiptAdjustmentsByAdjustedBillIdQuery } from '../features/api/Hooks/billingApi.js';

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

  // Payments: allow splitting net bill into multiple payment rows
  const [payments, setPayments] = React.useState([]);

  // Initialize a default single payment that equals net amount when totals change
  React.useEffect(() => {
    const net = Number(totals.totalNet) || 0;
    if ((payments?.length || 0) === 0 && net > 0) {
      setPayments([{ method: billDetails?.FK_PaytypeID || 'CASH', amount: net, reference: '' }]);
    }
    // do not overwrite if user already adjusted payments
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.totalNet, billDetails?.FK_PaytypeID]);

  // Fetch existing receipt adjustments for this bill (displayed read-only)
  const [adjListLoading, setAdjListLoading] = React.useState(false);
  const [fetchedAdjustments, setFetchedAdjustments] = React.useState([]);

  React.useEffect(() => {
    const billId = billDetails?.BillNo || billDetails?.BillId || billDetails?.BillNo;
    if (!billId) return;
    setAdjListLoading(true);
    fetchReceiptAdjustments(billId).unwrap()
      .then((list) => {
        const rows = (list || []).map((a) => ({
          fetched: true,
          receiptId: a.PK_ReceiptId || a.receiptId || a.receiptNo || a.ReceiptNo || a.fkReceiptId || `R${Date.now()}`,
          payDate: a.paymentDate || a.adjustedDatetime || a.createdDate || a.payDate || '',
          amount: Number(a.adjustedAmount || a.adjustedAmt || a.amount || a.currencyAmount || 0),
          method: a.fkPayTypeId || a.payType || 'CASH',
          reference: a.userRemarks || a.remarks || a.reference || '',
          partyName: a.partyName || partyName,
          isCoPay: Boolean(a.isCoPayment || a.isCoPay),
          adjustedBillId: a.fkAdjustedBillId || billDetails?.BillNo,
          adjusted: true,
        }));
        setFetchedAdjustments(rows);
        setPayments((prev) => {
          const userRows = (prev || []).filter(p => !p.fetched);
          // merge, avoid duplicates by receiptId
          const seen = new Set();
          const merged = [];
          rows.forEach(r => { if (!seen.has(r.receiptId)) { merged.push(r); seen.add(r.receiptId); } });
          userRows.forEach(u => { merged.push(u); });
          return merged;
        });
      })
      .catch((err) => {
        console.error('Failed to fetch receipt adjustments for bill', billId, err);
      })
      .finally(() => setAdjListLoading(false));
  }, [billDetails?.BillNo]);

  const addPaymentRow = () => setPayments((p) => [...(p || []), { method: 'CASH', amount: 0, reference: '' }]);
  const removePaymentRow = (idx) => setPayments((p) => (p || []).filter((_, i) => i !== idx));
  const updatePaymentRow = (idx, changes) => setPayments((p) => (p || []).map((r, i) => (i === idx ? { ...r, ...changes } : r)));

  // Insert a new payment row after the given index
  const addPaymentRowAt = (idx) => setPayments((p) => {
    const arr = (p || []).slice();
    arr.splice(idx + 1, 0, { method: arr[idx]?.method || 'CASH', amount: 0, reference: '' });
    return arr;
  });

  const paymentsSum = (payments || []).reduce((s, r) => s + Math.max(0, Number(r.amount) || 0), 0);

  // Compute current payable for this bill (Net amount minus already adjusted amounts)
  const currentAdjustedSum = (fetchedAdjustments || []).reduce((s, r) => s + Number(r.amount || 0), 0);
  const currentPayable = Math.max(0, Number(totals.totalNet) - currentAdjustedSum);

  // Lazy queries to fetch bill details and existing adjustments for an adjusted bill id
  const [fetchBillDetail] = useLazyGetBillDetailByBillIdQuery();
  const [fetchReceiptAdjustments] = useLazyGetReceiptAdjustmentsByAdjustedBillIdQuery();

  // Fetch current payable amount for a referenced bill (fkAdjustedBillId)
  const handleFetchAdjDetails = async (idx, billId) => {
    if (!billId || String(billId).trim() === '') {
      // clear existing computed fields
      updatePaymentRow(idx, { adjustedBillPayable: undefined, adjustedBillFound: undefined });
      return;
    }

    updatePaymentRow(idx, { adjLoading: true, adjustedBillFound: undefined });

    let billResp = null;
    let adjList = [];
    try {
      billResp = await fetchBillDetail(billId).unwrap();
    } catch (err) {
      // ignore - bill may not exist
      billResp = null;
    }

    try {
      adjList = await fetchReceiptAdjustments(billId).unwrap() || [];
    } catch (err) {
      adjList = [];
    }

    // determine net amount from bill response
    const netAmount = Number(billResp?.NetBillAmt || billResp?.NetBill || billResp?.TotalAmt || 0) || 0;

    const adjustedSum = (adjList || []).reduce((s, a) => s + Number(a.adjustedAmount || a.adjustedAmt || 0), 0);

    const currentPayable = Math.max(0, netAmount - adjustedSum);

    updatePaymentRow(idx, { adjustedBillPayable: currentPayable, adjustedBillAdjustCount: (adjList || []).length, adjustedBillFound: Boolean(billResp), adjLoading: false });
  };

  // On mount or when payments change, auto-fetch adjusted-bill payable for rows that have an adjustedBillId but no cached payable
  React.useEffect(() => {
    (payments || []).forEach((p, idx) => {
      if (p?.adjustedBillId && p.adjustedBillPayable === undefined && !p.adjLoading) {
        handleFetchAdjDetails(idx, p.adjustedBillId);
      }
    });
    // only when payments array identity changes
  }, [payments]);

  // Helper to render adjustment status for a payment row
  const renderAdjStatus = (row) => {
    if (row.adjusted) return <Checkbox checked disabled />;
    if (row.adjustedBillId) {
      if (row.adjLoading) return <Typography variant="caption" color="text.secondary">Checking…</Typography>;
      if (row.adjustedBillFound === false) return <Typography variant="caption" color="error">Bill not found</Typography>;
      if (row.adjustedBillPayable !== undefined) {
        if (row.adjustedBillPayable <= 0) {
          return <Typography variant="caption" color="success.main">Adjusted{row.adjustedBillAdjustCount ? ` (${row.adjustedBillAdjustCount})` : ''}</Typography>;
        }
        return <Typography variant="caption" color="warning.main">Outstanding: {row.adjustedBillPayable}{row.adjustedBillAdjustCount ? ` (${row.adjustedBillAdjustCount})` : ''}</Typography>;
      }
      return <Typography variant="caption" color="warning.main">Pending</Typography>;
    }
    return <Typography variant="caption" color="text.secondary">Outstanding</Typography>;
  };

  const handleReceiptSubmit = async () => {
    if (posting) return;
    setPosting(true);
    try {
      // Build receipt payload
      const paymentDate = billDetails?.BillDate ? billDetails.BillDate.split('T')[0] : new Date().toISOString().slice(0,10);
      const paymentTime = billDetails?.BillTime || new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      const currencyAmount = Number(totals.totalNet) || 0;

      // Validate payments: allow partial payments (sum <= net) but disallow > net or zero
      if ((paymentsSum || 0) <= 0) {
        alert('Add at least one payment with an amount greater than 0.');
        setPosting(false);
        return;
      }
      if (paymentsSum > currencyAmount + 0.001) {
        alert('Payments total exceeds Net Amount. Reduce payment amounts or adjust bill.');
        setPosting(false);
        return;
      }

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
        // include granular payment lines
        paymentDetails: (payments || []).map((p) => ({ method: p.method, amount: Number(p.amount) || 0, reference: p.reference || '' })),
      };

      // Create one receipt per payment row
      for (let i = 0; i < (payments || []).length; i++) {
        const p = payments[i];
        const amt = Number(p.amount) || 0;
        const pPayload = {
          ...receiptPayload,
          currencyAmount: amt,
          amountINR: amt,
          fkPayTypeId: p.method || receiptPayload.fkPayTypeId,
          userRemarks: p.reference || receiptPayload.userRemarks,
          paymentDate: p.payDate || paymentDate,
        };

        let receiptResp;
        try {
          receiptResp = await createReceiptMaster(pPayload).unwrap();
        } catch (err) {
          console.error('Failed to create receipt for row', i, err);
          alert(`Failed to create receipt for payment row ${i + 1}: ${err?.data?.message || err?.message || ''}`);
          setPosting(false);
          return;
        }

        const rid = receiptResp?.receiptId || receiptResp?.id || receiptResp?.PK_ReceiptId || receiptResp?.ReceiptId || `R${Date.now()}`;

        // If the payment row specifies an adjusted bill, create an adjustment detail for this receipt
        if (p.adjustedBillId && String(p.adjustedBillId).trim() !== '') {
          const adjPayload = {
            fkReceiptId: rid,
            fkAdjustedBillId: p.adjustedBillId,
            adjustedAmount: amt,
            amountTDS: 0,
            amountDiscount: 0,
            amountDisAllow: 0,
            amountST: 0,
            fkAdjustedById: billDetails?.FK_CreatedById || 1,
            adjustedDatetime: new Date().toISOString(),
          };

          try {
            const adjResp = await createReceiptAdjustmentDetail(adjPayload).unwrap();
            // mark payment as adjusted and decrement cached payable and increment adjust-count if present
            setPayments((prev) => prev.map((r, idx) => (idx === i ? { ...r, receiptId: rid, adjusted: true, adjustedBillPayable: Math.max(0, (r.adjustedBillPayable || 0) - amt), adjustedBillAdjustCount: (r.adjustedBillAdjustCount || 0) + 1 } : r)));

            // append new adjustment to fetchedAdjustments so Current Payable updates immediately
            setFetchedAdjustments((prev) => (prev || []).concat({
              fetched: true,
              receiptId: rid,
              payDate: p.payDate || paymentDate,
              amount: amt,
              method: p.method || 'CASH',
              reference: p.reference || '',
              partyName,
              isCoPay: Boolean(p.isCoPay),
              adjustedBillId: p.adjustedBillId,
              adjusted: true,
              adjustedDatetime: adjResp?.adjustedDatetime || adjPayload.adjustedDatetime || new Date().toISOString(),
            }));
          } catch (err) {
            console.error('Failed to create adjustment for', rid, err);
            alert(`Receipt ${rid} was created but adjustment failed: ${err?.data?.message || err?.message || ''}`);
            setPayments((prev) => prev.map((r, idx) => (idx === i ? { ...r, receiptId: rid, adjusted: false } : r)));
            setPosting(false);
            return;
          }
        } else {
          // no adjustment for this row (outstanding)
          setPayments((prev) => prev.map((r, idx) => (idx === i ? { ...r, receiptId: rid, adjusted: false } : r)));
        }
      }

      const outstanding = Number(currencyAmount) - Number(paymentsSum);
      if (outstanding > 0.001) {
        alert(`Receipt(s) saved. Outstanding amount: ${outstanding}`);
      } else {
        alert('Receipt(s) and adjustments saved successfully');
      }
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
                <TableCell>Adj Bill</TableCell>
                <TableCell>Adjusted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adjListLoading && (
                <TableRow>
                  <TableCell colSpan={12}><Typography variant="caption">Loading existing receipts/adjustments…</Typography></TableCell>
                </TableRow>
              )}
              {(payments || []).map((p, i) => {
                // Render all payment rows (including zero/empty amounts) so Add Row shows immediately
                return (
                  <TableRow key={i}>
                    <TableCell>{p.receiptId || 'Pending'}</TableCell>
                    <TableCell>{p.payDate || receiptDateTime}</TableCell>
                    <TableCell>
                      <TextField size="small" type="number" inputProps={{ min: 0, step: 0.01 }} value={p.amount} disabled={p.fetched} onChange={(e) => updatePaymentRow(i, { amount: Number(e.target.value) })} />
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{p.amount}</TableCell>
                    <TableCell>
                      <TextField select size="small" value={p.method} disabled={p.fetched} onChange={(e) => { if (!p.fetched) updatePaymentRow(i, { method: e.target.value }); }}>
                        {['CASH','CREDIT_CARD','UPI','CHEQUE','OTHER'].map((m) => (
                          <MenuItem key={m} value={m}>{m.replace('_',' ')}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>{partyName}</TableCell>
                    <TableCell>{billDetails?.FK_BillSerieseId || ''}</TableCell>
                    <TableCell>
                      <Checkbox checked={Boolean(p.isCoPay)} disabled={p.fetched} onChange={(e) => { if (!p.fetched) updatePaymentRow(i, { isCoPay: e.target.checked }); }} />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <TextField size="small" value={p.adjustedBillId || ''} disabled={p.fetched} onChange={(e) => { if (!p.fetched) updatePaymentRow(i, { adjustedBillId: e.target.value }); }} onBlur={(e) => { if (!p.fetched) handleFetchAdjDetails(i, e.target.value); }} placeholder="Bill ID" />
                        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          {p.adjLoading ? (
                            <Typography variant="caption" color="text.secondary">Checking…</Typography>
                          ) : (p.adjustedBillFound === false ? (
                            <Typography variant="caption" color="error">Bill not found</Typography>
                          ) : null)}
                          {p.adjustedBillAdjustCount ? (
                            <Typography variant="caption" color="text.secondary">Adjustments: {p.adjustedBillAdjustCount}</Typography>
                          ) : null}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderAdjStatus(p)}
                        <Button size="small" variant="outlined" onClick={() => addPaymentRowAt(i)}>Add</Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => { if (!p.fetched && window.confirm('Delete this payment row?')) removePaymentRow(i); }} disabled={p.fetched}>Delete</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Empty state: show original single row when no payments configured */}
              {(!payments || payments.length === 0) && (
                <TableRow>
                  <TableCell>{receiptNo}</TableCell>
                  <TableCell>{receiptDateTime}</TableCell>
                  <TableCell>{totals.totalAmount}</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>{totals.totalNet}</TableCell>
                  <TableCell>{payType}</TableCell>
                  <TableCell>{partyName}</TableCell>
                  <TableCell>{billDetails?.FK_BillSerieseId || ''}</TableCell>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell></TableCell>
                  <TableCell><Checkbox checked /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={() => setPayments([{ method: billDetails?.FK_PaytypeID || 'CASH', amount: Number(totals.totalNet) || 0, reference: '' }])}>Add Row</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
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

        {/* Compact payment controls (Add/Reset) — no separate split section */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button size="small" variant="outlined" onClick={addPaymentRow}>Add Payment</Button>
          <Button size="small" variant="text" onClick={() => setPayments([{ method: billDetails?.FK_PaytypeID || 'CASH', amount: Number(totals.totalNet) || 0, reference: '' }])}>Reset To Full</Button>
          <Box sx={{ ml: 2 }}>
            <Typography>Total Payments: <strong>{paymentsSum}</strong></Typography>
          </Box>
          <Box sx={{ ml: 2 }}>
            {paymentsSum !== Number(totals.totalNet) ? <Typography color="error">Remaining: {Number(totals.totalNet) - paymentsSum}</Typography> : <Typography color="success.main">Fully allocated</Typography>}
          </Box>
        </Box>

        {/* ================= FOOTER ================= */}
        <Box sx={{ mt: 1, backgroundColor: "#f8caca", p: 1 }}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography fontWeight="bold">
                Balance Amount : {Number(totals.totalNet) - paymentsSum}
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
