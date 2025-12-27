import {
  Box,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableBody,
  Dialog,
} from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
import { useGetOPDScheduleQuery } from "../../features/api/scheduleApi";
import DoctorList from "../../Comman/DoctorList";
import { useState } from "react";
import dayjs from "dayjs";
import OPDAppointment from "./OPDappointment";
import Loader from "../../component/Loader";

const AppointmentManager = () => {
  const { data: opdScheduleResponse, isLoading } = useGetOPDScheduleQuery();

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [openAppointment, setOpenAppointment] = useState(false);
  const [selectSlot, setSelectSlot] = useState(null);

  const opdRespone = Array.isArray(opdScheduleResponse)
    ? opdScheduleResponse
    : Array.isArray(opdScheduleResponse?.data)
    ? opdScheduleResponse.data
    : [];

  const availableSchedule = opdRespone.find((row) => {
    if (!selectedDoctor || !selectedDate) return false;

    return (
      String(row.fkDoctorId) === String(selectedDoctor) &&
      row.isActive &&
      dayjs(row.scheduleDate).isSame(dayjs(selectedDate), "day")
    );
  });

  const generateSlots = (date, from, to, interval) => {
    const slots = [];
    let start = dayjs(`${date} ${from}`);
    const end = dayjs(`${date} ${to}`);

    while (start.isBefore(end)) {
      slots.push(start.format("hh:mm A"));
      start = start.add(interval, "minute");
    }
    return slots;
  };

  const timeSlots = availableSchedule
    ? generateSlots(
        dayjs(availableSchedule.scheduleDate).format("YYYY-MM-DD"),
        availableSchedule.fromApptTime,
        availableSchedule.toApptTime,
        availableSchedule.intervalMinuit
      )
    : [];

  const isDoctorUnacailable =
    selectedDoctor && selectedDate && !availableSchedule;

  console.log({
    selectedDoctor,
    selectedDate,
    opdRespone,
    availableSchedule,
  });
  console.log("Time slots:", timeSlots);

  const handleSlotClick = (slot) => {
    console.log("time is clicked");
    setSelectSlot(slot);
    setOpenAppointment(true);
  };

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: 3, mt: 6 }}>
      <Paper>
        <Typography variant="h5" className={style.header}>
          Appointment Manager
        </Typography>

        <Box>
          <Grid container spacing={2} mt={1}>
            <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Doctor Name</InputLabel>
                <Select
                  label="Doctor Name"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <MenuItem value="">Select</MenuItem>
                  {DoctorList.map((g) => (
                    <MenuItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
              <TextField
                label="Appointment Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              ></TextField>
            </Grid>
          </Grid>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, minWidth: 900, mt: 2 }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  "Time",
                  "Patient Id",
                  "Patient Name",
                  "Age",
                  "Appt Type",
                  "Contact No",
                  "Referred by",
                  "Remarks",
                ].map((t) => (
                  <TableCell
                    key={t}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#578EE5",
                      color: "#fff",
                    }}
                  >
                    {t}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isDoctorUnacailable && (
                <TableRow>
                  <TableCell align="center" colSpan={8}>
                    {" "}
                    No Appointment Will be Scheduled
                  </TableCell>
                </TableRow>
              )}
              {availableSchedule &&
                timeSlots.map((slot) => (
                  <TableRow key={slot}>
                    <TableCell
                      onClick={() => handleSlotClick(slot)}
                      sx={{ cursor: "pointer" }}
                    >
                      {slot}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog
        open={openAppointment}
        onClose={() => setOpenAppointment(false)}
        maxWidth="md"
        fullWidth
      >
        <OPDAppointment
          doctorId={selectedDoctor}
          appointmentDate={selectedDate}
          appointmentTime={selectSlot}
          onClose={() => setOpenAppointment(false)}
        />
      </Dialog>
    </Box>
  );
};
export default AppointmentManager;
