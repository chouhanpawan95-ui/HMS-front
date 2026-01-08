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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
// import {
//   useGetCountryQuery,
//   useGetStateQuery,
//   useGetDistrictsQuery,
//   useGetCitiesQuery,
// } from "../../features/api/locationApi";
import { Country, State, City } from "country-state-city";
import BranchName from "../../Comman/Branch";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// sex
const getSexFromInitial = (initial) => {
  if (!initial) return null;

  const normaized = initial.toLowerCase();
  if (["miss", "ms", "mrs"].includes(normaized)) return "F";
  else return "M";
};

// age buy year
const calculateAge = (dob) => {
  if (!dob) return null;

  const birthDate = dayjs(dob);
  if (!birthDate.isValid()) return null;

  const today = dayjs();
  let age = today.year() - birthDate.year();

  if (today.isBefore(birthDate.add(age, "year"))) {
    age -= 1;
  }
  return age;
};

const OPDAppointment = ({
  doctorId,
  appointmentDate,
  appointmentTime,
  appointments,
  onClose,
}) => {
  const [createOPDAppointment] = useCreateOPDAppointmentMutation();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fkConsultantId: "",
      fkBranchId: "",
      fkRegId: "",
      fkCityId: "",
      bookingDate: null,
    },
  });

  const title = ["Mr.", "Mrs.", "Miss", "Ms"];

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (appointmentDate && appointmentTime) {
      reset({
        fkConsultantId: doctorId ?? "",
        apptDate: appointmentDate ? dayjs(appointmentDate, "YYYY-MM-DD") : null,
        apptTime: appointmentTime ? dayjs(appointmentTime, "HH:mm") : null,
      });
    }
    console.log(appointmentDate, appointmentTime);
  }, [appointmentDate, appointmentTime, doctorId, reset]);

  useEffect(() => {
    console.log("FORM ERRORS:", errors);
  }, [errors]);

  const onSubmitOPDAppointment = async (data) => {
    const selectedTime = dayjs(data.apptTime).format("HH:mm");
    const selectedDate = dayjs(data.apptDate).format("YYYY-MM-DD");
    const alreadyBooked =
      Array.isArray(appointments) &&
      appointments.some((a) => {
        return (
          String(a.fkRegId) === String(data.fkRegId) &&
          dayjs(a.apptDate).format("YYYY-MM-DD") === selectedDate &&
          dayjs(a.apptTime, "HH:mm").format("HH:mm") === selectedTime
        );
      });
    if (alreadyBooked) {
      alert("This patient already has an appointment at this time");
      return;
    }

    try {
      const sex = getSexFromInitial(data.initial);
      const ageYear = calculateAge(data.dob);

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
        dob: dayjs(data.dob).format("YYYY-MM-DD"),
        ageYear,
        sex,
        emailAddress: data.emailAddress,
        fkCityId: data.fkCityId,
        countryCode: selectedCountry,
        stateCode: selectedState,
        fkConsultantId: data.fkConsultantId,
        isVIP: data.isVIP ?? false,
        address: data.address,
        // fkServiceId: data.fkServiceId,
      }).unwrap();
      alert("Appointment Scheduled!!");
      console.log("Appointment Data", data);
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Appointment not scheduled!!!");
    }
    console.log({
      fkRegId: data.fkRegId,
      selectedDate,
      selectedTime,
      appointments,
    });
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
            <form
              onSubmit={handleSubmit(onSubmitOPDAppointment, (formErrors) => {
                console.log("SUBMIT BLOCKED BY:", formErrors);
              })}
            >
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                  <TextField
                    label="Branch"
                    fullWidth
                    select
                    defaultValue=""
                    error={!!errors.fkBranchId}
                    helperText={errors.fkBranchId?.message}
                    size="small"
                    {...register("fkBranchId", {
                      required: "Branch is required",
                    })}
                  >
                    <MenuItem value=""></MenuItem>
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
                    {...register("fkRegId")}
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
                        format="DD/MM/YYYY"
                        minDate={dayjs()}
                        {...field}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!errors.bookingDate,
                            helperText: errors.bookingDate?.message,
                          },
                        }}
                      />
                    )}
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
                        readOnly
                        minDate={dayjs()}
                        format="DD/MM/YYYY"
                        {...field}
                        slotProps={{
                          textField: { size: "small", fullWidth: true },
                        }}
                      />
                    )}
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
                        readOnly
                        minTime={
                          dayjs(watch("apptDate")).isSame(dayjs(), "day")
                            ? dayjs()
                            : null
                        }
                        {...field}
                        slotProps={{
                          textField: { size: "small", fullWidth: true },
                        }}
                      />
                    )}
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
                    error={!!errors.initial}
                    helperText={errors.initial?.message}
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
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
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
                    helperText={errors.firstName?.message}
                    error={!!errors.lastName}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid sx={{ width: { xs: "44.5%", md: "19.5%" } }}>
                  <Controller
                    name="dob"
                    control={control}
                    rules={{ required: "DOB is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="Date of Birth"
                        format="DD/MM/YYYY"
                        maxDate={dayjs()}
                        {...field}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!errors.dob,
                            helperText: errors.dob
                              ? "Date of Birth is required"
                              : "DD/MM/YYYY",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "45%", md: "18%" } }}>
                  <TextField
                    type="tel"
                    fullWidth
                    size="small"
                    error={!!errors.contactNo}
                    helperText={errors.contactNo?.message}
                    label="Contact No"
                    {...register("contactNo", {
                      required: true,
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Contact number must be 10 digits",
                      },
                    })}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "50%", mb: "20%" } }}>
                  <TextField
                    type="email"
                    size="small"
                    label="Email"
                    fullWidth
                    {...register("emailAddress", {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid sx={{ width: { xs: "40%", md: "25%" } }}>
                  <TextField
                    label="Country"
                    select
                    size="small"
                    fullWidth
                    SelectProps={{ native: true }}
                    value={selectedCountry}
                    onChange={(e) => {
                      const countryCode = e.target.value;
                      setSelectedCountry(countryCode);
                      setStates(State.getStatesOfCountry(countryCode));
                      setCities([]);
                      setSelectedState("");
                    }}
                  >
                    <option value=""></option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid sx={{ width: { xs: "40%", md: "25%" } }}>
                  <TextField
                    SelectProps={{ native: true }}
                    value={selectedState}
                    label="State"
                    size="small"
                    fullWidth
                    select
                    onChange={(e) => {
                      const stateCode = e.target.value;
                      setSelectedState(stateCode);
                      setCities(
                        City.getCitiesOfState(selectedCountry, stateCode)
                      );
                    }}
                  >
                    <option value=""></option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid sx={{ width: { xs: "40%", md: "25%" } }}>
                  <TextField
                    select
                    label="City"
                    size="small"
                    fullWidth
                    error={!!errors.fkCityId}
                    helperText={errors.fkCityId?.message}
                    SelectProps={{ native: true }}
                    {...register("fkCityId", {
                      required: "City is required",
                    })}
                  >
                    <option value=""></option>

                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid sx={{ width: { xs: "100%", md: "100%" } }}>
                  <TextField
                    label="Address"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    {...register("address")}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                  <FormControlLabel
                    control={<Checkbox {...register("isVIP")} />}
                    label="Is VIP"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                  Save Appointment
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={onClose}
                >
                  Cancel
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
