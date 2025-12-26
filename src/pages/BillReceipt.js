import React from "react";
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

const BillReceipt = () => {
  return (
    <Box sx={{ p: 1, backgroundColor: "#eaeaea" }}>
      <Paper sx={{ p: 1 }}>
        {/* ================= HEADER ================= */}
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField size="small" label="Receipt No" value="ERK/16-17/51" fullWidth />
          </Grid>
          <Grid item xs={1.5}>
            <TextField size="small" label="Year" value="16-17" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField
              size="small"
              label="Receipt Date & Time"
              value="27/May/2016 01:23 AM"
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField size="small" label="Branch" value="Ernakulam" fullWidth />
          </Grid>
          <Grid item xs={2.5}>
            <TextField size="small" label="Doctor" value="Dr. Jacob Math" fullWidth />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        {/* ================= BILL INFO ================= */}
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField size="small" label="Amount (INR)" value="1500" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Payment Type" value="Cash" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Party Name" value="Patient" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField size="small" label="Deposit Type" value="Bill Time Paid" fullWidth />
          </Grid>

          <Grid item xs={3}>
            <TextField size="small" label="Bill No" value="ERK/16-17/INV/6" fullWidth />
          </Grid>

          <Grid item xs={6}>
            <FormControlLabel control={<Checkbox />} label="Is Co-Payment" />
            <FormControlLabel control={<Checkbox checked />} label="Adjusted with Bill" />
          </Grid>

          <Grid item xs={3}>
            <TextField size="small" label="Deposit Head Name" value="INVESTIGATION" fullWidth />
          </Grid>
        </Grid>

        {/* ================= BANK DETAILS ================= */}
        <Box sx={{ mt: 1, backgroundColor: "#fff7cc", p: 1 }}>
          <Typography fontWeight="bold">Card, Cheque & Bank Detail</Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <TextField size="small" label="Card / Cheque No" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField size="small" label="Cheque Date" value="27/May/2016" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField size="small" label="Bank Name" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField size="small" label="Clearing Bank" fullWidth />
            </Grid>
          </Grid>
        </Box>

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
                <TableCell>ERK/16-17/51</TableCell>
                <TableCell>27/May/16</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>0</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Cash</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Bill Time Paid</TableCell>
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
                    <TableCell>Patient</TableCell>
                    <TableCell>1500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>

            <Grid item xs={6}>
              <Grid container spacing={1}>
                {[
                  ["Total Amount", "1500"],
                  ["Service Charge", "0"],
                  ["Less Discount", "0"],
                  ["Net Bill Amount", "1500"],
                  ["Current Payable", "0"],
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
                Balance Amount : 1500
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Button variant="contained" sx={{ mr: 1 }}>
                Load Consumable
              </Button>
              <Button variant="contained" sx={{ mr: 1 }}>
                Update Consumable
              </Button>
              <Button variant="contained" color="success">
                Receipt & Payment
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default BillReceipt;
