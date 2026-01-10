import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
import BranchName from "../../Comman/Branch";
import DoctorList from "../../Comman/DoctorList";
import { useCreateOPDScheduleMutation } from "../../features/api/scheduleApi";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

const OPDSchedule = () => {
  const [createSchedule, { isLoading }] = useCreateOPDScheduleMutation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fkDoctorId: "",
      fromDate: null,
      toDate: null,
      fromApptTime: null,
      toApptTime: null,
      intervalMinuit: "",
      maxLimitSlot: "",
    },
  });

  const scheduleType = [
    "GENERAL",
    "PAT",
    "TAP",
    "PANEL",
    "Insurance",
    "CmbPartyType",
  ];

  const onSubmit = async (form) => {
    try {
      if (
        !form.toDate ||
        !form.fromDate ||
        !form.fromApptTime ||
        !form.toApptTime
      ) {
        alert("Please select all dates and times");
        return;
      }
      let currentDate = dayjs(form.fromDate);
      const endDate = dayjs(form.toDate);
      while (currentDate.valueOf() <= endDate.valueOf()) {
        await createSchedule({
          fkBranchId: form.fkBranchId,
          fkScheduleTypeId: form.fkScheduleTypeId,
          fkDoctorId: form.fkDoctorId,
          scheduleDate: currentDate.format("YYYY-MM-DD"),
          fromApptTime: dayjs(form.fromApptTime).format("HH:mm"),
          toApptTime: dayjs(form.toApptTime).format("HH:mm"),
          intervalMinuit: Number(form.intervalMinuit),
          maxLimitSlot: Number(form.maxLimitSlot),
          isActive: true,
        }).unwrap();
        currentDate = currentDate.add(1, "day");
      }
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
          mt: 10,
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
                <Controller
                  name="fkBranchId"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Branch"
                      size="small"
                      fullWidth
                      error={!!errors.fkBranchId}
                      helperText={errors.fkBranchId?.message}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {BranchName.map((bn) => (
                        <MenuItem key={bn.id} value={bn.id}>
                          {bn.BranchName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="fkScheduleTypeId"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Schedule Type is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Schedule Type"
                      size="small"
                      fullWidth
                      error={!!errors.fkScheduleTypeId}
                      helperText={errors.fkScheduleTypeId?.message}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {scheduleType.map((st) => (
                        <MenuItem key={st} value={st}>
                          {st}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="fkDoctorId"
                  defaultValue=''
                  control={control}
                  rules={{required:'Doctor is required'}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Doctor"
                      size="small"
                      fullWidth
                      error={!!errors.fkDoctorId}
                      helperText={errors.fkDoctorId?.message}
                      {...register("fkDoctorId", { required: true })}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {DoctorList.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="fromDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "form date" }}
                  render={({ field }) => (
                    <DatePicker
                      label="From Date"
                      format="DD/MM/YYYY"
                      minDate={dayjs()}
                      {...field}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="toDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: true }}
                  error={!!errors.toDate}
                  helperText={errors.toDate}
                  render={({ field }) => (
                    <DatePicker
                      format="DD/MM/YYYY"
                      label="To Date"
                      minDate={watch("fromDate")}
                      {...field}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="fromApptTime"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={null}
                  helperText={errors.fromApptTime?.message}
                  error={!!errors.fromApptTime}
                  render={({ field }) => (
                    <TimePicker
                      label="From Time"
                      // minTime={
                      //   dayjs(watch("fromDate")).isSame(dayjs(), "day")
                      //     ? dayjs()
                      //     : null
                      // }
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="toApptTime"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={null}
                  error={!!errors.toApptTime}
                  helperText={errors.toApptTime?.message}
                  render={({ field }) => (
                    <TimePicker
                      label="To Time"
                      minTime={watch("fromApptTime")}
                      {...field}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
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
                  error={!!errors.intervalMinuit}
                  helperText={errors.intervalMinuit?.message}
                  {...register("intervalMinuit", { required: true })}
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  size="small"
                  label="Slot Limit"
                  type="number"
                  fullWidth
                  error={!!errors.maxLimitSlot}
                  helperText={errors.maxLimitSlot?.message}
                  {...register("maxLimitSlot", { required: true })}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Save Schedule"
                )}
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default OPDSchedule;
