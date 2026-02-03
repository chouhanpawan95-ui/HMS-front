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
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateUserMasterMutation, useGetUserMasterNextIdQuery,useLazyGetUserMasterNextIdQuery } from "../../features/api/usermasterApi";
import { useForm, Controller } from "react-hook-form";

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
  const [userTypesSelected, setUserTypesSelected] = useState([]);
  // const { data: usermasternextid } = useGetUserMasterNextIdQuery();
  const [getNextUserId] = useLazyGetUserMasterNextIdQuery();
  // console.log("usermasternextid: ", usermasternextid);
  const navigate = useNavigate();
  // const handleSelect = (event) => {
  //   const value = event.target.value;

  //   setSelectedTypes(
  //     Array.isArray(value)
  //       ? value
  //       : typeof value === 'string'
  //         ? value.split(',')
  //         : []
  //   );
  // };

  const [createUserMaster, { isLoading }] = useCreateUserMasterMutation();

  const handleBack = () => {
    navigate("/UserMaster");
  };

  const {
    register,
    handleSubmit,
    control,
  } = useForm();


  const submit = async (data) => {
    try {
      const nextUserId = await getNextUserId().unwrap();
      console.log("next id:",nextUserId);
      if(!nextUserId){
        throw new Error('Next user id not generated')
      }
      if(typeof nextUserId !== 'string'){
        throw new Error('Invalid PK_UserId receiced')
      }
      await createUserMaster({
        PK_UserId: nextUserId,
        LoginName: data.LoginName,
        UserName: data.UserName,
        ShortName: data.ShortName,
        Password: data.Password,
        Fk_EmployeeId: data.Fk_EmployeeId,
        FK_UserTypeId: Array.isArray(data.FK_UserTypeId)
          ? data.FK_UserTypeId.join(",")
          : data.FK_UserTypeId,
        FK_AuthTypeId: Array.isArray(data.FK_AuthTypeId)
          ? data.FK_AuthTypeId.join(",")
          : data.FK_AuthTypeId,
        FK_SubSpecialtyId: data.FK_SubSpecialtyId,
        FK_DefaultBranchId: data.FK_DefaultBranchId,
        IsEditableBranch: !!data.IsEditableBranch,
        IsPatientTransfer: !!data.IsPatientTransfer,
        IsActive: !!data.IsActive,
      }).unwrap();
      alert('Successfuly saved !!')

    } catch (err) {
      console.error(err);
      alert('Failed to save usermaster!!');
      
    }
  }

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

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField fullWidth label="Login Name" size="small" {...register('LoginName', { required: true })} />
        <TextField fullWidth label="User Name" size="small" {...register('UserName', { required: true })} />
      </Box>

      <TextField fullWidth label="Short Name" size="small" sx={{ mb: 2 }} {...register('ShortName', { required: true })} />
      <TextField fullWidth label="Password" size="small" sx={{ mb: 2 }} {...register('Password', { required: true })} />

      {/* Multi-select dropdown */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>User Type</InputLabel>
        <Controller
          name="FK_UserTypeId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              value={field.value || ""}
              onChange={(e) =>
                field.onChange(
                  Array.isArray(e.target.value)
                    ? e.target.value
                    : e.target.value.split(",")
                )
              }
              renderValue={(selected) =>
                Array.isArray(selected) && selected.length > 0
                  ? selected.join(", ")
                  : ""
              }
            >
              {userTypes.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={Array.isArray(field.value) && field.value.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <TextField fullWidth label="Employee Name" size="small" sx={{ mb: 2 }} />

      {/* Default Auth Type */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Default auth Type</InputLabel>
        <Controller
          name="FK_AuthTypeId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              value={field.value || ""}
              onChange={(e) =>
                field.onChange(
                  Array.isArray(e.target.value)
                    ? e.target.value
                    : e.target.value.split(",")
                )
              }
              renderValue={(selected) =>
                Array.isArray(selected) && selected.length > 0
                  ? selected.join(", ")
                  : ""
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <TextField fullWidth label="Sub Speciality" size="small" sx={{ mb: 2 }} />
      <TextField fullWidth label="Default Branch" size="small" sx={{ mb: 2 }} />

      {/* Radio buttons */}
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Default Branch</FormLabel>
        <RadioGroup row name="defaultBranch">
          <FormControlLabel value="edit" control={<Checkbox {...register('IsEditableBranch')} />} label="Is Editable Branch" />
          <FormControlLabel value="active" control={<Checkbox {...register('IsActive')} />} label="Is Active" />
          <FormControlLabel value="transfer" control={<Checkbox {...register('IsPatientTransfer')} />} label="Is Patient Transfer" />
        </RadioGroup>
      </FormControl>

      {/* Buttons */}
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
        disabled={ isLoading}
        sx={{
          mt: 2,
          backgroundColor: "#1976d2",
          textTransform: "none",
          px: 4,
          ml: 1
        }}
        onClick={handleSubmit(submit)}
      >
        Save
      </Button>
    </Paper>
  );
}
