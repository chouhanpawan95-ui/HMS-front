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

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import style from "../BillingMaster/RateListMaster.module.css";
import {
  useGetOPDScheduleQuery,
  useGetOPDAppointmentQuery,
  useGetOPDAppointmentBlockDetailQuery
} from "../../features/api/scheduleApi";

import OPDAppointment from "./OPDappointment";
import Loader from "../../component/Loader";
import DoctorList from "../../Comman/DoctorList";
import BlockAppointment from "./BlockAppointment";

dayjs.extend(utc);

/* -------------------- Utility -------------------- */
const normalizeDate = (dateValue) => {
  if (!dateValue) return null;
  return dayjs(dateValue).utc().format("YYYY-MM-DD");
};

/* -------------------- Component -------------------- */
const AppointmentManager = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [openAppointment, setOpenAppointment] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openBlock,setOpenBlock]=useState(false);
  const [blockSlot,setBlockSlot]=useState(null);

  /* -------------------- APIs -------------------- */
  const { data: opdScheduleResponse, isLoading: isScheduleLoading } =
    useGetOPDScheduleQuery();

  const { data: appointmentsResponse, isLoading: isAppointmentLoading } =
    useGetOPDAppointmentQuery(
      { doctorId: selectedDoctor, date: selectedDate },
      { skip: !selectedDoctor || !selectedDate }
    );

  const { data: blockDetailsResponse, isLoading: isBlockDetailsLoading } = useGetOPDAppointmentBlockDetailQuery(
    {doctorId:selectedDoctor, date:selectedDate},
    {skip:!selectedDoctor || !selectedDate}
  );

  /* -------------------- Normalize Responses -------------------- */
  const opdSchedules = useMemo(() => {
    if (Array.isArray(opdScheduleResponse)) return opdScheduleResponse;
    if (Array.isArray(opdScheduleResponse?.data))
      return opdScheduleResponse.data;
    return [];
  }, [opdScheduleResponse]);

  const appointmentList = useMemo(() => {
    if (Array.isArray(appointmentsResponse)) return appointmentsResponse;
    if (Array.isArray(appointmentsResponse?.data))
      return appointmentsResponse.data;
    return [];
  }, [appointmentsResponse]);

  const blockedList = useMemo(() => {
    if(Array.isArray(blockDetailsResponse)) return blockDetailsResponse;
    if(Array.isArray(blockDetailsResponse?.data)) return blockDetailsResponse.data;
    return [];
  },[blockDetailsResponse]);

  /* -------------------- Filter Appointments -------------------- */
  const appointments = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];

    return appointmentList.filter((appt) => {
      return (
        String(appt.fkConsultantId) === String(selectedDoctor) &&
        normalizeDate(appt.apptDate) === selectedDate
      );
    });
  }, [appointmentList, selectedDoctor, selectedDate]);

  console.log('appointment',appointments);

  /* -------------------- Booked Slot Map -------------------- */
  const bookedSlots = useMemo(() => {
    const map = new Map();

    appointments.forEach((appt) => {
      if (!appt?.apptTime || !appt?.apptDate) return;

      const date = normalizeDate(appt.apptDate);

      const parsed = dayjs(
        `${date} ${appt.apptTime}`,
        ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD hh:mm A"],
        true
      );

      if (!parsed.isValid()) return;

      map.set(parsed.format("HH:mm"), appt);
    });

    blockedList.forEach((block) => {
      const date = normalizeDate(block.apptDate);
      if(date !== selectedDate) return;

      map.set(block.apptTime,{
        ...block,
        isBlocked:true
      });
    })

    return map;
  }, [appointments]);


  /* -------------------- Doctor Schedule -------------------- */
  const availableSchedule = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return null;

    return opdSchedules.find((row) => {
      return (
        String(row.fkDoctorId) === String(selectedDoctor) &&
        row.isActive &&
        normalizeDate(row.scheduleDate) === selectedDate
      );
    });
  }, [opdSchedules, selectedDoctor, selectedDate]);

  /* -------------------- Slot Generator -------------------- */
  const generateSlots = (date, from, to, interval) => {
    const slots = [];
    let start = dayjs(`${date} ${from}`, "YYYY-MM-DD HH:mm");
    const end = dayjs(`${date} ${to}`, "YYYY-MM-DD HH:mm");

    while (start.isBefore(end)) {
      slots.push(start.format("HH:mm"));
      start = start.add(interval, "minute");
    }
    return slots;
  };

  const timeSlots = useMemo(() => {
    if (!availableSchedule) return [];

    return generateSlots(
      selectedDate,
      availableSchedule.fromApptTime,
      availableSchedule.toApptTime,
      availableSchedule.intervalMinuit
    );
  }, [availableSchedule, selectedDate]);

  /* -------------------- UI Helpers -------------------- */
  const isDoctorUnavailable =
    selectedDoctor && selectedDate && !availableSchedule && !isScheduleLoading;

  const closeDialog = () => {
    setOpenAppointment(false);
    setSelectedSlot(null);
  };

  // const handleSlotClick = (slot) => {
  //   if (bookedSlots.has(slot)) return;
  //   setSelectedSlot(slot);
  //   setOpenAppointment(true);
  // };
  const handleSlotClick = (slot) => {
    const appt = bookedSlots.get(slot);

    if (appt && !appt.isBlocked){
      setBlockSlot(appt);
      setOpenBlock(true);
      return;
    }

    if(appt?.isBlocked) return;
    if(appt) return;
    setSelectedSlot(slot);
    setOpenAppointment(true);
  };

  /* -------------------- Loading -------------------- */
  if (isScheduleLoading || isAppointmentLoading) return <Loader />;

  /* -------------------- Render -------------------- */
  return (
    <Box sx={{ p: 3, mt: 6 }}>
      <Paper>
        <Typography variant="h5" className={style.header}>
          Appointment Manager
        </Typography>

        {/* -------------------- Filters -------------------- */}
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
                {DoctorList.map((d) => (
                  <MenuItem key={d.id} value={String(d.id)}>
                    {d.name}
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
            />
          </Grid>
        </Grid>

        {/* -------------------- Table -------------------- */}
        <TableContainer sx={{ mt: 2, minWidth: 900 }}>
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
                  "Referred By",
                  "Remarks",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ backgroundColor: "#578EE5", color: "#fff" }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isDoctorUnavailable && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No Appointment Will Be Scheduled
                  </TableCell>
                </TableRow>
              )}

              {availableSchedule &&
                timeSlots.map((slot) => {
                  const booked = bookedSlots.get(slot);
                  const isBloked = booked?.isBlocked;

                  return (
                    <TableRow
                      key={slot}
                      hover={!booked}
                      onClick={() => handleSlotClick(slot)}
                      sx={{
                        backgroundColor: isBloked ? '#ffebee' : booked ? '#e8f5e9' :'inherit',
                        cursor: booked ? 'not-allowed' : 'pointer',
                      }}
                      // sx={{
                      //   backgroundColor: booked ? "#e8f5e9" : "inherit",
                      //   cursor: booked ? "not-allowed" : "pointer",
                      // }}
                    >
                      <TableCell sx={{ fontWeight: booked ? "bold" : "normal" }}>
                        {slot}
                      </TableCell>
                      <TableCell>{booked?.appointmentId ?? "-"}</TableCell>
                      <TableCell>
                        {booked
                          ? `${booked.firstName} ${booked.lastName}`
                          : "--"}
                      </TableCell>
                      <TableCell>{booked?.age ?? "--"}</TableCell>
                      <TableCell>{booked?.apptType ?? "--"}</TableCell>
                      <TableCell>{booked?.contactNo ?? "--"}</TableCell>
                      <TableCell>{booked?.referredBy ?? "--"}</TableCell>
                      <TableCell>{isBloked ? booked.blockReason : booked?.remarks ?? "--"}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* -------------------- Dialog -------------------- */}
      <Dialog open={openAppointment} onClose={closeDialog} maxWidth="md" fullWidth>
        <OPDAppointment
          doctorId={selectedDoctor}
          appointmentDate={selectedDate}
          appointmentTime={selectedSlot}
          appointments={appointments}
          onClose={closeDialog}
        />
      </Dialog>
      <Dialog open={openBlock} onClose={() => setOpenBlock(false)} maxWidth="md" fullWidth>
        <BlockAppointment
          branchId={blockSlot?.fkBranchId}
          doctorId={blockSlot?.fkConsultantId}
          appointmentDate={normalizeDate(blockSlot?.apptDate)}
          appointmentTime={blockSlot?.apptTime}
          appointmentId={blockSlot?.appointmentId}
        />

      </Dialog>
    </Box>
  );
};

export default AppointmentManager;
