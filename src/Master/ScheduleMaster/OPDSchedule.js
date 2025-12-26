import { useForm } from "react-hook-form";
import { useCreateOPDScheduleMutation } from "../../features/api/scheduleApi";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
import DoctorList from "../../Comman/DoctorList";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const OPDSchedule = () => {
  const [createdOPDSchedule, { isLoading }] = useCreateOPDScheduleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitOPDSchedule = async (data) => {
    try {
      await createdOPDSchedule({
        FK_BranchId: "BR00",
        FK_ScheduleTypeId: "ST00",
        ScheduleDate: data.scheduleDate,
        FK_DoctorId: data.FK_DoctorId,
        FromApptTime: data.fromApptTime,
        ToApptTime: data.toApptTime,
        IntervalMinuit: data.intervalMinuit,
        MaxLimitSlot: data.maxLimitSlot,
      }).unwrap();
      reset();
      alert("OPD Appointement Schedule");
    } catch (err) {
      console.err("error: ", err);
      console.alert("Appointment Faield!");
      console.log("Error: " + errors?.data);
    }
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: 4 }}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 845,
          mx: "auto",
          p: { xs: 3, sm: 6 },
          borderRadius: 3,
          mt: 8,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          mb={2}
          className={style.header}
          fontWeight={600}
        >
          OPD Appointement Schedule
        </Typography>

        <Box>
          <form onSubmit={handleSubmit(onSubmitOPDSchedule)}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Branch Name"
                fullWidth
                {...register('FK_BranchId')}
                helperText={errors.FK_BranchId?.message}
              />
            </Grid> */}
              {/* <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Schedule Type"
                fullWidth
                helperText={errors.FK_ScheduleTypeId?.message}
                {...register('ScheduleType')}
              />
            </Grid> */}
              <Grid item xs={12} md={6} sx={{ minWidth: "24%" }}>
                <TextField
                  select
                  label="Doctor"
                  fullWidth
                  size="small"
                  defaultValue=""
                  {...register("FK_DoctorId", {
                    required: "Doctor is required",
                  })}
                  error={!!errors.FK_DoctorId}
                  helperText={errors.FK_DoctorId?.message}
                >
                  {DoctorList.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Schedule Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  helperText={errors.ScheduleDate?.message}
                  {...register("ScheduleDate")}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight={600}>
              Appointement Time
            </Typography>

            <Grid container spacing={3}>
              {/* <Grid item xs={12}> */}
              {/* <Typography variant="subtitle1" fontWeight={600}>
                  Appointement Time
                </Typography> */}
              {/* </Grid> */}

              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="From Time"
                    fullWidth
                    size="small"
                    // value={FromApptTime}
                    // onChange={(newValue) => setFromTime(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="To Time"
                    fullWidth
                    size="small"
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Interval (minutes)"
                  fullWidth
                  type="number"
                  size="small"
                  {...register("IntervalMinuit")}
                  helperText={errors.ToApptTime?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Maximum Slot Limit"
                  fullWidth
                  size="small"
                  type="number"
                  helperText={errors.ToApptTime?.message}
                  {...register("MaxLimiySlot")}
                />
              </Grid>
            </Grid>
            <Box sx={{mt:2, display:'grid'}}>
            <Button
              type="submit"
              className={style.button}
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Schedule"}
            </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
export default OPDSchedule;
