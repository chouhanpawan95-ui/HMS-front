import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Paper,  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const userTypes = [
  "Reception",
  "History & Examination",
  "Clinical Department",
  "Auto Ref",
  "Optometrist",
  "Doctor",
  "Counselor",
  "Procedure",
  "Admin",
  "Nursing",
  "Pharmacy",
  "Stores"
];

export default function UserMasterForm() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const navigate = useNavigate();
  const handleSelect = (event) => {
    setSelectedTypes(event.target.value);
  };
const handleBack = () => {
    navigate("/UserMaster"); // or navigate(-1)
  };
  return (
    <Paper
      elevation={3}
      sx={{
        width: 450,
        m: "90px auto",
        p: 3,
        bgcolor: "#fff",
        borderTop: "6px solid #1976d2"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
        User Master
      </Typography>

      <TextField fullWidth label="Login Name" size="small" sx={{ mb: 2 }} />
      <TextField fullWidth label="User Name" size="small" sx={{ mb: 2 }} />
      <TextField fullWidth label="Short Name" size="small" sx={{ mb: 2 }} />
      <TextField fullWidth label="Password" size="small" sx={{ mb: 2 }} />

      {/* Multi-select dropdown with checkbox */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>User Type</InputLabel>
        <Select
          multiple
          value={selectedTypes}
          onChange={handleSelect}
          renderValue={(selected) => selected.join(", ")}
        >
          {userTypes.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selectedTypes.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField fullWidth label="Employee Name" size="small" sx={{ mb: 2 }} />
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Default auth Type</InputLabel>
        <Select
          multiple
          value={selectedTypes}
          onChange={handleSelect}
          renderValue={(selected) => selected.join(", ")}
        >
          {userTypes.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selectedTypes.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    <TextField fullWidth label="Sub Speciality" size="small" sx={{ mb: 2 }} />
    <TextField fullWidth label="Default Branch" size="small" sx={{ mb: 2 }} />
    <FormControl sx={{ mb: 2 }}>
  <FormLabel>Default Branch</FormLabel>
  <RadioGroup row name="defaultBranch">
    <FormControlLabel value="Branch" control={<Radio />} label="Is Editable Branch" />
    <FormControlLabel value="Branch" control={<Radio />} label="Is Active" />
    <FormControlLabel value="Branch" control={<Radio />} label="Is Patient Transfer" />
  </RadioGroup>
</FormControl>
 <Button
          variant="outlined"
          sx={{
            mt: 2,
            textTransform: "none",
            borderColor: "#1976d2",
            color: "#1976d2"
          }}
          onClick={handleBack}
        >
          Back
        </Button>
<Button
  variant="contained"
  sx={{
    mt: 2,
    backgroundColor: "#1976d2",
    textTransform: "none",
    px: 4,
    ml: 1
  }}
>
  Save
</Button>

    </Paper>
  );
}
