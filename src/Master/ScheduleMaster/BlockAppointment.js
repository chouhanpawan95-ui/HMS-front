import { useForm } from "react-hook-form";
import { useCreateOPDAppointmentBlockDetailMutation } from "../../features/api/scheduleApi";
import { Paper, TextField, Typography, Grid, Box, Button } from "@mui/material";

const BlockAppointment = ({
  branchId,
  doctorId,
  appointmentDate,
  appointmentTimes,
  onSuccess,
  onClose,
}) => {
  const [createBlock] = useCreateOPDAppointmentBlockDetailMutation();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      for (const time of appointmentTimes) {
        await createBlock({
          fkBranchId: branchId,
          fkDoctorId: doctorId,
          apptDate: appointmentDate,
          apptTime: time,
          blockReason: data.blockReason,
        }).unwrap();
      }

      alert("Appointments blocked successfully");
      reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to block appointments");
    }
  };

  return (
    <Box sx={{ p: 3, mt: 3, width: "100%" }}>
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}
      >
        <Typography variant="h6">Block Appointment</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item sx={{ width: { xs: "100%", md: "40%" } }}>
              <TextField
                label="Appointment Times"
                value={appointmentTimes.join(", ")}
                fullWidth
                size="small"
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item sx={{ width: { xs: "100%", md: "40%" } }}>
              <TextField
                label="Block Reason"
                multiline
                rows={4}
                fullWidth
                {...register("blockReason", { required: true })}
              />
            </Grid>
          </Grid>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button type="submit" variant="contained">
              Block {appointmentTimes.length} Slots
            </Button>
            <Button variant="outlined" onClick={() => onClose?.()}>
              Cancel
            </Button>
          </div>
        </form>
      </Paper>
    </Box>
  );
};

export default BlockAppointment;
