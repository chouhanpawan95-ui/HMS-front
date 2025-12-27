import { Controller, useForm } from "react-hook-form";
import {useCreateOPDAppointmentMutation} from "../../features/api/scheduleApi";
import { Paper,Box, Typography,Grid, TextField, Button, MenuItem } from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
import BranchName from "../../Comman/Branch";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const OPDAppointment = () => {
  const [createOPDAppointment] = useCreateOPDAppointmentMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    // formState={errors},
    reset
  } = useForm();

  const onSubmitOPDAppointment = async(data) => {
    try{
      await createOPDAppointment({
        fkBranchId : data.fkBranchId,
        bookingDate:dayjs(data.bookingDate).format("YYYY:MM:DD"),
        fkRegId:data.fkRegId,
        apptDate:dayjs(data.apptDate).format("YYYY:MM:DD"),
        apptTime:dayjs(data.apptTime).format("HH:mm"),
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ p: 3, mt: 6 , width:'100%'}}>
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}
      >
        <Typography variant="h5" mb={3} className={style.header}>Appointment</Typography>

        <Box>
          <form onSubmit={handleSubmit(onSubmitOPDAppointment)}>
            <Grid container spacing={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Branch"
                  fullWidth
                  select
                  size="small"
                  {...register('fkBranchId')}
                >
                  {BranchName.map((bn)=> (
                    <MenuItem key={bn.id}>{bn.BranchName}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="RegId"
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="bookingDate"
                  size="small"
                  control={control}
                  render={({field}) => (
                    <DatePicker 
                    label="Booking Date" 
                    minDate={dayjs()}
                    {...field} />
                  )}
                  slotProps={{textField:{size:'small', fullWidth:true}}}
                />
              </Grid>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="apptDate"
                  size="small"
                  control={control}
                  render={({field}) => (
                    <DatePicker 
                    label="Date of Appointment"
                    minDate={watch('bookingDate')}
                     {...field}/>
                  )}
                  slotProps = {{textField:{size:'small', fullWidth:true}}}
                />
              </Grid>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="apptTime"
                  size="small"
                  control={control}
                  render={({field}) => (
                    <TimePicker 
                    label="Time of Appointment" 
                    minTime={
                      dayjs(watch('apptDate')).isSame(dayjs(),'day') ? dayjs() : null
                    }
                    {...field}/>
                  )}
                  slotProps={{ textField:{size:'small', fullWidth:true} }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                label="First Name"
                size="small"
                fullWidth
                {...register('firstName')}
              />
              </Grid>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Last Name"
                  size="small"
                  fullWidth
                  {...register('lastName')}
                />
              </Grid>
            </Grid>
            <Box>
              <Button type="submit" variant="contained" sx={{ mt: 3 }}>Save Appointment</Button>
            </Box>

          </form>
        </Box>

      </Paper>

    </Box>
    </LocalizationProvider>
  );

}
export default OPDAppointment;