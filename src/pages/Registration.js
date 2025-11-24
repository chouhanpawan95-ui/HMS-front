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
import {useGetPatientIdQuery } from "../features/api/patientsApi";

const now = new Date();
const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
const defaultPatient = {
  patientId: "",
  branch: "",
  branchSelect: "",
  dateTime: ist.toISOString().slice(0, 16),
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
    phone: "",
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
  const [errors, setErrors] = useState({});
  const [createPatient, { isLoading, isSuccess, isError, error }] =
    useCreatePatientMutation();
  const { data: PatientId } = useGetPatientIdQuery();
  console.log("Next PatientId:", PatientId?.nextId ?? "");
  // required fields config (edit this array to change which fields are required)
  const requiredFields = [
    "patientId",
    "branch",
    "title",
    "firstName",
    "lastName",
    "dateOfBirth",
  ];
React.useEffect(() => {
  if (PatientId?.nextId) {
    setPatient((prev) => ({
      ...prev,
      patientId: PatientId.nextId,
    }));
  }
}, [PatientId]);

  // Function to calculate age (years) from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return "";
    if (birthDate > today) return "";
    let years = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      years--;
    }
    return String(years);
  };

  // Function to calculate DOB (YYYY-MM-DD) from years
  const calculateDOBFromYears = (years) => {
    const y = parseInt(years, 10);
    if (isNaN(y) || y < 0 || y > 150) return "";
    const today = new Date();
    const dob = new Date(today);
    dob.setFullYear(today.getFullYear() - y);
    return dob.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for the field being edited
    // If nested (permanentAddress.cityName) clear parent key's error (if any)
    const errorKey = name.includes(".") ? name.split(".")[0] : name;
    setErrors((prev) => {
      if (!prev[errorKey]) return prev;
      const copy = { ...prev };
      delete copy[errorKey];
      return copy;
    });

    // Nested fields like 'permanentAddress.cityName'
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPatient((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    // Date of birth changed -> update age (years)
    if (name === "dateOfBirth") {
      if (!value) {
        setPatient((prev) => ({ ...prev, dateOfBirth: "", ageYMD: "" }));
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
    if (name === "ageYMD") {
      // accept only numbers
      const numeric = value.toString().replace(/\D/g, "");
      if (numeric === "") {
        setPatient((prev) => ({ ...prev, ageYMD: "", dateOfBirth: "" }));
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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    let temp = {};

    if (requiredFields.includes("patientId") && !patient.patientId)
      temp.patientId = "Patient ID is required";
    if (requiredFields.includes("branch") && !patient.branch)
      temp.branch = "Branch is required";
    if (requiredFields.includes("title") && !patient.title)
      temp.title = "Title is required";
    if (requiredFields.includes("firstName") && !patient.firstName)
      temp.firstName = "First Name is required";
    if (requiredFields.includes("lastName") && !patient.lastName)
      temp.lastName = "Last Name is required";
    if (requiredFields.includes("dateOfBirth") && !patient.dateOfBirth)
      temp.dateOfBirth = "Date of Birth is required";
    if (!patient.permanentAddress.addressLine) temp["permanentAddress.addressLine"] = "Address is requiered";
    if (!patient.permanentAddress.mobileNo) { temp["permanentAddress.mobileNo"] = "Mobile No is requiered"; }
    if (!patient.permanentAddress.district) { temp["permanentAddress.district"] = "District is requiered"; }
    if (!patient.permanentAddress.cityName) { temp["permanentAddress.cityName"] = "City Name is requiered"; }
    if (!patient.permanentAddress.stateName) { temp["permanentAddress.stateName"] = "State Name is requiered"; }
    if (!patient.permanentAddress.country) { temp["permanentAddress.country"] = "Country is requiered"; }


    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      // keep the accordion open and focus is optional — here we simply stop submit
      return;
    }
    try {
      await createPatient(patient).unwrap();
      setPatient(defaultPatient);
      setErrors({});
    } catch (err) {
      console.error("Failed to create patient:", err);
    }
  };

  const handleReset = () => {
    setPatient(defaultPatient);
    setErrors({});
  };

  const isFutureDOB = patient.dateOfBirth
    ? new Date(patient.dateOfBirth) > new Date()
    : false;

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
        <form onSubmit={handleSubmit} noValidate>
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Patient ID"
                    name="patientId"
                    value={PatientId?.nextId ?? ""}
                    onChange={handleChange}
                    size="small"
                    type="text"  
                    disabled                
                  />
                </Grid>                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Branch"
                    name="branch"                   
                    onChange={handleChange}
                    size="small"
                    type="text"                                    
                  />                  
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date & Time"
                    name="dateTime" 
                    value={patient.dateTime}                  
                    onChange={handleChange}
                    size="small"
                    type="text"                                    
                  />                  
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Old No"
                    name="oldNo" 
                    value={patient.oldNo}                  
                    onChange={handleChange}
                    size="small"
                    type="text"                                    
                  />                  
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Title"
                    name="title"
                    fullWidth
                    required={requiredFields.includes("title")}
                    value={patient.title}
                    onChange={handleChange}
                    size="small"
                    sx={{ width: 70 }}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
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
                      required={requiredFields.includes(field.name)}
                      label={field.label}
                      name={field.name}
                      value={patient[field.name]}
                      onChange={handleChange}
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name]}
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
                    required={requiredFields.includes("dateOfBirth")}
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={patient.dateOfBirth}
                    onChange={handleChange}
                    size="small"
                    inputProps={{
                      max: new Date().toISOString().split("T")[0], // Prevents future dates
                    }}
                    error={Boolean(errors.dateOfBirth) || isFutureDOB}
                    helperText={
                      errors.dateOfBirth
                        ? errors.dateOfBirth
                        : isFutureDOB
                          ? "Future dates not allowed"
                          : "Select date to auto-calculate age"
                    }
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
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 3,
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

          {/*  ADDRESS */ }
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
                    required
                    rows={3}
                    label="Address Line"
                    name="permanentAddress.addressLine"
                    error={Boolean(errors["permanentAddress.addressLine"])}
                    helperText={errors["permanentAddress.addressLine"]}
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
                      error={Boolean(errors[`permanentAddress.${field}`])}
                      helperText={errors[`permanentAddress.${field}`]}
                    />
                  </Grid>
                ))}

                {/* CURRENT ADDRESS */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" sx={{ mt: 2, mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ mr: 2 }}
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
                      sx={{ m: 0 }}
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
          <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap={2} mt={3}>
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
