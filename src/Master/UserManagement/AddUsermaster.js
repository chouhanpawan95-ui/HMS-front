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

  const gender = ['Male', 'Female', 'Other']
  const [createUserMaster, { isLoading }] = useCreateUserMasterMutation();

  const handleBack = () => {
    navigate("/UserMaster");
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      FK_UserTypeId: [],
      FK_AuthTypeId: [],
      ScheduleWeekDays: []
    }
  });

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
        LoginStatus: data.LoginStatus,
        LoginIP: data.LoginIP,
        LoginDateTime: data.LoginDateTime,
        FK_UserTypeId: normalizeArray(data.FK_UserTypeId),
        FK_AuthTypeId: normalizeArray(data.FK_AuthTypeId),
        ScheduleWeekDays: normalizeArray(data.ScheduleWeekDays),

        Fk_EmployeeId: data.Fk_EmployeeId,
        FK_SubSpecialtyId: data.FK_SubSpecialtyId,
        FK_DefaultBranchId: data.FK_DefaultBranchId,
        FK_LoginBranchId: data.FK_LoginBranchId,
        FK_DeptID: data.FK_DeptID,
        FK_DefaultServiceDeptID: data.FK_DefaultServiceDeptID,

        RoomNo: data.RoomNo,
        DefaultRoomNo: data.DefaultRoomNo,
        DefaultOptomID: data.DefaultOptomID,

        DiagnosisDept: data.DiagnosisDept,
        DoctorPage: data.DoctorPage,

        Discount: Number(data.Discount) || 0,

        MobileNo: data.MobileNo,
        Email: data.Email,
        DOB: data.DOB,
        Gender: data.Gender,
        NationalID: data.NationalID,
        RegistrationNo: data.RegistrationNo,
        ClinicName: data.ClinicName,
        Specialization: data.Specialization,

        // booleans (force true/false)
        IsEditableBranch: !!data.IsEditableBranch,
        IsPatientTransfer: !!data.IsPatientTransfer,
        IsActive: !!data.IsActive,
        IsExternal: !!data.IsExternal,
        IsCreateUser: !!data.IsCreateUser,
        IsAllowtoCA: !!data.IsAllowtoCA,
        IsAllowtoFA: !!data.IsAllowtoFA,
        IsAneasthetist: !!data.IsAneasthetist,
        IsOnlineShow: !!data.IsOnlineShow,
        IsLockLocation: !!data.IsLockLocation,
        IsUserNameLock: !!data.IsUserNameLock,
        IsApprovalAuthorized: !!data.IsApprovalAuthorized,
        DoctorWorkupPatternScreen: !!data.DoctorWorkupPatternScreen,
        TeleConsultation: !!data.TeleConsultation,
        NetConsultation: !!data.NetConsultation,
        PRHelpF3: !!data.PRHelpF3,
      };

      await createUserMaster(payload).unwrap();
      alert("Successfully saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

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
          mt: { xs: 6, sm: 8 }
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
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Login Name"
                  size="small"
                  {...register('LoginName', { required: 'Login Name is required' })}
                  error={!!errors?.LoginName}
                  helperText={errors.LoginName?.message}
                /></Grid>

              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="User Name"
                  size="small"
                  {...register('UserName', { required: 'User name is required' })}
                  helperText={errors.UserName?.message}
                  error={!!errors.UserName}
                /></Grid>

              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Short Name"
                  size="small"
                  {...register('ShortName', { required: true })}
                  error={!!errors.ShortName}
                  helperText={errors.ShortName?.message}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Password"
                  size="small"
                  type="password"
                  {...register('Password', {
                    required: true,
                    minLength: { value: 6, message: "Min 6 Chars" }
                  })}
                  error={!!errors.message}
                  helperText={errors.Password?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <FormControl fullWidth size="small" error={!!errors.FK_UserTypeId}>
                  <InputLabel>User Type</InputLabel>
                  <Controller
                    name="FK_UserTypeId"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Select at least one user type' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        multiple
                        size="small"
                        fullWidth
                        value={field.value || []}
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
                            : "Select User Types"
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
                  <Typography color="error" variant="caption">{errors.FK_UserTypeId?.message}</Typography>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}> {/* Default Auth Type */}
                <FormControl fullWidth size="small" error={!!errors.FK_AuthTypeId}>
                  <InputLabel>Default auth Type</InputLabel>
                  <Controller
                    name="FK_AuthTypeId"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Select at least one user type' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        label="Default auth Type"
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
                  <Typography color="error" variant="caption">{errors.FK_AuthTypeId?.message}</Typography>
                </FormControl></Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
                <TextField
                  fullWidth
                  label="Login Branch Id"
                  size="small"
                  {...register('FK_LoginBranchId')}
                  error={!!errors.FK_LoginBranchId}
                  helperText={errors.FK_LoginBranchId?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
                <TextField
                  label="Login Status"
                  fullWidth
                  size="small"
                  error={!!errors.LoginStatus}
                  helperText={errors.LoginStatus?.message}
                  {...register('LoginStatus')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
                <TextField
                  label='Login IP'
                  fullWidth
                  size="small"
                  {...register('LoginIP')}
                  error={!!errors.LoginIP}
                  helperText={errors.LoginIP?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
                <TextField
                  label='Login DateTime'
                  fullWidth
                  size="small"
                  {...register('LoginDateTime')}
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.LoginDateTime}
                  helperText={errors.LoginDateTime?.message}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  size="small"
                  error={!!errors.Fk_EmployeeId}
                  helperText={errors.Fk_EmployeeId?.message}
                  {...register('Fk_EmployeeId')} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Sub Speciality"
                  size="small"
                  error={!!errors.FK_SubSpecialtyId}
                  helperText={errors.FK_SubSpecialtyId?.message}
                  {...register('FK_SubSpecialtyId')} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Default Branch"
                  size="small"
                  error={!!errors.FK_DefaultBranchId}
                  helperText={errors.FK_DefaultBranchId?.message}
                  {...register('FK_DefaultBranchId')} />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Dept Id"
                  size="small"
                  error={!!errors.FK_DeptID}
                  helperText={errors.FK_DeptID?.message}
                  {...register('FK_DeptID')} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Default Service Dept Id"
                  size="small"
                  error={!!errors.FK_DefaultServiceDeptID}
                  helperText={errors.FK_DefaultServiceDeptID?.message}
                  {...register('FK_DefaultServiceDeptID')} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Diagnosis Dept"
                  {...register('DiagnosisDept')}
                  fullWidth
                  error={!!errors.DiagnosisDept}
                  helperText={errors.DiagnosisDept?.message}
                  size="small" />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label="Room No"
                  size="small"
                  error={!!errors.RoomNo}
                  helperText={errors.LoginIP?.RoomNo}
                  {...register('RoomNo')}
                  type="number" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  fullWidth
                  label='Default Room No'
                  size="small"
                  error={!!errors.DefaultRoomNo}
                  helperText={errors.LoginIP?.DefaultRoomNo}
                  {...register('DefaultRoomNo')}
                  type="number" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  label='Default Optom ID'
                  {...register('DefaultOptomID')}
                  size="small"
                  error={!!errors.DefaultOptomID}
                  helperText={errors.DefaultOptomID?.message}
                  fullWidth />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Doctor Page"
                  {...register('DoctorPage')}
                  fullWidth
                  size="small"
                  error={!!errors.DoctorPage}
                  helperText={errors.DoctorPage?.message} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <FormControlLabel
                  value="doctorWorkupPatternScreen"
                  control={<Checkbox {...register('DoctorWorkupPatternScreen')} />}
                  label="Doctor Workup Pattern Screen"
                  error={!!errors.DoctorWorkupPatternScreen}
                  helperText={errors.DoctorWorkupPatternScreen?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <FormControlLabel
                  value="help"
                  control={<Checkbox {...register('PRHelpF3')} />}
                  label="PRHelp F3"
                  error={!!errors.PRHelpF3}
                  helperText={errors.PRHelpF3?.message}
                />
              </Grid>

            </Grid>

            <Grid container spacing={2} mt={1}>
              {/* ScheduleWeekDays */}
              <FormControl error={!!errors.ScheduleWeekDays}>
                <FormLabel component="legend">Schedule Week Days</FormLabel>
                <FormGroup row>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <FormControlLabel
                      key={day}
                      control={<Checkbox {...register("ScheduleWeekDays", {
                        validate: v => v.length > 0 || 'Select at least one day'
                      })} value={day} />}
                      label={day}
                    />
                  ))}
                </FormGroup>
                <Typography color="error" variant="caption">{errors.ScheduleWeekDays?.message}</Typography>
              </FormControl>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Discount"
                  type='number'
                  {...register('Discount', {
                    min: { value: 0, message: 'Must be >= 0' }
                  })}
                  size="small"
                  fullWidth />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <FormControlLabel value="teleConsultation" control={<Checkbox {...register('TeleConsultation')} />} label="TeleConsultation" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <FormControlLabel value="netConsultation" control={<Checkbox {...register('NetConsultation')} />} label="NetConsultation" />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
                <TextField
                  label="Mobile"
                  type='tel'
                  size="small"
                  fullWidth
                  {...register('MobileNo', {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Invalid mobile no'
                    }
                  })}
                  error={!!errors.MobileNo}
                  helperText={errors.MobileNo?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
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
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
                <FormControl fullWidth size="small">
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
              <Grid item xs={12} sm={6} md={4} sx={{ width: '22.1%' }}>
                <TextField
                  placeholder="Adhar, PAN"
                  label="National ID"
                  size="small"
                  fullWidth
                  {...register('NationalID')} />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Registration No"
                  size="small"
                  fullWidth
                  {...register('RegistrationNo')} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Clinic Name"
                  size="small"
                  fullWidth
                  {...register('ClinicName')} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Specilization"
                  size="small"
                  fullWidth
                  {...register('Specialization')} />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              {/* Radio buttons */}
              <FormControl>
                {/* <FormLabel>Default Branch</FormLabel> */}
                <FormGroup row name="defaultBranch">
                  <FormControlLabel value="edit" control={<Checkbox {...register('IsEditableBranch')} />} label="Is Editable Branch" />

                  <FormControlLabel value="active" control={<Checkbox {...register('IsActive')} />} label="Is Active" />

                  <FormControlLabel value="transfer" control={<Checkbox {...register('IsPatientTransfer')} />} label="Is Patient Transfer" />

                  <FormControlLabel value='external' control={<Checkbox {...register('IsExternal')} />} label='Is External' />

                  <FormControlLabel value='create' control={<Checkbox {...register('IsCreateUser')} />} label='Is CreateUser' />

                  <FormControlLabel value='allowCA' control={<Checkbox {...register('IsAllowtoCA')} />} label='Is AllowtoCA' />

                  <FormControlLabel value='allowFA' control={<Checkbox {...register('IsAllowtoFA')} />} label='Is AllowtoFA' />

                  <FormControlLabel value='anesthetist' control={<Checkbox {...register('IsAneasthetist')} />} label='Is Aneasthetist' />

                  <FormControlLabel value='online' control={<Checkbox {...register('IsOnlineShow')} />} label='Is OnlineShow' />

                  <FormControlLabel value='lockLoaction' control={<Checkbox {...register('IsLockLocation')} />} label='Is LockLocation' />

                  <FormControlLabel value='userNameLock' control={<Checkbox {...register('IsUserNameLock')} />} label='Is UserNameLock' />

                  <FormControlLabel value='authorized' control={<Checkbox {...register('IsApprovalAuthorized')} />} label='Is ApprovalAuthorized' />

                </FormGroup>
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
                  fullWidth
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
                >{isLoading ? "Saving..." : "Submit"}
                </Button></Grid>

            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
