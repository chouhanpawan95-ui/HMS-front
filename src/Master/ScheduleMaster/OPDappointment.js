import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import {useCreateOPDAppointmentMutation} from "../../features/api/scheduleApi";
import { Paper,Box, Typography,Grid, TextField, Button, MenuItem } from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
import DoctorList from "../../Comman/DoctorList";
import BranchName from "../../Comman/Branch";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const OPDAppointment = ({doctorId,appointmentDate,appointmentTime,appointments,onClose}) => {
  const [createOPDAppointment] = useCreateOPDAppointmentMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    // formState={errors},
    reset
  } = useForm();



  useEffect(() => {
    if(appointmentDate && appointmentTime){
      reset({
        fkConsultantId:doctorId,
        apptDate:dayjs(appointmentDate),
        apptTime:dayjs(appointmentTime,"hh:mm A"),
      });
    }
  }, [appointmentDate,appointmentTime,doctorId,reset])

  const onSubmitOPDAppointment = async(data) => {
    const selectedTime = dayjs(data.apptTime).format('HH:mm');
    const alreadyBooked = appointments.some((a) => {
      return(
        String(a.fkRegId) === String(data.fkRegId) &&
        dayjs(a.apptDate).isSame(dayjs(data.apptDate),"day") &&
        dayjs(a.apptTime,"HH:mm").format("HH:mm") === selectedTime
      );
    });
    if (alreadyBooked){
      alert('This patient already has an appointment at this time');
      return;
    }

    try{
      await createOPDAppointment({
        fkBranchId : data.fkBranchId,
        fkForBranchId:data.fkForBranchId,
        fkRegId:data.fkRegId,
        bookingDate:dayjs(data.bookingDate).format("YYYY:MM:DD"),
        apptDate:dayjs(data.apptDate).format("YYYY:MM:DD"),
        apptTime:dayjs(data.apptTime).format("HH:mm"),
        contactNo:data.contactNo,
        initial:data.initial,
        lastName:data.lastName,
        firstName:data.firstName,
        daySrNo:data.daySrNo,
        fkApptTypeId:data.fkApptTypeId,
        ageYear:data.ageYear,
        ageMonth:data.ageMonth,
        ageDays:data.ageDays,
        dob:data.dob,
        sex:data.sex,
        address:data.address,
        emailAddress:data.emailAddress,
        fkCityId:data.fkCityId,
        contactNo:data.contactNo,
        fkRefById:data.fkRefById,
        fkConsultantId:data.fkConsultantId,
        isVIP:false,
        fkTakenOnId:data.fkTakenOnId,
        remarks:data.remarks,
        isConfirm:data.isConfirm,
        fkServiceId:data.fkServiceId,       
      }).unwrap();
      reset();
      // refetch();
      alert("Appointment Scheduled!!");
      onClose();

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
                  {...register('fkBranchId',{
                    required:'Branch is required'
                  })}
                >
                  {BranchName.map((bn)=> (
                    <MenuItem key={bn.id} value={bn.id}>{bn.BranchName}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="RegId"
                  fullWidth
                  size="small"
                  {...register('fkRedId')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={2}>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <Controller
                  name="bookingDate"
                  size="small"
                  rules={{required:"Booking date is require"}}
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
                    disabled
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
                    disabled
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
                {...register('firstName',{
                  required:'First name is required',
                })}
              />
              </Grid>
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                <TextField
                  label="Last Name"
                  size="small"
                  fullWidth
                  {...register('lastName',{
                    required:'Last name is required',
                   } )}
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