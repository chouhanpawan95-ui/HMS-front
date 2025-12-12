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
  Checkbox,
  IconButton,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Radio, RadioGroup, FormControl } from "@mui/material";
import { useGetPatientsQuery } from "../features/api/patientsApi";
import {useCreateRatelistMutation,useCreateRatelistDetailsQuery,useGetPartyNameQuery,useCreateBillMutation} from '../features/api/billingMasterApi.js'
import SearchBar from "../component/SearchBar.js";
import Loader from "../component/Loader.js";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';

const BillingInformation = ({ doctorList = [], billTypeList = [], categoryList = [] }) => {
  const [firstName, setFirstName] = useState("");
  const [containsOption, setContainsOption] = useState("Contains");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data: patientsResp, isLoading } = useGetPatientsQuery();
  const [createRatelist, { data: createRatelistResponse }] =
  useCreateRatelistMutation();
  const [createBill, { data: createbilldetails, isLoading: isCreating, error: createBillError }] = useCreateBillMutation();
  console.log("CreateBill response", createbilldetails, "loading", isCreating, "error", createBillError)
  const { data:CreateRatedetails } = useCreateRatelistDetailsQuery();
  const { data:partyNameData } = useGetPartyNameQuery();
  // console.log("createRatedetails",CreateRatedetails)
  const [rate, setRate] = useState("");
  const [billDate, setBillDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [editingRowIndex, setEditingRowIndex] = useState(null);
// Target RateListId
const [selectedRateListId, setSelectedRateListId] = useState("");
const [partyName, setPartyName] = useState("");
const [selectedServices, setSelectedServices] = useState([]);
const [billingRemarks, setBillingRemarks] = useState("");
// First API response (RateList)
const rateList = createRatelistResponse?.data || [];

// Second API response (RateListDetails)
const rateListDetails = CreateRatedetails?.data || [];

// 2. Filter RateList by rateListId
const filteredRateList = rateList.filter(
  (item) => item.rateListId === selectedRateListId
);

// 3. Filter Details by FK_RateListId
const filteredRateListDetails = rateListDetails.filter(
  (item) => item.FK_RateListId === selectedRateListId
);

// 4. Extract FK_ServiceId from details
const serviceIds = filteredRateListDetails.map((item) => item.FK_ServiceId);
 const [tableRows, setTableRows] = useState([]); // main table rows

  // Add new row to table
  const onAddRow = (item) => {
    if (!item) return;
    // Create a new mutable object with all fields from API
    const newRow = {
      FK_ServiceId: item.FK_ServiceId || "",
      RateGeneral: item.RateGeneral || 0,
      Qty: 1,
      Discountpercent: item.Discountpercent || 0,
      Discount: item.Discount || 0,
      SCPercent: item.SCPercent || 0,
      ServiceCharge: item.ServiceCharge || 0,
      Remarks: item.Remarks || "",
      // Include any other API fields
      ...item,
    };
    setTableRows((prev) => [...prev, newRow]);
  };

  // Apply a selected service to an existing row (edit mode)
  const applyServiceToRow = (item, rowIndex) => {
    setTableRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return {
          ...r,
          FK_ServiceId: item.FK_ServiceId || r.FK_ServiceId || "",
          ServiceName: item.ServiceName || item.FK_ServiceId || r.ServiceName || "",
          RateGeneral: item.RateGeneral || item.Rate || r.RateGeneral || 0,
          Discountpercent: item.Discountpercent ?? r.Discountpercent ?? 0,
          Discount: item.Discount ?? r.Discount ?? 0,
          SCPercent: item.SCPercent ?? r.SCPercent ?? 0,
          ServiceCharge: item.ServiceCharge ?? r.ServiceCharge ?? 0,
          ...item,
        };
      })
    );
    setEditingRowIndex(null);
    setSelectedServices([]);
    setOpenPopup(false);
  };
//Calculation of service
const calculateNetFromAmount = (row) => {
  const rate = Number(row.RateGeneral) || 0;
  const qty = Number(row.Qty) || 1;

  const gross = rate * qty;

  let discountPercent = Number(row.Discountpercent) || 0;
  let discountAmount = Number(row.Discount) || 0;

  let scPercent = Number(row.SCPercent) || 0;
  let scAmount = Number(row.ServiceCharge) || 0;

  // ✅ If USER types DISCOUNT AMOUNT → calculate %
  if (discountAmount > 0 && discountPercent === 0) {
    discountPercent = (discountAmount / gross) * 100;
  } 
  // ✅ If USER types DISCOUNT % → calculate AMOUNT
  else if (discountPercent > 0 && discountAmount === 0) {
    discountAmount = (gross * discountPercent) / 100;
  }

  const afterDiscount = gross - discountAmount;

  // ✅ If USER types SERVICE CHARGE AMOUNT → calculate %
  if (scAmount > 0 && scPercent === 0) {
    scPercent = (scAmount / afterDiscount) * 100;
  } 
  // ✅ If USER types SERVICE CHARGE % → calculate AMOUNT
  else if (scPercent > 0 && scAmount === 0) {
    scAmount = (afterDiscount * scPercent) / 100;
  }

  const netAmount = afterDiscount + scAmount;

  return {
    discountAmount: discountAmount.toFixed(2),
    discountPercent: discountPercent.toFixed(2),
    serviceChargeAmount: scAmount.toFixed(2),
    serviceChargePercent: scPercent.toFixed(2),
    netAmount: netAmount.toFixed(2),
  };
};

// Calculate totals from all table rows
const calculateBillTotals = () => {
  let totalGross = 0;
  let totalDiscount = 0;
  let totalServiceCharge = 0;
  let totalNetAmount = 0;

  tableRows.forEach((row) => {
    const rate = Number(row.RateGeneral) || 0;
    const qty = Number(row.Qty) || 1;
    const gross = rate * qty;
    
    const result = calculateNetFromAmount(row);
    
    totalGross += gross;
    totalDiscount += Number(result.discountAmount) || 0;
    totalServiceCharge += Number(result.serviceChargeAmount) || 0;
    totalNetAmount += Number(result.netAmount) || 0;
  });

  return {
    totalGross: totalGross.toFixed(2),
    totalDiscount: totalDiscount.toFixed(2),
    totalServiceCharge: totalServiceCharge.toFixed(2),
    totalNetAmount: totalNetAmount.toFixed(2),
  };
};




// When API loads → set default value automatically
useEffect(() => {
  if (
    createRatelistResponse?.data &&
    createRatelistResponse.data.length > 0
  ) {
    setSelectedRateListId(createRatelistResponse.data[0].rateListId);
  }
}, [createRatelistResponse]);
  const handleConfirmYes = async () => {
    setOpenDialog(false);
    try {
      const totals = calculateBillTotals();
      
      // compute numeric registration id for FK_RegId
      const computeRegId = () => {
        if (billDetails.FK_RegId && !isNaN(Number(billDetails.FK_RegId))) return Number(billDetails.FK_RegId);
        if (selectedPatient?.PK_RegId && !isNaN(Number(selectedPatient.PK_RegId))) return Number(selectedPatient.PK_RegId);
        if (selectedPatient?.id && !isNaN(Number(selectedPatient.id))) return Number(selectedPatient.id);
        if (selectedPatient?._id && !isNaN(Number(selectedPatient._id))) return Number(selectedPatient._id);
        const pid = selectedPatient?.patientId;
        if (typeof pid === 'string') {
          const m = pid.match(/(\d+)/);
          if (m) return Number(m[1]);
        }
        return 0;
      };

      const billMasterPayload = {
        // omit PK_BillId so backend will auto-generate it
        FK_FinYearId: billDetails.FK_FinYearId || 1,
        FK_BranchId: billDetails.FK_BranchId || 1,
        BillNo: billDetails.BillNo || "",
        BillDate: billDate || billDetails.BillDate || new Date().toISOString(),
        FK_RegId: computeRegId(),
        FK_DoctorId: billDetails.FK_DoctorId || (selectedPatient?.doctorId ? Number(selectedPatient.doctorId) : 0),
        IsMLC: billDetails.IsMLC === true ? true : false,
        IsAcademic: billDetails.IsAcademic === true ? true : false,
        TotalAmt: Number(totals.totalGross) || 0,
        ServiceChargeAmt: Number(totals.totalServiceCharge) || 0,
        DiscountAmt: Number(totals.totalDiscount) || 0,
        NetBillAmt: Number(totals.totalNetAmount) || 0,
        Remarks: billingRemarks || billDetails.Remarks || "",
        Iscancel: billDetails.Iscancel === true ? true : false,
        PrintCount: billDetails.PrintCount || 0,
        IsActive: billDetails.IsActive !== false ? true : false,
        HospitalDiscount: billDetails.HospitalDiscount || 0,
        MOUDiscount: billDetails.MOUDiscount || 0,
      };

      console.log("Create bill master payload:", billMasterPayload);
      const billMasterResp = await createBill(billMasterPayload).unwrap();
      console.log("Create bill master response:", billMasterResp);
      
      // After successful master creation, optionally save tableRows for later use
      // If backend returns PK_BillId in response, we can use it for detail operations
      // For now, we'll just go back to patient list after master is created
      setSelectedPatient(null);
      alert("✅ Bill created successfully!");
      
    } catch (err) {
      console.error("Error creating bill:", err);
      if (err && err.data) console.error("Server error data:", err.data);
      alert("❌ Error creating bill. Check console for details.");
    }
  };
  useEffect(() => {
  createRatelist();   // 🔥 API will run here
}, []);
const handleInputChange = (index, field, value) => {
  setTableRows(prev =>
    prev.map((row, i) => {
      if (i === index) {
        // Create a new mutable object from the row
        const newRow = { ...row };

        // For textual fields keep the string, otherwise parse number
        if (field === "ServiceName" || field === "Remarks" || field === "FK_ServiceId") {
          newRow[field] = value;
        } else {
          newRow[field] = Number(value) || 0;
        }

        // Reset related fields based on which field was changed
        if (field === "Discount" && Number(value) > 0) {
          newRow.Discountpercent = 0; // Reset % when amount is entered
        } else if (field === "Discountpercent" && Number(value) > 0) {
          newRow.Discount = 0; // Reset amount when % is entered
        }

        if (field === "ServiceCharge" && Number(value) > 0) {
          newRow.SCPercent = 0; // Reset % when amount is entered
        } else if (field === "SCPercent" && Number(value) > 0) {
          newRow.ServiceCharge = 0; // Reset amount when % is entered
        }

        return newRow;
      }
      return row;
    })
  );
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
  const handleDeleteRow = (index) => {
  setTableRows((prev) => prev.filter((_, i) => i !== index));
};

  const [rows, setRows] = useState([]);

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
                          : "Walk-In"
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
                        {cat.CategoryName}
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
                select
                fullWidth
                label="Rate Type"
                value={selectedRateListId}     // controlled value
                onChange={(e) => {
                  setSelectedRateListId(e.target.value);
                  // Clear any previous selections and open popup for this rate type
                  setSelectedServices([]);
                  if (e.target.value) setOpenPopup(true);
                }}
                sx={{ width: "230px", height: "10px" }}
              >
                {createRatelistResponse?.data?.map((item) => (
                  <MenuItem key={item._id} value={item.rateListId}>
                    {item.RateListName}
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
                </Grid>
              </Grid>
            </Box>

            {/* ===== SERVICE TABLE ===== */}
            <Box mt={3}>
            <TableContainer component={Paper}>
      <Table size="small">
        {/* Table Header */}
        <TableHead sx={{ backgroundColor: "#578EE5" }}>
          <TableRow>
            <TableCell sx={{ color: "#fff" }}>Service Name</TableCell>
            <TableCell sx={{ color: "#fff" }}>Rate</TableCell>
            <TableCell sx={{ color: "#fff" }}>Qty</TableCell>
            <TableCell sx={{ color: "#fff" }}>Dis(%)</TableCell>
            <TableCell sx={{ color: "#fff" }}>Discount</TableCell>
            <TableCell sx={{ color: "#fff" }}>S.C.(%)</TableCell>
            <TableCell sx={{ color: "#fff" }}>S.Charge</TableCell>
            <TableCell sx={{ color: "#fff" }}>Net Amt</TableCell>
            <TableCell sx={{ color: "#fff" }}>Remarks</TableCell>
            <TableCell sx={{ color: "#fff" }}>Action</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
       <TableBody>
  {/* CLICK HERE TO ADD SERVICE */}
 
  {/* SHOW ADDED ROWS */}
{tableRows.length > 0 &&
  tableRows.map((row, index) => {
    const result = calculateNetFromAmount(row);
    return (
      <TableRow key={index}>
        <TableCell>
          <TextField
            size="small"
            value={row.ServiceName !== undefined && row.ServiceName !== null ? row.ServiceName : row.FK_ServiceId || ""}
            onChange={(e) => handleInputChange(index, "ServiceName", e.target.value)}
            onClick={() => { setEditingRowIndex(index); setOpenPopup(true); }}
            sx={{ width: 100, cursor: 'pointer' }}
          />
        </TableCell>
        {/* ✅ RATE */}
        <TableCell>
          <TextField
            size="small"
            value={row.RateGeneral || ""}
            onChange={(e) =>
              handleInputChange(index, "RateGeneral", e.target.value)
            }
            sx={{ width: 100 }}
          />
        </TableCell>

        {/* ✅ QTY */}
        <TableCell>
          <TextField
            size="small"
            value={row.Qty || 1}
            onChange={(e) =>
              handleInputChange(index, "Qty", e.target.value)
            }
          />
        </TableCell>

        {/* ✅ DISCOUNT % (EDITABLE) */}
        <TableCell>
          <TextField
            size="small"
            value={row.Discountpercent !== undefined && row.Discountpercent > 0 ? row.Discountpercent : result.discountPercent}
            onChange={(e) =>
              handleInputChange(index, "Discountpercent", e.target.value)
            }
          />
        </TableCell>

        {/* ✅ DISCOUNT AMOUNT (EDITABLE) */}
        <TableCell>
          <TextField
            size="small"
            value={row.Discount !== undefined && row.Discount > 0 ? row.Discount : result.discountAmount}
            onChange={(e) =>
              handleInputChange(index, "Discount", e.target.value)
            }
          />
        </TableCell>

        {/* ✅ SERVICE CHARGE % (EDITABLE) */}
        <TableCell>
          <TextField
            sx={{ width: "80px" }}
            size="small"
            value={row.SCPercent !== undefined && row.SCPercent > 0 ? row.SCPercent : result.serviceChargePercent}
            onChange={(e) =>
              handleInputChange(index, "SCPercent", e.target.value)
            }
          />
        </TableCell>

        {/* ✅ SERVICE CHARGE AMOUNT (EDITABLE) */}
        <TableCell>
          <TextField
            sx={{ width: "80px" }}
            size="small"
            value={row.ServiceCharge !== undefined && row.ServiceCharge > 0 ? row.ServiceCharge : result.serviceChargeAmount}
            onChange={(e) =>
              handleInputChange(index, "ServiceCharge", e.target.value)
            }
          />
        </TableCell>

        {/* ✅ NET AMOUNT (AUTO) */}
        <TableCell>
          <TextField
            sx={{ width: "80px" }}
            size="small"
            value={result.netAmount}
            disabled
          />
        </TableCell>

        <TableCell>
          <TextField
            size="small"
            value={row.Remarks || ""}
            onChange={(e) => handleInputChange(index, "Remarks", e.target.value)}
          />
        </TableCell>

        {/* ✅ DELETE BUTTON */}
        <TableCell>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteRow(index)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          >
            Delete
          </Button>
           <TableCell> </TableCell>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>

      </Table>

      {/* Popup */}
      <Dialog open={openPopup} onClose={() => { setOpenPopup(false); setEditingRowIndex(null); }} fullWidth maxWidth="md">
        <DialogTitle>{editingRowIndex !== null ? 'Choose service to update row' : 'Select Services'}</DialogTitle>
        <DialogContent>
          {filteredRateListDetails?.length ? (
            filteredRateListDetails.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 150px',
                  padding: '8px 0',
                  borderBottom: '1px solid #ddd',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  // toggle checkbox when clicking the row (but not checkbox itself)
                  if (e.target.type !== 'checkbox') {
                    setSelectedServices((prev) => {
                      const isAlreadySelected = prev.some(
                        (service) => service.FK_ServiceId === item.FK_ServiceId
                      );
                      if (isAlreadySelected) {
                        return prev.filter(
                          (service) => service.FK_ServiceId !== item.FK_ServiceId
                        );
                      } else {
                        return [...prev, item];
                      }
                    });
                  }
                }}
              >
                <Checkbox
                  checked={selectedServices.some(
                    (service) => service.FK_ServiceId === item.FK_ServiceId
                  )}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedServices((prev) => {
                      const isAlreadySelected = prev.some(
                        (service) => service.FK_ServiceId === item.FK_ServiceId
                      );
                      if (isAlreadySelected) {
                        return prev.filter(
                          (service) => service.FK_ServiceId !== item.FK_ServiceId
                        );
                      } else {
                        return [...prev, item];
                      }
                    });
                  }}
                />
                <span>{item.FK_ServiceId}{item.ServiceName ? ` — ${item.ServiceName}` : ''}</span>
              </div>
            ))
          ) : (
            <p>No Services Found</p>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => { setOpenPopup(false); setSelectedServices([]); setEditingRowIndex(null); }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={selectedServices.length === 0}
            onClick={() => {
              if (editingRowIndex !== null) {
                // apply first selected to the editing row, add remaining as new rows
                const [first, ...rest] = selectedServices;
                if (first) applyServiceToRow(first, editingRowIndex);
                rest.forEach((item) => onAddRow(item));
                setSelectedServices([]);
                setEditingRowIndex(null);
                setOpenPopup(false);
              } else {
                selectedServices.forEach((item) => onAddRow(item));
                setSelectedServices([]);
                setOpenPopup(false);
              }
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
            </Box>
            {/* ===== PARTY & TOTAL ===== */}
            <Grid container spacing={2} mt={3}>
              <TextField
                select
                fullWidth
                label="Party Name"            
                onChange={(e) => {
                  setPartyName(e.target.value);            
                }}
                sx={{ width: "230px", height: "10px" }}
              >
                {partyNameData?.data?.map((item) => (
                  <MenuItem key={item.FK_CityId} value={item.partyId}>
                    {item.PartyName}
                  </MenuItem>
                ))}
              </TextField>
             
            </Grid>

            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box sx={{ flex: 1, minWidth: "150px" }}>
                <TextField 
                  sx={{ width: 230 }}
                  label="Amount" 
                  size="small" 
                  fullWidth 
                  value={(() => {
                    const totals = calculateBillTotals();
                    const amount = Number(totals.totalNetAmount);
                    if (amount === 100) return 'One Hundred';
                    if (amount === 200) return 'Two Hundred';
                    return amount.toString();
                  })()}
                  disabled
                />
              </Box>
              <Box sx={{ fontSize: 14 }}>
                {(() => {
                  const totals = calculateBillTotals();
                  return (
                    <>
                      <Typography><strong>Total Amount:</strong> {totals.totalGross}</Typography>
                      <Typography><strong>Service Charge:</strong> {totals.totalServiceCharge}</Typography>
                      <Typography><strong>Less Discount:</strong> {totals.totalDiscount}</Typography>
                      <Typography><strong>Net Bill Amount:</strong> {totals.totalNetAmount}</Typography>
                      <Typography><strong>Current Payable:</strong> {totals.totalNetAmount}</Typography>
                    </>
                  );
                })()}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ===== BILLING REMARKS ===== */}
            <TextField label="Billing Remarks" fullWidth size="small" value={billingRemarks} onChange={(e) => setBillingRemarks(e.target.value)} />

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
