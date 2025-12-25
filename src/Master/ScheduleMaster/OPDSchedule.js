import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import style from "../BillingMaster/RateListMaster.module.css";
import DoctorList from "../../Comman/DoctorList";
import { useCreateOPDScheduleMutation } from "../../features/api/scheduleApi";

const OPDSchedule = () => {
  const [createSchedule] = useCreateOPDScheduleMutation();
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { fkDoctorId: "" },
  });

  const onSubmit = async (form) => {
    try {
      if (
        !form.scheduleDate ||
        // !form.toDate ||
        !form.fromApptTime ||
        !form.toApptTime
      ) {
        alert("Please select all dates and times");
        return;
      }
      await createSchedule({
        fkBranchId: form.fkBranchId,
        fkScheduleTypeId: form.fkScheduleTypeId,
        fkDoctorId: form.fkDoctorId,

        scheduleDate: dayjs(form.scheduleDate).format("YYYY-MM-DD"),
        // toDate: dayjs(form.toDate).format("YYYY-MM-DD"),

        fromApptTime: dayjs(form.fromApptTime).format("HH:mm"),
        toApptTime: dayjs(form.toApptTime).format("HH:mm"),

        intervalMinuit: Number(form.intervalMinuit),
        maxLimitSlot: Number(form.maxLimitSlot),
        isActive: true,
      }).unwrap();

      reset();
      alert("Doctor Schedule Created");
    } catch (err) {
      console.error(err);
      alert("Failed to create");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          p: 3,
          mt: 4,
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}
        >
          <Typography variant="h5" mb={3} className={style.header}>
            OPD Appointment Schedule Master
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Branch"
                  size="small"
                  fullWidth
                  {...register("fkBranchId", { required: true })}
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Schedule Type"
                  size="small"
                  fullWidth
                  {...register("fkScheduleTypeId", { required: true })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  select
                  label="Doctor"
                  size="small"
                  fullWidth
                  defaultValue=""
                  {...register("fkDoctorId", { required: true })}
                >
                  {DoctorList.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="scheduleDate"
                  size="small"
                  control={control}
                  render={({ field }) => (
                    <DatePicker label="Schedule Date" {...field} />
                  )}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>

              {/* <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="toDate"
                  size="small"
                  control={control}
                  render={({ field }) => (
                    <DatePicker label="To Date" {...field} />
                  )}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid> */}
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="fromApptTime"
                  size="small"
                  control={control}
                  render={({ field }) => (
                    <TimePicker label="From Time" {...field} />
                  )}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="toApptTime"
                  size="small"
                  control={control}
                  render={({ field }) => (
                    <TimePicker label="To Time" {...field} />
                  )}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  size="small"
                  label="Interval (minutes)"
                  type="number"
                  fullWidth
                  {...register("intervalMinuit")}
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  size="small"
                  label="Slot Limit"
                  type="number"
                  fullWidth
                  {...register("maxLimitSlot")}
                />
              </Grid>
            </Grid>

            <Box>
              <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                Save Schedule
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default OPDSchedule;
