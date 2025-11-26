import React, { useState, useEffect } from "react";
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
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Button
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

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

export default function UserMasterEditForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL

  // ---------- State ---------
  const [formData, setFormData] = useState({
    loginName: "",
    userName: "",
    shortName: "",
    password: "",
    userType: [],
    defaultAuth: [],
    subSpeciality: "",
    defaultBranch: "",
    editableBranch: false,
    isActive: false,
    patientTransfer: false
  });

  // ---------- Load user data on edit ---------
  useEffect(() => {
    // API CALL (example)
    // fetch(`/api/user/${id}`).then(res => res.json()).then(data => setFormData(data));

    // For now using dummy pre-filled values:
    setFormData({
      loginName: "john123",
      userName: "John Doe",
      shortName: "JD",
      password: "123456",
      userType: ["Doctor", "Pharmacy"],
      defaultAuth: ["Doctor"],
      subSpeciality: "Eye",
      defaultBranch: "Main Branch",
      editableBranch: true,
      isActive: true,
      patientTransfer: false
    });
  }, [id]);

  // ---------- Handle Change ----------
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked
    });
  };

  // ---------- Back ----------
  const handleBack = () => navigate("/UserMaster");

  // ---------- Save ----------
  const handleSave = () => {
    console.log("Updated Data:", formData);
    // API PUT here
    // fetch(`/api/user/${id}`, { method: "PUT", body: JSON.stringify(formData) })
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
        Edit User Master
      </Typography>

      <TextField
        fullWidth
        label="Login Name"
        size="small"
        sx={{ mb: 2 }}
        value={formData.loginName}
        onChange={handleChange("loginName")}
      />

      <TextField
        fullWidth
        label="User Name"
        size="small"
        sx={{ mb: 2 }}
        value={formData.userName}
        onChange={handleChange("userName")}
      />

      <TextField
        fullWidth
        label="Short Name"
        size="small"
        sx={{ mb: 2 }}
        value={formData.shortName}
        onChange={handleChange("shortName")}
      />

      <TextField
        fullWidth
        label="Password"
        size="small"
        sx={{ mb: 2 }}
        value={formData.password}
        onChange={handleChange("password")}
      />

      {/* User Type */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>User Type</InputLabel>
        <Select
          multiple
          value={formData.userType}
          onChange={handleChange("userType")}
          renderValue={(selected) => selected.join(", ")}
        >
          {userTypes.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={formData.userType.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Default Auth */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Default Auth Type</InputLabel>
        <Select
          multiple
          value={formData.defaultAuth}
          onChange={handleChange("defaultAuth")}
          renderValue={(selected) => selected.join(", ")}
        >
          {userTypes.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={formData.defaultAuth.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Sub Speciality"
        size="small"
        sx={{ mb: 2 }}
        value={formData.subSpeciality}
        onChange={handleChange("subSpeciality")}
      />

      <TextField
        fullWidth
        label="Default Branch"
        size="small"
        sx={{ mb: 2 }}
        value={formData.defaultBranch}
        onChange={handleChange("defaultBranch")}
      />

      {/* Radio Section */}
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Default Branch Settings</FormLabel>
        <RadioGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.editableBranch}
                onChange={handleCheckboxChange("editableBranch")}
              />
            }
            label="Is Editable Branch"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={handleCheckboxChange("isActive")}
              />
            }
            label="Is Active"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.patientTransfer}
                onChange={handleCheckboxChange("patientTransfer")}
              />
            }
            label="Is Patient Transfer"
          />
        </RadioGroup>
      </FormControl>

      {/* Buttons */}
      <Button
        variant="outlined"
        sx={{ mt: 2, borderColor: "#1976d2", color: "#1976d2" }}
        onClick={handleBack}
      >
        Back
      </Button>

      <Button
        variant="contained"
        sx={{ mt: 2, ml: 1, backgroundColor: "#1976d2", textTransform: "none" }}
        onClick={handleSave}
      >
        Update
      </Button>
    </Paper>
  );
}
