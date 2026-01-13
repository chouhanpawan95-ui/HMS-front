import { useForm } from "react-hook-form";
import { useUpdateOPDAppointmentMutation } from "../../features/api/scheduleApi";
import { Paper, TextField, Typography, Button } from "@mui/material";

const CancelAppointment = ({ appointmentIds, onSuccess, onClose }) => {
  const [updateCancel] = useUpdateOPDAppointmentMutation();

  const { register, handleSubmit, reset } = useForm();

 const onSubmit = async (data) => {
  try {
    for (const id of appointmentIds) {
      await updateCancel({
        id, 
        payload: {
          isCancelled: true,
          isActive: false,
          cancelReason: data.cancelReason,
        },
      }).unwrap();
    }

    alert("Appointments cancelled successfully");
    reset();
    onSuccess?.();
  } catch (err) {
    console.error(err);
    alert("Failed to cancel appointments");
  }
};


  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Cancel Appointment</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Cancel Reason"
          multiline
          rows={4}
          fullWidth
          {...register("cancelReason", { required: true })}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Button type="submit" variant="contained">
            Cancel Appointment
          </Button>
          <Button variant="contained" onClick={() => onClose?.()}>
            Close
          </Button>
        </div> 
      </form>
    </Paper>
  );
};

export default CancelAppointment;
