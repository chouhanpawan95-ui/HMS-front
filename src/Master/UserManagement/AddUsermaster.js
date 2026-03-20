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
  FormGroup,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateUserMasterMutation, useGetUserMasterNextIdQuery, useLazyGetUserMasterNextIdQuery } from "../../features/api/usermasterApi";
import { useForm, Controller } from "react-hook-form";
import style from "../BillingMaster/RateListMaster.module.css";
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
  // const { data: usermasternextid } = useGetUserMasterNextIdQuery();
  const [getNextUserId] = useLazyGetUserMasterNextIdQuery();
  // console.log("usermasternextid: ", usermasternextid);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [createUserMaster, { isLoading }] = useCreateUserMasterMutation();
  const handleBack = () => {
    navigate("/layout/UserMaster");
  };
  const {
    register,
    handleSubmit,
    control,
    errors,
  } = useForm();

  const normalizeArray = (v) =>
    Array.isArray(v) ? v.join(",") : v || "";

  const submit = async (data) => {
    try {
      const nextUserId = await getNextUserId().unwrap();
      if (!nextUserId || typeof nextUserId !== "string") {
        throw new Error("Invalid User ID");
      }
      const payload = {
        PK_UserId: nextUserId,
        LoginName: data.LoginName,
        UserName: data.UserName,
        ShortName: data.ShortName,
        Password: data.Password,
        // ✅ Multi select → string
        FK_UserTypeId: normalizeArray(data.FK_UserTypeId),
        // ✅ Single select → direct value (FIXED)
        FK_AuthTypeId: data.FK_AuthTypeId || "",
        // ✅ Multi select → string (FIXED)
        Fk_EmployeeId: normalizeArray(data.Fk_EmployeeId),
        ScheduleWeekDays: normalizeArray(data.ScheduleWeekDays),
        FK_SubSpecialtyId: data.FK_SubSpecialtyId,
        FK_DefaultBranchId: data.FK_DefaultBranchId,
        FK_LoginBranchId: data.FK_LoginBranchId,
        RoomNo: data.RoomNo,
        DefaultRoomNo: data.DefaultRoomNo,
        Discount: Number(data.Discount) || 0,
        MobileNo: data.MobileNo,
        Email: data.Email,
        DOB: data.DOB,
        // ✅ booleans safe
        IsEditableBranch: !!data.IsEditableBranch,
        IsPatientTransfer: !!data.IsPatientTransfer,
        IsActive: !!data.IsActive,
      };

      await createUserMaster(payload).unwrap();
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/layout/UserMaster");
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
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
            Saved Successfully.
          </Typography>
        </Paper>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#f4f4f4',
        minHeight: '100vh'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: { xs: '100%', md: 1000 },
          mx: "auto",
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#fff",
          borderTop: "6px solid #1976d2",
          overflow: 'hidden',
          mt: { xs: 2, sm: 2 }
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }} className={style.header}>
            User Master
          </Typography>
        </Box>

        <Box
        >
          <form onSubmit={handleSubmit(submit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Login Name" size="small" {...register('LoginName', { required: true })} error={!!errors?.LoginName} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="User Name" size="small" {...register('UserName', { required: true })} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Short Name" size="small" sx={{ mb: 2 }} {...register('ShortName', { required: true })} />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Password"
                  size="small"
                  sx={{ mb: 2 }}
                  {...register('Password', {
                    required: true,
                    minLength: { value: 6, message: "Min 6 Chars" }
                  })} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>{/* Multi-select dropdown */}
                <FormControl fullWidth size="small" sx={{ mb: 2, width: 250 }}>
                  <InputLabel>User Type</InputLabel>
                  <Controller
                    name="FK_UserTypeId"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        multiple
                        label="User Type"
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 250,   // 🔥 scroll like your image
                              width: 120,
                            },
                          },
                        }}
                      >
                        {/* HEADER ROW */}
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            py: 1,
                            fontWeight: "bold",
                            borderBottom: "1px solid #ccc",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>UserType</Box>
                          <Box sx={{ width: 90, textAlign: "center" }}>IsActive</Box>
                        </Box>

                        {/* LIST */}
                        {userTypes.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* Left: Name */}
                            <ListItemText primary={name} />

                            {/* Right: Checkbox */}
                            <Checkbox
                              checked={field.value.indexOf(name) > -1}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl></Grid>
              <Grid item xs={12} sm={6} md={4}> {/* Default Auth Type */}
                <FormControl fullWidth size="small" sx={{ mb: 2, width: 200 }}>
                  <InputLabel>Default Auth Type</InputLabel>
                  <Controller
                    name="FK_AuthTypeId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Default Auth Type"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {[
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
                        ].map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl></Grid>
            </Grid>
            {/* <Grid container spacing={2} mt={1}> */}
            {/* <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Login Branch Id" size="small" sx={{ mb: 2 }} {...register('FK_LoginBranchId')} /></Grid> */}
            {/* <Grid item xs={12} sm={6} md={4}><TextField label="Login Status" fullWidth size="small" sx={{ mb: 2 }} {...register('LoginStatus')} /></Grid> */}
            {/* <Grid item xs={12} sm={6} md={4}><TextField label='Login IP' fullWidth size="small" {...register('LoginIP')} /></Grid> */}
            {/* <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" {...register('LoginDateTime')} type="datetime-local" /></Grid>
            </Grid> */}
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small" sx={{ mb: 2, width: 250 }}>
                  <InputLabel>Employee Name</InputLabel>

                  <Controller
                    name="Fk_EmployeeId"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        multiple
                        label="Employee Name"
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 250,
                              width: 280,
                            },
                          },
                        }}
                      >
                        {/* HEADER */}
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            py: 1,
                            fontWeight: "bold",
                            borderBottom: "1px solid #ccc",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>Person Name</Box>
                          <Box sx={{ width: 80, textAlign: "center" }}>Select</Box>
                        </Box>
                        {/* OPTIONS */}
                        {[
                          "Hospital Case",
                          "Other Hospital",
                          "Dr.Sunnel",
                          "Dr Verma"
                        ].map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <ListItemText primary={name} />
                            <Checkbox checked={field.value.indexOf(name) > -1} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Sub Speciality" size="small" sx={{ mb: 2 }} {...register('FK_SubSpecialtyId')} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Default Branch" size="small" sx={{ mb: 2 }} {...register('FK_DefaultBranchId')} /></Grid>
            </Grid>
             <Grid item xs={12} sm={6} md={4}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Email"
                  type='email'
                  size="small"
                  fullWidth
                  {...register('Email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid emai address'
                    }
                  })}
                />
              </Grid>
              </Grid>
            {/* <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Dept Id" size="small" sx={{ mb: 2 }} {...register('FK_DeptID')} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Default Service Dept Id" size="small" sx={{ mb: 2 }} {...register('FK_DefaultServiceDeptID')} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Diagnosis Dept" {...register('DiagnosisDept')} fullWidth size="small" /></Grid>
            </Grid> */}

            {/* <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Room No" size="small" sx={{ mb: 2 }}  {...register('RoomNo')} type="number" /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label='Default Room No' size="small" sx={{ mb: 2 }} {...register('DefaultRoomNo')} type="number" /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label='Default Optom ID' {...register('DefaultOptomID')} size="small" fullWidth /></Grid>
            </Grid> */}
            {/* 
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Doctor Page" {...register('DoctorPage')} fullWidth size="small" /></Grid>
              <Grid item xs={12} sm={6} md={4}><FormControlLabel value="doctorWorkupPatternScreen" control={<Checkbox {...register('DoctorWorkupPatternScreen')} />} label="Doctor Workup Pattern Screen" /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel value="help" control={<Checkbox {...register('PRHelpF3')} />} label="PRHelp F3" /></Grid>

            </Grid> */}

            {/* <Grid container spacing={2} mt={1}>
          
              <FormControl sx={{ mb: 2 }}>
                <FormLabel component="legend">Schedule Week Days</FormLabel>
                <FormGroup row>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <FormControlLabel
                      key={day}
                      control={<Checkbox {...register("ScheduleWeekDays")} value={day} />}
                      label={day}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid> */}

            {/* <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField 
                  label="Discount" 
                  type='number'
                  {...register('Discount',{
                    min:{value:0, message:'Must be >= 0'}
                  })} 
                  size="small" 
                  fullWidth /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel value="teleConsultation" control={<Checkbox {...register('TeleConsultation')} />} label="TeleConsultation" /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel value="netConsultation" control={<Checkbox {...register('NetConsultation')} />} label="NetConsultation" /></Grid>
            </Grid> */}

            {/* <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Mobile"
                  type='tel'
                  size="small" fullWidth
                  {...register('MobileNo', {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Invalid mobile no'
                    }
                  })} /></Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Email"
                  type='email'
                  size="small"
                  fullWidth
                  {...register('Email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid emai address'
                    }
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small" sx={{ width:100}}>
                  <InputLabel>Gender</InputLabel>
                  <Controller
                    name="Gender"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        label="Gender"
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {gender.map((g) => (
                          <MenuItem key={g} value={g}>{g}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField placeholder="Adhar, PAN" label="National ID" size="small" fullWidth  {...register('NationalID')} /></Grid>
            </Grid> */}

            {/* <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}><TextField label="Registration No" size="small" fullWidth {...register('RegistrationNo')} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Clinic Name" size="small" fullWidth  {...register('ClinicName')} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Specilization" size="small" fullWidth  {...register('Specialization')} /></Grid>
            </Grid> */}
            <Grid container spacing={2} mt={1}>
              {/* Radio buttons */}
              <FormControl sx={{ mb: 2 }}>
                {/* <FormLabel>Default Branch</FormLabel> */}
                <RadioGroup row name="defaultBranch">
                  <FormControlLabel value="edit" control={<Checkbox {...register('IsEditableBranch')} />} label="Is Editable Branch" />

                  <FormControlLabel value="active" control={<Checkbox {...register('IsActive')} />} label="Is Active" />

                  <FormControlLabel value="transfer" control={<Checkbox {...register('IsPatientTransfer')} />} label="Is Patient Transfer" />

                  {/* <FormControlLabel value='external' control={<Checkbox {...register('IsExternal')} />} label='Is External' />

                  <FormControlLabel value='create' control={<Checkbox {...register('IsCreateUser')} />} label='Is CreateUser' />

                  <FormControlLabel value='allowCA' control={<Checkbox {...register('IsAllowtoCA')} />} label='Is AllowtoCA' />

                  <FormControlLabel value='allowFA' control={<Checkbox {...register('IsAllowtoFA')} />} label='Is AllowtoFA' />

                  <FormControlLabel value='anesthetist' control={<Checkbox {...register('IsAneasthetist')} />} label='Is Aneasthetist' />

                  <FormControlLabel value='online' control={<Checkbox {...register('IsOnlineShow')} />} label='Is OnlineShow' />

                  <FormControlLabel value='lockLoaction' control={<Checkbox {...register('IsLockLocation')} />} label='Is LockLocation' />

                  <FormControlLabel value='userNameLock' control={<Checkbox {...register('IsUserNameLock')} />} label='Is UserNameLock' />

                  <FormControlLabel value='authorized' control={<Checkbox {...register('IsApprovalAuthorized')} />} label='Is ApprovalAuthorized' /> */}

                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4}><Button
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
              </Button></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    backgroundColor: "#1976d2",
                    textTransform: "none",
                    px: 4,
                    ml: 1
                  }}
                  startIcon={isLoading && <CircularProgress size={18} />}
                >Submit
                </Button></Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
