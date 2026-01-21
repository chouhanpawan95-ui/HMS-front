import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useGetOPDAppointmentQuery } from "../../features/api/scheduleApi";
import BranchName from "../../Comman/Branch";
import { useMemo, useState } from "react";
import Loader from "../../component/Loader";
import style from "../BillingMaster/RateListMaster.module.css";

const AppointmentSchedule = () => {
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const { data: opdAppointmentResponse, isLoading } = useGetOPDAppointmentQuery(
    { fromDate: selectedFromDate, toDate: selectedToDate },
    { skip: !selectedFromDate || !selectedToDate }
  );

  const [searchText, setSearchText] = useState("");

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  // normailze appointment
  const appointmentList = useMemo(() => {
    if (Array.isArray(opdAppointmentResponse)) return opdAppointmentResponse;
    if (Array.isArray(opdAppointmentResponse?.data))
      return opdAppointmentResponse?.data;
    return [];
  }, [opdAppointmentResponse]);

  // filer appointment
  const filteredAppointments = useMemo(() => {
    if (!selectedFromDate || !selectedToDate) return [];

    const fromDate = new Date(selectedFromDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(selectedToDate);
    toDate.setHours(23, 59, 59, 999);

    return appointmentList.filter((appt) => {
      if (!appt.apptDate) return false;

      const apptDate = new Date(appt.apptDate).getTime();
      if (apptDate < fromDate || apptDate > toDate) return false;

      if (!searchText.trim()) return true;

      const search = searchText.toLowerCase();

      const patientName =
        `${appt.initial} ${appt.firstName} ${appt.lastName}`.toLowerCase() ||
        "";
      const appointmentId = appt.appointmentId?.toLowerCase() || "";
      const contactNo = appt.contactNo || "";
      // const branch = appt.fkBranchId?.toLowerCase() || "";
      const branch =
        BranchName.find((b) => b.id === appt.fkBranchId)?.BranchName ||
        appt.fkBranchId ||
        "";
      
      // Format appointment date in multiple formats for search
      const apptDateFormatted = formatDate(appt.apptDate).toLowerCase();
      const bookingDateFormatted = formatDate(appt.bookingDate).toLowerCase();

      return (
        patientName.includes(search) ||
        appointmentId.includes(search) ||
        contactNo.includes(search) ||
        branch.toLowerCase().includes(search) ||
        apptDateFormatted.includes(search) ||
        bookingDateFormatted.includes(search)
      );
    });
  }, [appointmentList, selectedFromDate, selectedToDate, searchText]);

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, mt: { xs: 4, md: 6 } }}>
      <Paper>
        <Typography
          variant="h5"
          className={style.header}
          sx={{ fontSize: { xs: "1.1rem", md: "1.5rem" } }}
        >
          Appointment Patient List
        </Typography>

        <Box sx={{ p: 2, backgroundColor: "#f9fafb", borderRadius: 1, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="From Date"
                type="date"
                value={selectedFromDate}
                size="small"
                fullWidth
                onChange={(e) => setSelectedFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="To Date"
                type="date"
                value={selectedToDate}
                size="small"
                fullWidth
                onChange={(e) => setSelectedToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search"
                placeholder="Name, Appointment Id, Mobile, Branch"
                size="small"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                size="small" 
                type="button" 
                value='clear' 
                variant="contained" 
                disabled={!selectedFromDate && !selectedToDate && !searchText} 
                onClick={() => {
                  setSelectedFromDate(''); 
                  setSelectedToDate('');
                  setSearchText('');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <TableContainer sx={{ mt: 1, width: "100%", overflowX: "auto" }}>
            <Table
              stickyHeader
              size="small"
              sx={{
                minWidth: 900,
                "& td, & th": {
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    "DaySrNo",
                    "BookingBranch",
                    "Booking Date",
                    "ApptDate",
                    "ApptTime",
                    "AppointmentId",
                    "Patient Name",
                    "ContactNo",
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
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No appointments found for selected date range
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((row, index) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#fafafa" : "#fffff",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {BranchName.find((b) => b.id === row.fkBranchId)
                          ?.BranchName || row.fkBranchId}
                      </TableCell>
                      <TableCell>{formatDate(row.bookingDate)}</TableCell>
                      <TableCell>{formatDate(row.apptDate)}</TableCell>
                      <TableCell>{row.apptTime}</TableCell>
                      <TableCell>{row.appointmentId}</TableCell>
                      <TableCell>{`${row.initial} ${row.firstName} ${row.lastName}`}</TableCell>
                      <TableCell>{row.contactNo}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};
export default AppointmentSchedule;
