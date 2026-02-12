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

const IPDRegistration = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    bookingType: "direct",
    ageSex: "",
    patientName: "",
    IsDischarge: false,
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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    console.log("IPD Form Data :", formData);
    // 👉 Call API here
  };

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
          <TextField
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
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
    </Box>
  );
};

export default IPDRegistration;
