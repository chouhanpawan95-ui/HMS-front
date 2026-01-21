import {
  useGetOPDScheduleQuery,
  useGetOPDAppointmentQuery,
} from "../../features/api/scheduleApi";
import BranchName from "../../Comman/Branch";
import DoctorList from "../../Comman/DoctorList";
import ScheduleType from "../../Comman/ScheduleType";
import Loader from "../../component/Loader";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useMemo, useState } from "react";
import style from "../BillingMaster/RateListMaster.module.css";

/* ------------------------------Utilities ------------------------ */

const generateSlots = (from, to, interval) => {
  const slots = [];
  let current = new Date(`1970-01-01T${from}:00`);
  const end = new Date(`1970-01-01T${to}:00`);

  while (current < end) {
    const start = current.toTimeString().slice(0, 5);
    current.setMinutes(current.getMinutes() + interval);
    const endTime = current.toTimeString().slice(0, 5);
    slots.push(`${start} - ${endTime}`);
    // slots.push(current.toTimeString().slice(0, 5));
    // current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
};

const getDateRange = (from, to) => {
  const dates = [];
  let d = new Date(from);
  const end = new Date(to);

  while (d <= end) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

/* -------------------------------- Component----------------------- */

const DoctorSchedule = () => {
  const [branch, setBranch] = useState("");
  const [doctor, setDoctor] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ---------------- API ---------------- */

  const { data: scheduleRes = [], isLoading: sLoading } =
    useGetOPDScheduleQuery(
      { branch, fromDate, toDate },
      { skip: !branch || !fromDate || !toDate },
    );

  const { data: appointmentRes = [], isLoading: aLoading } =
    useGetOPDAppointmentQuery(
      { branch, fromDate, toDate },
      { skip: !branch || !fromDate || !toDate },
    );

  const schedules = Array.isArray(scheduleRes?.data)
    ? scheduleRes.data
    : scheduleRes;

  const appointments = Array.isArray(appointmentRes?.data)
    ? appointmentRes.data
    : appointmentRes;

  /* ---------------- Filters ---------------- */

  const filteredSchedules = useMemo(() => {
    return schedules.filter(
      (s) =>
        s.isActive &&
        s.fkBranchId === branch &&
        String(s.fkDoctorId) === String(doctor) &&
        s.fkScheduleTypeId === type,
    );
  }, [schedules, branch, doctor, type]);

  const dateRange = useMemo(() => {
    if (!fromDate || !toDate) return [];
    return getDateRange(fromDate, toDate);
  }, [fromDate, toDate]);

  const appointmentSet = useMemo(() => {
    const set = new Set();
    appointments.forEach((a) => {
      if (!a.isActive || a.isCancelled) return;
      const d = new Date(a.apptDate).toISOString().split("T")[0];
      set.add(`${d}|${a.apptTime}`);
    });
    return set;
  }, [appointments]);

  const isBooked = (date, slot) => {
    const d = date.toISOString().split("T")[0];
    const time = slot.split(" - ")[0];
    return appointmentSet.has(`${d}|${time}`);
  };

  const timeSlots = useMemo(() => {
    if (!filteredSchedules.length) return [];
    // assuming same timing for selected doctor/type
    const s = filteredSchedules[0];
    return generateSlots(s.fromApptTime, s.toApptTime, s.intervalMinuit);
  }, [filteredSchedules]);

  if (sLoading || aLoading) return <Loader />;

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        mt: { xs: 4, md: 6 },
        width: "100%",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          className={style.header}
          sx={{
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
            px: { xs: 1.5, md: 2 },
            py: 1,
            backgroundColor: "#5b8def",
            color: "#fff",
            textAlign: "center",
          }}
        >
          Doctor Schedule
        </Typography>

        {/* Filters */}
        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            backgroundColor: "#f9fafb",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Grid
            container
            spacing={{ xs: 1, sm: 1.5, md: 2 }}
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Branch"
                SelectProps={{ native: true }}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option />
                {BranchName.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.BranchName}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Doctor"
                SelectProps={{ native: true }}
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              >
                <option />
                {DoctorList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Schedule Type"
                SelectProps={{ native: true }}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option />
                {ScheduleType.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                type="date"
                fullWidth
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                type="date"
                fullWidth
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Schedule Grid */}
        <Box
          sx={{
            mt: 1,
            borderTop: "1px solid #ccc",
            width:'100%',
            overflow:'visible'
          }}
        >
          <TableContainer
            sx={{
              maxHeight: { xs: "60vh", md: "70vh" },
              overflowX: "auto",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              backgroundColor: "#fff",
              width:'78%'
            }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              size="small"
              sx={{
                minWidth: dateRange.length * 110 + 100,
                borderCollapse: "separate",
                borderSpacing: 0,

                "& th": {
                  backgroundColor: "#f5f7fa",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.85rem" },
                  textAlign: "center",
                  border: "1px solid #000",
                  padding: { xs: "6px", md: "8px" },
                },

                "& td": {
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.85rem" },
                  border: "1px solid #000",
                  padding: { xs: "6px", md: "8px" },
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {dateRange.map((date) => (
                    <TableCell
                      key={date.toISOString()}
                      sx={{
                        minWidth: { xs: 90, md: 110 },
                        textAlign: "center",
                      }}
                    >
                      <div sx={{ fontSize: "0.7rem", color: "#555" }}>
                        {date.toLocaleDateString("eniUS", { weekday: "short" })}
                      </div>
                      <div sx={{ fontWeight: 600 }}>{date.toLocaleDateString("en-GB")}</div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* BODY */}
              <TableBody>
                {timeSlots.map((slot) => (
                  <TableRow key={slot}>
                    {/* DATE CELLS */}
                    {dateRange.map((date) => {
                      const booked = isBooked(date, slot);

                      return (
                        <TableCell
                          key={`${date.toISOString()}-${slot}`}
                          sx={{
                            backgroundColor: booked ? "#90EE90" : "#fff",
                            color: "#000",
                            cursor: booked ? "not-allowed" : "pointer",
                            "&:hover": {
                              backgroundColor: booked ? "#90EE90" : "#f5f5f5",
                            },
                            minWidth: "100px",
                          }}
                        >
                          {slot}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default DoctorSchedule;
