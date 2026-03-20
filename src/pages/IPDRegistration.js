import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  MenuItem,
  Paper,
  Button,
} from "@mui/material";
import { useCreateIPDRegistrationMutation } from "../features/api/patientsApi";
const IPDRegistration = () => {
  const { patientId } = useParams();
  console.log("Received patientId from URL:", patientId);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createIPDRegistration, { isLoading, isSuccess, isError, error }] =
    useCreateIPDRegistrationMutation();
  console.log("useCreateIPDRegistrationMutation:", createIPDRegistration, isLoading, isSuccess, isError, error);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  patientId: patientId || "",
  bookingType: "direct",
  ageSex: "",
  patientName: "",
  isDischarge: false,
  mlc: false,
  admissionId: "",
  admissionDate: "",
  discharge: "",
  guardian: "",
  referredBy: "",
  consultant: "",
  wardName: "",
  remarks: "",
  rateType: "",
  partyName: "",

  // NEW FIELDS
  FK_BedID: "",
  FromDate: "",
  FromTime: "",
  ToDate: "",
  ToTime: "",
  FK_CreatedByID: "",
  FK_BillingBedID: "",
});


  // Update patientId when URL parameter changes
  useEffect(() => {
    if (patientId) {
      setFormData((prev) => ({
        ...prev,
        patientId: patientId,
      }));
    }
  }, [patientId]);


const handleSave = async () => {
  try {
    const payload = {
      ...formData,
      FK_IPDID: formData.patientId, // 👈 add this
       FK_BedID: formData.FK_BedID,

      FromDate: formData.FromDate,
      FromTime: formData.FromTime,

      ToDate: formData.ToDate,
      ToTime: formData.ToTime,

      FK_CreatedByID: formData.FK_CreatedByID,

      FK_BillingBedID: formData.FK_BillingBedID,
    };

    await createIPDRegistration(payload).unwrap();
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/layout/Dashboard");
    }, 2500);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (isError) {
    alert(error?.data?.message || "Something went wrong");
  }
}, [isError]);
 const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
if (showSuccess) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafc",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#ffffff",
          width: 350,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "8px solid #5C8FD6",   // ✅ Blue circle
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <Typography
            sx={{
              fontSize: 60,
              color: "#5C8FD6",   // ✅ Blue tick
              fontWeight: "bold",
            }}
          >
            ✓
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1F2A44", mb: 1 }}
        >
          Thank you!
        </Typography>

        <Typography variant="body1" sx={{ color: "#555" }}>
          Your submission has been sent.
        </Typography>
      </Paper>
    </Box>
  );
}


  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: { xs: "100%", md: 1000 },
          mx: "auto",
          borderRadius: 3,
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "white",
          mt: { xs: 6, sm: 8 },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          IPD Registration
        </Typography>

        <Grid container spacing={2}>
          {/* Patient ID */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Patient ID"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!!patientId}
              variant="outlined"
            />
          </Grid>

          {/* Direct / With Booking */}
          <Grid item xs={12} md={4}>
            <RadioGroup
              row
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
            >
              <FormControlLabel value="direct" control={<Radio />} label="Direct" />
              <FormControlLabel value="booking" control={<Radio />} label="With Booking" />
            </RadioGroup>
          </Grid>
{/* Bed ID */}
<Grid item xs={12} md={4}>
  <TextField
    label="Bed ID"
    name="FK_BedID"
    value={formData.FK_BedID}
    onChange={handleChange}
    fullWidth
    size="small"
  />
</Grid>

{/* From Date */}
<Grid item xs={12} md={4}>
  <TextField
    label="From Date"
    type="date"
    name="FromDate"
    value={formData.FromDate}
    onChange={handleChange}
    fullWidth
    size="small"
    InputLabelProps={{ shrink: true }}
  />
</Grid>

{/* From Time */}
<Grid item xs={12} md={4}>
  <TextField
    label="From Time"
    type="time"
    name="FromTime"
    value={formData.FromTime}
    onChange={handleChange}
    fullWidth
    size="small"
    InputLabelProps={{ shrink: true }}
  />
</Grid>

{/* To Date */}
<Grid item xs={12} md={4}>
  <TextField
    label="To Date"
    type="date"
    name="ToDate"
    value={formData.ToDate}
    onChange={handleChange}
    fullWidth
    size="small"
    InputLabelProps={{ shrink: true }}
  />
</Grid>

{/* To Time */}
<Grid item xs={12} md={4}>
  <TextField
    label="To Time"
    type="time"
    name="ToTime"
    value={formData.ToTime}
    onChange={handleChange}
    fullWidth
    size="small"
    InputLabelProps={{ shrink: true }}
  />
</Grid>

{/* Created By */}
<Grid item xs={12} md={4}>
  <TextField
    label="Created By"
    name="FK_CreatedByID"
    value={formData.FK_CreatedByID}
    onChange={handleChange}
    fullWidth
    size="small"
  />
</Grid>

{/* Billing Bed ID */}
<Grid item xs={12} md={4}>
  <TextField
    label="Billing Bed ID"
    name="FK_BillingBedID"
    value={formData.FK_BillingBedID}
    onChange={handleChange}
    fullWidth
    size="small"
  />
</Grid>

          {/* Age / Sex */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Age / Sex"
              name="ageSex"
              value={formData.ageSex}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Patient Name */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Is Discharge / MLC */}
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isDischarge"
                  checked={formData.isDischarge}
                  onChange={handleChange}
                />
              }
              label="Is Discharge"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="mlc"
                  checked={formData.mlc}
                  onChange={handleChange}
                />
              }
              label="MLC"
            />
          </Grid>

          {/* Admission ID */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Admission ID"
              name="admissionId"
              value={formData.admissionId}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Admission Date */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Admission Date"
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Discharge */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Discharge"
              name="discharge"
              value={formData.discharge}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Guardian */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Guardian"
              name="guardian"
              value={formData.guardian}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Referred By */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Referred By"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Consultant */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Consultant"
              name="consultant"
              value={formData.consultant}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Ward Name */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Ward Name"
              name="wardName"
              value={formData.wardName}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Remarks */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Rate Type */}
          <Grid item xs={12} md={4}>
            <TextField sx={{width:110}}
              label="Rate Type"
              name="rateType"
              value={formData.rateType}
              onChange={handleChange}
              select
              fullWidth
              size="small"
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="insurance">Insurance</MenuItem>
            </TextField>
          </Grid>

          {/* Party Name */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Party Name"
              name="partyName"
              value={formData.partyName}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Save and Back Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>

            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default IPDRegistration;
