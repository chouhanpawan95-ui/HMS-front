import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateOPDAppointmentBlockDetailMutation } from "../../features/api/scheduleApi";
import { Paper, TextField, Typography, Grid, Box,Button } from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";

const BlockAppointment = ({
  branchId,
  doctorId,
  appointmentDate,
  appointmentTime,
  appointmentId,
}) => {
  const [createOPDAppointmentBlockDetail] =
    useCreateOPDAppointmentBlockDetailMutation();

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {});

  const onSubmitOPDAppointmentBlockDetail = async (data) => {
    try {
      await createOPDAppointmentBlockDetail({
        fkCreatedById: appointmentId,
        fkBranchId: branchId,
        fkDoctorId: doctorId,
        apptDate: appointmentDate,
        apptTime: appointmentTime,
        blockReason: data.blockReason,
      }).unwrap();
      alert("Appointment blocked successfully");
      reset();
    } catch (err) {
      console.error("Failed to create appointment block detail:", err);
      alert("Error creating appointment block detail. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3, mt: 3, width: "100%" }}>
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}
      >
        <Typography variant="h5" mb={3} className={style.header}>
          Block Appointment
        </Typography>
        <Box>
          <form onSubmit={handleSubmit(onSubmitOPDAppointmentBlockDetail)}>
            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "45%", md: "25%" } }}>
                <TextField label="Appointment" value={appointmentId} fullWidth disabled size="small" />
              </Grid>

              <Grid sx={{ width: { xs: "45%", md: "25%" } }}>
                <TextField label="Branch" value={branchId} fullWidth disabled size="small" />
              </Grid>

              <Grid sx={{ width: { xs: "45%", md: "25%" } }}>
                <TextField label="Doctor" value={doctorId} fullWidth disabled size="small" />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Appointment Time"
                  value={appointmentTime}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Appointment Date"
                  value={appointmentDate}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Reason for Blocking"
                  fullWidth
                  multiline
                  size="small"
                  {...register("blockReason", { required: true })}
                />
              </Grid>
            </Grid>
            <Box>
                <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                  Blocked Appointment
                </Button>
              </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
export default BlockAppointment;
