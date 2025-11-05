import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Alert,
} from "@mui/material";
import { useCreatePatientMutation } from "../features/api/patientsApi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const defaultPatient = {
  patientId: "",
  branch: "",
  branchSelect: "",
  dateTime: new Date().toISOString().slice(0, 16),
  oldNo: "",
  title: "",
  firstName: "",
  lastName: "",
  s_o: "",
  sex: "",
  dateOfBirth: "",
  ageYMD: "",
  nationality: "",
  permanentAddress: {
    addressLine: "",
    country: "",
    stateName: "",
    district: "",
    cityName: "",
    email: "",
    phoneR: "",
    mobileNo: "",
    emergencyNo: "",
    personName: "",
    faxNo: "",
  },
  currentAddress: {
    sameAsPermanent: false,
    addressLine: "",
    country: "",
    stateName: "",
    district: "",
    cityOrVillage: "",
  },
  otherInfo: {
    groupName: "",
    maritalStatus: "",
    bloodGroup: "",
    language: "",
    religion: "",
    occupation: "",
    source: "",
    adharCard: "",
    passportNo: "",
    isBPL: false,
    isTribal: false,
    isDisable: false,
    isVIP: false,
    remarks: "",
  },
};

export default function PatientRegistrationForm() {
  const [patient, setPatient] = useState(defaultPatient);
  const [createPatient, { isLoading, isSuccess, isError, error }] =
    useCreatePatientMutation();

  // Function to calculate age (years) from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return '';
    if (birthDate > today) return '';
    let years = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      years--;
    }
    return String(years);
  };

  // Function to calculate DOB (YYYY-MM-DD) from years
  const calculateDOBFromYears = (years) => {
    const y = parseInt(years, 10);
    if (isNaN(y) || y < 0 || y > 150) return '';
    const today = new Date();
    const dob = new Date(today);
    dob.setFullYear(today.getFullYear() - y);
    return dob.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Nested fields like 'permanentAddress.cityName'
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPatient((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
      return;
    }

    // Date of birth changed -> update age (years)
    if (name === 'dateOfBirth') {
      if (!value) {
        setPatient((prev) => ({ ...prev, dateOfBirth: '', ageYMD: '' }));
        return;
      }
      const dt = new Date(value);
      if (dt > new Date()) return; // block future dates
      setPatient((prev) => ({
        ...prev,
        dateOfBirth: value,
        ageYMD: calculateAge(value),
      }));
      return;
    }

    // Age (years) changed -> update DOB
    if (name === 'ageYMD') {
      // accept only numbers
      const numeric = value.toString().replace(/\D/g, '');
      if (numeric === '') {
        setPatient((prev) => ({ ...prev, ageYMD: '', dateOfBirth: '' }));
        return;
      }
      let years = parseInt(numeric, 10);
      if (isNaN(years)) return;
      if (years < 0) years = 0;
      if (years > 150) years = 150;
      const dob = calculateDOBFromYears(years);
      setPatient((prev) => ({ ...prev, ageYMD: String(years), dateOfBirth: dob }));
      return;
    }

    // Regular fields
    setPatient((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatient(patient).unwrap();
      setPatient(defaultPatient);
    } catch (err) {
      console.error("Failed to create patient:", err);
    }
  };

  const handleReset = () => setPatient(defaultPatient);

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
        <form onSubmit={handleSubmit}>
          {/* HEADER */}
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="primary"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Patient Registration
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            textAlign="center"
            mb={2}
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Please fill in the details below to register a new patient.
          </Typography>

          {/* PERSONAL INFO */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Personal Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={4}>
                {[
                  { label: "Patient ID", name: "patientId" },
                  { label: "Branch", name: "branch" },
                  {
                    label: "Date & Time",
                    name: "dateTime",
                    type: "datetime-local",
                    shrink: true,
                    disabled: true,

                  },
                  { label: "Old No", name: "oldNo" },
                ].map((field) => (
                  <Grid item xs={12} sm={6} md={3} key={field.name}>
                    {/* <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type || "text"}
                      InputLabelProps={field.shrink ? { shrink: true } : {}}
                      value={patient[field.name]}
                      onChange={handleChange}
                      size="small"
                    /> */}
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type || "text"}
                      InputLabelProps={field.shrink ? { shrink: true } : {}}
                      value={patient[field.name]}
                      onChange={handleChange}
                      size="small"
                      disabled={field.disabled || false}           // ✅ visually disabled
                      inputProps={{ readOnly: field.disabled }}    // ✅ prevents opening calendar
                      onClick={(e) => field.disabled && e.preventDefault()} // ✅ block popup click
                    />
                  </Grid>
                ))}

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Title"
                    name="title"
                    fullWidth
                    value={patient.title}
                    onChange={handleChange}
                    size="small"
                    sx={{ width: 70 }}
                  >
                    <MenuItem value="Mr">Mr</MenuItem>
                    <MenuItem value="Mrs">Mrs</MenuItem>
                    <MenuItem value="Miss">Miss</MenuItem>
                  </TextField>
                </Grid>

                {[
                  { label: "First Name", name: "firstName" },
                  { label: "Last Name", name: "lastName" },
                  { label: "S/O", name: "s_o" },
                ].map((field) => (
                  <Grid item xs={12} sm={6} md={3} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={patient[field.name]}
                      onChange={handleChange}
                      size="small"
                    />
                  </Grid>
                ))}

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Sex"
                    name="sex"
                    fullWidth
                    value={patient.sex}
                    onChange={handleChange}
                    size="small"
                    sx={{ width: 70 }}
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={patient.dateOfBirth}
                    onChange={handleChange}
                    size="small"
                    inputProps={{
                      max: new Date().toISOString().split('T')[0] // Prevents future dates
                    }}
                    helperText={
                      patient.dateOfBirth > new Date().toISOString().split('T')[0]
                        ? "Future dates not allowed"
                        : "Select date to auto-calculate age"
                    }
                    error={patient.dateOfBirth > new Date().toISOString().split('T')[0]}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Age (Years)"
                    name="ageYMD"
                    value={patient.ageYMD}
                    onChange={handleChange}
                    size="small"
                    type="text"
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      maxLength: 3
                    }}
                    helperText="Enter age in years (0-150)"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Nationality"
                    name="nationality"
                    value={patient.nationality}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* ADDRESS */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Address & Contact Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="primary">
                    Permanent Address
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Address Line"
                    name="permanentAddress.addressLine"
                    value={patient.permanentAddress.addressLine}
                    onChange={handleChange}
                    size="small"
                    sx={{ width: "14rem" }}
                  />
                </Grid>

                {[
                  "cityName",
                  "stateName",
                  "country",
                  "district",
                  "mobileNo",
                  "phoneR",
                  "emergencyNo",
                  "email",
                  "personName",
                  "faxNo",
                ].map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field}>
                    <TextField
                      fullWidth
                      label={field.replace(/([A-Z])/g, " $1")}
                      name={`permanentAddress.${field}`}
                      value={patient.permanentAddress[field]}
                      onChange={handleChange}
                      size="small"
                    />
                  </Grid>
                ))}

                {/* CURRENT ADDRESS */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" sx={{ mt: 2, mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ mr: 2 }} // small space between text and checkbox
                    >
                      Current Address
                    </Typography>

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="currentAddress.sameAsPermanent"
                          checked={patient.currentAddress.sameAsPermanent}
                          onChange={handleChange}
                        />
                      }
                      label="Same as Permanent Address"
                      sx={{ m: 0 }} // remove extra margin
                    />
                  </Box>
                </Grid>


                {!patient.currentAddress.sameAsPermanent && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Address Line"
                        name="currentAddress.addressLine"
                        value={patient.currentAddress.addressLine}
                        onChange={handleChange}
                        size="small"
                        sx={{ width: "14rem" }}
                      />
                    </Grid>

                    {["cityOrVillage", "stateName", "district", "country"].map(
                      (field) => (
                        <Grid item xs={12} sm={6} md={4} key={field}>
                          <TextField
                            fullWidth
                            label={field.replace(/([A-Z])/g, " $1")}
                            name={`currentAddress.${field}`}
                            value={patient.currentAddress[field]}
                            onChange={handleChange}
                            size="small"
                          />
                        </Grid>
                      )
                    )}
                  </>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* OTHER INFO */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Other Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {[
                  "groupName",
                  "maritalStatus",
                  "bloodGroup",
                  "language",
                  "religion",
                  "occupation",
                  "source",
                  "adharCard",
                  "passportNo",
                ].map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field}>
                    <TextField
                      fullWidth
                      label={field.replace(/([A-Z])/g, " $1")}
                      name={`otherInfo.${field}`}
                      value={patient.otherInfo[field]}
                      onChange={handleChange}
                      size="small"
                    />
                  </Grid>
                ))}

                {["isBPL", "isTribal", "isDisable", "isVIP"].map((flag) => (
                  <Grid item xs={12} sm={6} md={3} key={flag}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={`otherInfo.${flag}`}
                          checked={patient.otherInfo[flag]}
                          onChange={handleChange}
                        />
                      }
                      label={flag.replace("is", "Is ")}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Remarks"
                    name="otherInfo.remarks"
                    value={patient.otherInfo.remarks}
                    onChange={handleChange}
                    size="small"
                    sx={{ width: "14rem" }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* BUTTONS */}
          <Box
            display="flex"
            justifyContent="flex-end"
            flexWrap="wrap"
            gap={2}
            mt={3}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={isLoading}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {isLoading ? "Saving..." : "Submit"}
            </Button>
          </Box>
        </form>

        {isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Patient registered successfully!
          </Alert>
        )}

        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error?.data?.message || "Failed to register patient"}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
