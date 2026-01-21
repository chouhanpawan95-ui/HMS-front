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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useGetOPDAppointmentQuery } from "../../features/api/scheduleApi";
import BranchName from "../../Comman/Branch";
import { useMemo, useState } from "react";
import Loader from "../../component/Loader";
import style from "../BillingMaster/RateListMaster.module.css";
import { rowHeightWarning } from "@mui/x-data-grid/hooks/features/rows/gridRowsUtils";

const AppointmentSchedule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const { data: opdAppointmentResponse, isLoading } = useGetOPDAppointmentQuery(
    { fromDate: selectedFromDate, toDate: selectedToDate },
    { skip: !selectedFromDate || !selectedToDate },
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

  // Responsive column visibility
  const visibleColumns = isMobile
    ? ["ApptDate", "Patient Name", "ContactNo"]
    : isTablet
      ? [
          "BookingBranch",
          "Booking Date",
          "ApptDate",
          "Patient Name",
          "ContactNo",
        ]
      : [
          "DaySrNo",
          "BookingBranch",
          "Booking Date",
          "ApptDate",
          "ApptTime",
          "AppointmentId",
          "Patient Name",
          "ContactNo",
        ];

  // print the info
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=900,height=650");

    const tableRows = filteredAppointments
      .map(
        (row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${BranchName.find((b) => b.id === row.fkBranchId)?.BranchName || row.fkBranchId}</td>
        <td>${formatDate(row.bookingDate)}</td>
        <td>${formatDate(row.apptDate)}</td>
        <td>${row.apptTime || ""}</td>
        <td>${row.appointmentId || ""}</td>
        <td>${row.initial} ${row.firstName} ${row.lastName}</td>
        <td>${row.contactNo || ""}</td>
      </tr>
    `,
      )
      .join("");

    printWindow.document.write(`
    <html>
      <head>
        <title>Appointment Patient List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <h2>Appointment Patient List</h2>
        <p>
          From: ${selectedFromDate || "-"} &nbsp;&nbsp;
          To: ${selectedToDate || "-"}
        </p>

        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Branch</th>
              <th>Booking Date</th>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Appointment ID</th>
              <th>Patient Name</th>
              <th>Contact No</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mt: { xs: 2, sm: 4, md: 6 } }}>
      <Paper sx={{ borderRadius: { xs: 1, md: 2 } }}>
        <Typography
          variant="h5"
          className={style.header}
          sx={{
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
            p: { xs: 1, md: 2 },
          }}
        >
          Appointment Patient List
        </Typography>

        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            backgroundColor: "#f9fafb",
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="From Date"
                type="date"
                value={selectedFromDate}
                size={isMobile ? "medium" : "small"}
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
                size={isMobile ? "medium" : "small"}
                fullWidth
                onChange={(e) => setSelectedToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search"
                placeholder="Name, Appointment Id, Mobile, Branch"
                size={isMobile ? "medium" : "small"}
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                size={isMobile ? "medium" : "small"}
                type="button"
                value="clear"
                variant="contained"
                fullWidth={isMobile}
                disabled={!selectedFromDate && !selectedToDate && !searchText}
                onClick={() => {
                  setSelectedFromDate("");
                  setSelectedToDate("");
                  setSearchText("");
                }}
              >
                Clear
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
              <Button
                size={isMobile ? "medium" : "small"}
                variant="outlined"
                fullWidth={isMobile}
                disabled={filteredAppointments.length === 0}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <TableContainer sx={{ mt: 1, width: "100%" }}>
            <Table
              stickyHeader
              size={isMobile ? "small" : "medium"}
              sx={{
                minWidth: isMobile ? 300 : 900,
                "& td, & th": {
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                  padding: { xs: "8px 4px", sm: "10px 6px", md: "12px 16px" },
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {visibleColumns.map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        backgroundColor: "#578EE5",
                        color: "#fff",
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.75rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} align="center">
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
                        "&:hover": {
                          backgroundColor:
                            index % 2 === 0 ? "#f0f0f0" : "#f9f9f9",
                        },
                      }}
                    >
                      {visibleColumns.includes("DaySrNo") && (
                        <TableCell>{index + 1}</TableCell>
                      )}
                      {visibleColumns.includes("BookingBranch") && (
                        <TableCell>
                          {BranchName.find((b) => b.id === row.fkBranchId)
                            ?.BranchName || row.fkBranchId}
                        </TableCell>
                      )}
                      {visibleColumns.includes("Booking Date") && (
                        <TableCell>{formatDate(row.bookingDate)}</TableCell>
                      )}
                      {visibleColumns.includes("ApptDate") && (
                        <TableCell>{formatDate(row.apptDate)}</TableCell>
                      )}
                      {visibleColumns.includes("ApptTime") && (
                        <TableCell>{row.apptTime}</TableCell>
                      )}
                      {visibleColumns.includes("AppointmentId") && (
                        <TableCell>{row.appointmentId}</TableCell>
                      )}
                      {visibleColumns.includes("Patient Name") && (
                        <TableCell>{`${row.initial} ${row.firstName} ${row.lastName}`}</TableCell>
                      )}
                      {visibleColumns.includes("ContactNo") && (
                        <TableCell>{row.contactNo}</TableCell>
                      )}
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
