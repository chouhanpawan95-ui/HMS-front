import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCreateOPDAppointmentMutation } from "../../features/api/scheduleApi";
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
import {
  useGetCountryQuery,
  useGetStatesQuery,
  useGetDistrictsQuery,
  useGetCitiesQuery,
} from "../../features/api/locationApi";
import BranchName from "../../Comman/Branch";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const OPDAppointment = ({
  doctorId,
  appointmentDate,
  appointmentTime,
  appointments,
  onClose,
}) => {
  const [createOPDAppointment] = useCreateOPDAppointmentMutation();

  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countries = [] } = useGetCountryQuery();

  const [selectedState, setSelectedState] = useState("");
  const { data: states = [] } = useGetStatesQuery(selectedCountry);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { data: districts = [] } = useGetDistrictsQuery(selectedState);

  const [selectedCity, setSelectedCity] = useState("");
  const { data: cities = [] } = useGetCitiesQuery(selectedDistrict);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm({
    defaultValues:{
      fkBranchId:'',
      fkRegId:'',
      bookingDate:null,
    }
  });

  const title = ["Mr.", "Mrs.", "Miss"];

  useEffect(() => {
    if (appointmentDate && appointmentTime) {
      reset({
        fkConsultantId: doctorId ?? '',
        apptDate: appointmentDate ? dayjs(appointmentDate, "YYYY-MM-DD") : null,
        apptTime: appointmentTime ?dayjs(appointmentTime, "HH:mm"): null,
      });
    }
    console.log(appointmentDate, appointmentTime);
  }, [appointmentDate, appointmentTime, doctorId, reset]);

  const onSubmitOPDAppointment = async (data) => {
    const selectedTime = dayjs(data.apptTime).format("HH:mm");
    const selectedDate = dayjs(data.apptDate).format("YYYY-MM-DD");
    const alreadyBooked = appointments.some((a) => {
      return (
        String(a.fkRegId) === String(data.fkRegId) &&
        // dayjs(a.apptDate).isSame(dayjs(data.apptDate), "day") &&
        dayjs(a.apptDate).format("YYYY-MM-DD") === selectedDate &&
        dayjs(a.apptTime, "HH:mm").format("HH:mm") === selectedTime
      );
    });
    if (alreadyBooked) {
      alert("This patient already has an appointment at this time");
      return;
    }

    try {
      await createOPDAppointment({
        fkBranchId: data.fkBranchId,
        fkRegId: data.fkRegId,
        bookingDate: dayjs(data.bookingDate).format("YYYY-MM-DD"),
        apptDate: dayjs(data.apptDate).format("YYYY-MM-DD"),
        apptTime: dayjs(data.apptTime).format("HH:mm"),
        contactNo: data.contactNo,
        initial: data.initial,
        lastName: data.lastName,
        firstName: data.firstName,
        dob: data.dob,
        sex: data.sex,
        address: data.address,
        emailAddress: data.emailAddress,
        fkCityId: data.fkCityId,
        fkConsultantId: data.fkConsultantId,
        isVIP: false,
        fkServiceId: data.fkServiceId,
      }).unwrap();
      alert("Appointment Scheduled!!");
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Appointment not scheduled!!!");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, mt: 3, width: "100%" }}>
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}
        >
          <Typography variant="h5" mb={3} className={style.header}>
            Appointment
          </Typography>

          <Box>
            <form onSubmit={handleSubmit(onSubmitOPDAppointment)}>
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                  <TextField
                    label="Branch"
                    fullWidth
                    select
                    size="small"
                    {...register("fkBranchId", {
                      required: "Branch is required",
                    })}
                  >
                    {BranchName.map((bn) => (
                      <MenuItem key={bn.id} value={bn.id}>
                        {bn.BranchName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                  <TextField
                    label="RegId"
                    fullWidth
                    size="small"
                    {...register("fkRedId")}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid sx={{ width: { xs: "44%", md: "24%" } }}>
                  <Controller
                    name="bookingDate"
                    size="small"
                    rules={{ required: "Booking date is require" }}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Booking Date"
                        minDate={dayjs()}
                        {...field}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "44%", md: "24%" } }}>
                  <Controller
                    name="apptDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        label="Date of Appointment"
                        disabled
                        {...field}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "44%", md: "24%" } }}>
                  <Controller
                    name="apptTime"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <TimePicker
                        label="Time of Appointment"
                        disabled
                        {...field}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid sx={{ width: { xs: "25%", md: "10%" } }}>
                  <TextField
                    select
                    label="Title"
                    fullWidth
                    size="small"
                    SelectProps={{ native: true }}
                    {...register("initial", {
                      required: true,
                    })}
                  >
                    <option value=""></option>
                    {title.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                  <TextField
                    label="First Name"
                    size="small"
                    fullWidth
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                  <TextField
                    label="Last Name"
                    size="small"
                    fullWidth
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid sx={{ width: { xs: "42%", md: "17%" } }}>
                  <TextField
                    type="date"
                    label="DOB"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    {...register("dob", {
                      required: true,
                    })}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "45%", md: "18%" } }}>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Contact No"
                    {...register("contactNo", {
                      required: true,
                    })}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "50%", mb: "20%" } }}>
                  <TextField
                    type="email"
                    size="small"
                    label="Email"
                    fullWidth
                    {...register("emailAddress")}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid sx={{ width: { xs: "25%", md: "10%" } }}>
                  <TextField
                    label="Country"
                    select
                    size="small"
                    fullWidth
                    SelectProps={{ native: true }}
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    <option value=""></option>
                    {countries.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.CountryName}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid sx={{ width: { xs: "25%", md: "10%" } }}>
                  <TextField
                    SelectProps={{ native: true }}
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    label="State"
                    size="small"
                    fullWidth
                    select
                  >
                    <option value=""></option>
                    {Array.isArray(states) &&
                      states.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.StateName}
                        </option>
                      ))}
                  </TextField>
                </Grid>

                <Grid sx={{ width: { xs: "25%", md: "10%" } }}>
                  <TextField
                    select
                    label="District"
                    size="small"
                    fullWidth
                    SelectProps={{ native: true }}
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option value="" disabled></option>
                    {Array.isArray(districts) &&
                      districts.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.DistrictName}
                        </option>
                      ))}
                  </TextField>
                </Grid>
                <Grid sx={{ width: { xs: "25%", md: "10%" } }}>
                  <TextField
                    select
                    label="City"
                    size="small"
                    fullWidth
                    SelectProps={{ native: true }}
                    {...register("fkCityId")}
                    // value={selectedCity}
                    // onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="" disabled></option>
                    {Array.isArray(cities) &&
                      cities.map((c) => (
                        <option key={c.cityId} value={c.cityId}>
                          {c.CityName}
                        </option>
                      ))}
                  </TextField>
                </Grid>
              </Grid>

              <Box>
                <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                  Save Appointment
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};
export default OPDAppointment;
