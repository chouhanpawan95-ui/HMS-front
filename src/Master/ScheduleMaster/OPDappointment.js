import { useForm } from "react-hook-form";
import {useCreateOPDAppointmentMutation} from "../../features/api/scheduleApi";
import { Paper,Box, Typography } from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";

const OPDAppointment = () => {
  const [createOPDAppointment] = useCreateOPDAppointmentMutation();

  const {
    register,
    handleSubmit,
    // formState={errors},
    reset
  } = useForm();

  const onSubmitOPDAppointment = async(data) => {
    try{
      await createOPDAppointment({
        fkBranchId : data.fkBranchId,
        bookingDate:data.bookingDate,
        fkRegId:data.fkRegId,
        apptDate:data.apptDate,
        apptTime:data.apptTime,
        contactNo:data.contactNo,
        lastName:data.lastName,
        firstName:data.firstName,
      }).unwrap();
      reset();
      // refetch();
      alert("Appointment Scheduled!!");

    }catch(err){
      console.error(err);
      alert("Appointment not scheduled!!!");
    }
  };

  return(
    <Box sx={{ p: 3, mt: 6 , width:'100%'}}>
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}
      >
        <Typography variant="h5" mb={3} className={style.header}>Appointment</Typography>

      </Paper>

    </Box>
  );

}
export default OPDAppointment;