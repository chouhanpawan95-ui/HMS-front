import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  FormControlLabel,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Radio, RadioGroup, FormControl } from "@mui/material";
import {
  useGetPatientsQuery,
  useCreateBillMutation,
} from "../features/api/patientsApi";

import SearchBar from "../component/SearchBar.js";
import Loader from "../component/Loader.js";

const BillingInformation = ({
  doctorList = [],
  billTypeList = [],
  categoryList = [],
}) => {
  console.log("CategoryList:", categoryList);
  const [firstName, setFirstName] = useState("");
  const [containsOption, setContainsOption] = useState("Contains");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data: patientsResp, isLoading } = useGetPatientsQuery();
  // const [createbill, { isSuccess, isError, error }] = useCreateBillMutation();
  const [billDate, setBillDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const handleConfirmYes = () => {
    setOpenDialog(false);
    console.log("✅ Form submitted successfully!");
    // Your form submission logic here (API call etc.)
    setSelectedPatient(null); // Go back to table list after submission
  };
  useEffect(() => {
    const now = new Date();
    // Format: 2025-01-20T15:30
    const formatted = now.toISOString().slice(0, 16);
    setBillDate(formatted);
  }, []);
  // If user cancels (No)
  const handleConfirmNo = () => {
    setOpenDialog(false);
    setSelectedPatient(null); // Go back to patient list
  };
  // Extract patients safely
  const patients = Array.isArray(patientsResp)
    ? patientsResp
    : patientsResp && Array.isArray(patientsResp.data)
    ? patientsResp.data
    : [];
  const paginatedPatients = filteredPatients.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  // Initialize with all data when API loads
  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);
  // 🧠 Auto-search on typing or option change
  useEffect(() => {
    let filtered = [...patients];
    if (firstName.trim() !== "") {
      filtered = filtered.filter((p) => {
        const name = (p.firstName || "").toLowerCase();
        const search = firstName.toLowerCase();
        if (containsOption === "Equals") return name === search;
        if (containsOption === "Starts With") return name.startsWith(search);
        return name.includes(search);
      });
    }
    setFilteredPatients(filtered);
  }, [firstName, containsOption, patients]);
  // 🩺 Handle patient row click
  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
  };
  // 🧾 Go back to patient table
  const handleBack = () => {
    setSelectedPatient(null);
  };
  // 🧾 Submit handler
  const handleSubmit = () => {
    setOpenDialog(true);
    setOpenDialog(true);
  };
  const billDetails = {
    PK_BillId: "",
    FK_BillingCompanyId: "",
    FK_FinYearId: "",
    FK_BranchId: "",
    FK_BillTypeId: "",
    FK_CategoryId: "",
    FK_BillSerieseId: "",
    BillNo: "",
    BillDate: "",
    BillTime: "",
    FK_RegId: "",
    FK_IPDId: "",
    FK_DoctorId: "",
    FK_DrDeptID: "",
    FK_ReferredById: "",
    FK_PartyId: "",
    IsMLC: "",
    IsAcademic: "",
    AgeYear: "",
    AgeMonth: "",
    AgeDays: "",
    TotalAmt: "",
    ServiceChargeAmt: "",
    DiscountAmt: false,
    NetBillAmt: "",
    RateType: "",
    Remarks: "",
    Iscancel: "",
    FK_CreatedById: "",
    FK_CancelledById: "",
    CancelledDateTime: "",
    PrintCount: "",
    FreeReason: "",
    IsActive: "",
    PK_SynchId: "",
    OLDBillID: "",
    OLDBillNo: "",
    OLDRegID: "",
    ReportDeliveryDateTime: "",
    FK_OrganizerId: "",
    Tokenno: "",
    Cancelreason: "",
    HospitalDiscount: "",
    MOUDiscount: "",
    FK_PaytypeID: "",
    BillRefID: "",
    Diagnosis: "",
  };
  return (
    <Box
      sx={{
        background: "#fff",
        color: "#000",
        p: 2,
        mt: 8,
        minHeight: "100vh",
      }}
    >
      {/* =================== PATIENT SEARCH TABLE =================== */}
      {!selectedPatient ? (
        <>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Loader />
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Search For FirstName
              </Typography>

              <SearchBar
                sx={{ mb: "5px" }}
                patients={patients}
                onFilter={setFilteredPatients}
              />
            </>
          )}

          {/* Patient Table */}
          <TableContainer component={Paper} sx={{ mt: 5 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#578EE5" }}>
                  {[
                    "PatientID",
                    "Date",
                    "FirstName",
                    "LastName",
                    "Age",
                    "MobileNo",
                    "DOB",
                    "Address",
                    "OLD MRNO",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : paginatedPatients.length > 0 ? (
                  paginatedPatients.map((p, i) => (
                    <TableRow
                      key={i}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(p)}
                    >
                      <TableCell>{p.patientId}</TableCell>
                      <TableCell>{p.dateTime}</TableCell>
                      <TableCell>{p.firstName}</TableCell>
                      <TableCell>{p.lastName}</TableCell>
                      <TableCell>{p.ageYMD}</TableCell>
                      <TableCell>{p.permanentAddress?.mobileNo}</TableCell>
                      <TableCell>{p.dateOfBirth}</TableCell>
                      <TableCell>{p.permanentAddress?.addressLine}</TableCell>
                      <TableCell>{p.oldNo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        /* =================== BILLING FORM SECTION =================== */
        <Box
          sx={{
            p: 3,
            backgroundColor: "#f8f8f8",
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fdfdfd",
              fontFamily: "Arial",
            }}
          >
            {/* ===== HEADER ===== */}
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#578EE5",
                fontWeight: "bold",
                p: 1,
                borderRadius: 1,
                color: "#fff",
              }}
            >
              Patient Information
            </Typography>

            {/* ===== PATIENT INFO ===== */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Patient ID"
                  value={selectedPatient?.patientId || ""}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Admission ID"
                  value={selectedPatient?.admissionId || ""}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Patient Name"
                  value={`${selectedPatient?.firstName || ""} ${
                    selectedPatient?.lastName || ""
                  }`}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Age/Sex"
                  value={`${selectedPatient?.ageYMD || ""} / ${
                    selectedPatient?.sex || ""
                  }`}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={12}
                display="flex"
                alignItems="center"
                flexWrap="wrap"
              >
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={
                      selectedPatient?.isWalkIn
                        ? "Walk-In"
                        : selectedPatient?.isAppointment
                        ? "With Appointment"
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedPatient((prev) => ({
                        ...prev,
                        isWalkIn: value === "Walk-In",
                        isAppointment: value === "With Appointment",
                      }));
                    }}
                  >
                    <FormControlLabel
                      value="Walk-In"
                      control={<Radio />}
                      label="Walk-In"
                    />
                    <FormControlLabel
                      value="With Appointment"
                      control={<Radio />}
                      label="With Appointment"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/* ===== BILLING INFO ===== */}
            <Box mt={3}>
              <Typography
                variant="subtitle1"
                sx={{
                  backgroundColor: "#578EE5",
                  fontWeight: "bold",
                  p: 1,
                  borderRadius: 1,
                  color: "#fff",
                }}
              >
                Billing Information
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Invoice/Bill No"
                    // value={selectedPatient?.patientId || ""}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Bill Date/Time"
                    type="datetime-local"
                    size="small"
                    fullWidth
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Branch"
                    // value={selectedPatient?.branch || ""}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Fin/Year"
                    // value={`${selectedPatient?.ageYMD || ""}`}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                ></Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Bill Series"
                    // value={selectedPatient?.patientId || ""}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Bill Type entry"
                    defaultValue=""
                    sx={{ width: "230px", height: "10px" }}
                  >
                    <MenuItem value="">Bill Type entry</MenuItem>

                    {billTypeList.map((bill) => (
                      <MenuItem key={bill.id} value={bill.id}>
                        {bill.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Select Category"
                    defaultValue=""
                    sx={{ width: "230px", height: "10px" }}
                  >
                    <MenuItem value="">-- Select Category --</MenuItem>

                    {categoryList.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.CategoryName} {cat.CategoryCode}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Select Doctor"
                    defaultValue=""
                    sx={{ width: "230px", height: "10px" }}
                  >
                    <MenuItem value="">-- Select Doctor --</MenuItem>

                    {doctorList.map((doc) => (
                      <MenuItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                ></Grid>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Reffered By"
                      // value={selectedPatient?.patientId || ""}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Party"
                      // value={selectedPatient?.admissionId || ""}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Free discount Reason"
                      // value={`${selectedPatient?.firstName || ""} ${
                      //   selectedPatient?.lastName || ""
                      // }`}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Rate Type"
                      // value={`${selectedPatient?.ageYMD || ""} / ${
                      //   selectedPatient?.sex || ""
                      // }`}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={12}
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                  ></Grid>
                </Grid>
              </Grid>
            </Box>

            {/* ===== SERVICE TABLE ===== */}
            <Box mt={3}>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "#578EE5" }}>
                    <TableRow>
                      {[
                        "Service Name",
                        "Rate",
                        "Qty",
                        "Dis(%)",
                        "Discount",
                        "S.C.(%)",
                        "S.Charge",
                        "Net Amt",
                        "Remarks",
                      ].map((header, i) => (
                        <TableCell key={i} sx={{ color: "#fff" }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Consultation Charges</TableCell>
                      <TableCell>100</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>100</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* ===== PARTY & TOTAL ===== */}
            <Grid container spacing={2} mt={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Party Name" size="small" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Amount" size="small" fullWidth />
              </Grid>
            </Grid>

            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography sx={{ fontWeight: "bold", color: "#b45f06" }}>
                One Hundred
              </Typography>
              <Box sx={{ fontSize: 14 }}>
                <Typography>Total Amount: 100</Typography>
                <Typography>Service Charge: 0</Typography>
                <Typography>Less Discount: 0</Typography>
                <Typography>Net Bill Amount: 100</Typography>
                <Typography>Current Payable: 100</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ===== BILLING REMARKS ===== */}
            <TextField label="Billing Remarks" fullWidth size="small" />

            {/* ===== ACTION BUTTONS ===== */}
            <Box
              mt={3}
              display="flex"
              justifyContent="flex-end"
              gap={2}
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
                sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#578EE5",
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
      {/* ✅ CONFIRMATION DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this billing information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo} color="secondary">
            No
          </Button>
          <Button
            onClick={handleConfirmYes}
            color="primary"
            variant="contained"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingInformation;
