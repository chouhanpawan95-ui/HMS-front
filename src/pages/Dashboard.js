import SearchBar from "../Comman/SearchBar";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetPatientsQuery } from "../features/api/patientsApi";
import Loader from "../Comman/Loader";

const statCards = [
  { title: "Total Visitors", value: 178, change: "+14.8%", color: "success.main" },
  { title: "Surgeries", value: 17, change: "+4.5%", color: "info.main" },
  { title: "Revenue", value: "$7,548", change: "-7.5%", color: "error.main" },
];

const data = [
  { day: "Mon", medical: 45, appointed: 25 },
  { day: "Tue", medical: 60, appointed: 40 },
  { day: "Wed", medical: 50, appointed: 35 },
  { day: "Thu", medical: 75, appointed: 55 },
  { day: "Fri", medical: 80, appointed: 70 },
  { day: "Sat", medical: 55, appointed: 40 },
  { day: "Sun", medical: 70, appointed: 60 },
];

// const appointments = [
//   {
//     name: "Isa Isgenderov",
//     id: "47229037",
//     date: "Jan 25 - 13:00",
//     type: "Dermatology",
//     doctor: "Akhmadov S.",
//     status: "Changed",
//   },
//   {
//     name: "Murad Mamedli",
//     id: "15287533",
//     date: "Jan 25 - 13:30",
//     type: "Ophthalmology",
//     doctor: "Asgarov D.",
//     status: "Confirmed",
//   },
//   {
//     name: "Diana Huseynova",
//     id: "88770126",
//     date: "Jan 25 - 13:00",
//     type: "Radiology",
//     doctor: "Suleymanova A.",
//     status: "Confirmed",
//   },
//   {
//     name: "Akber Rzayev",
//     id: "92170213",
//     date: "Jan 25 - 14:00",
//     type: "Gastroenterology",
//     doctor: "Rzayeva S.",
//     status: "Canceled",
//   },
//   {
//     name: "Said Qasimov",
//     id: "85147324",
//     date: "Jan 25 - 14:30",
//     type: "Pediatrics",
//     doctor: "Mammadov S.",
//     status: "Confirmed",
//   },
// ];

export default function Dashboard() {
  const theme = useTheme();

  // Pagination / search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Call RTK Query with server-side params
  const { data: patientsResp, error, isLoading, isError, refetch } = useGetPatientsQuery({ page, limit, q: searchQuery });

  // Support both API shapes: either an array directly or an object like { data: [...] }
  const patients = Array.isArray(patientsResp)
    ? patientsResp
    : patientsResp && Array.isArray(patientsResp.data)
    ? patientsResp.data
    : [];

  // total count if provided by API
  const total = patientsResp && (patientsResp.total || patientsResp.totalCount || patientsResp.meta?.total);
  const totalPages = total ? Math.ceil(total / limit) : null;
  const hasMore = totalPages ? page < totalPages : patients.length === limit;
console.log("patients",patients);
  // Loading state: show a centered spinner
  if (isLoading) {
    return (
      <Loader/>
    );
  }

  return (
    <Box>
      {isError && (
        <Box mb={2}>
          <Alert severity="error">
            Failed to load patients: {error?.data?.message || error?.error || JSON.stringify(error)}
          </Alert>
        </Box>
      )}
      {/* Daily Stats Chart */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Statistics
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="medical" fill={theme.palette.primary.main} radius={6} />
              <Bar dataKey="appointed" fill={theme.palette.success.light} radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            {/* Left side - Search */}
              <SearchBar
                patients={patients}
                onFilter={ setFilteredPatients}
              />
            
            {/* <Box display="flex" alignItems="center" gap={2}>
              <TextField
                placeholder="Search patients..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(searchTerm.trim());
                    setPage(1);
                  }
                }}
                sx={{ width: 260 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchQuery(searchTerm.trim());
                  setPage(1);
                }}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Box> */}

            
          </Box>          {/* Table */}
          <Table sx={{ minWidth: 800, overflowX: "auto" }} >
            <TableHead>
              <TableRow>
                <TableCell width="30%" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell width="15%" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Patient ID</TableCell>
                <TableCell width="20%" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Date & Time</TableCell>
                <TableCell width="15%" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Branch</TableCell>
                <TableCell width="10%" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Sex</TableCell>
                <TableCell width="10%" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 && filteredPatients.map((row, i) => {
                const name = `${row.title ? row.title + " " : ""}${row.firstName || row.name || ""} ${row.lastName || ""}`.trim();
                const id = row.patientId || row.id || "";
                const dateTime = row.dateTime ? new Date(row.dateTime).toLocaleString() : row.date || "";
                const branch = row.branch || "";
                const sex = row.sex || "";
                const status = (row.otherInfo && row.otherInfo.maritalStatus) || row.status || "";

                return (
                  <TableRow key={i}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>{((row.firstName || row.name || "").charAt(0) || "").toUpperCase()}</Avatar>
                        {name}
                      </Box>
                    </TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>{dateTime}</TableCell>
                    <TableCell>{branch}</TableCell>
                    <TableCell>{sex}</TableCell>
                    <TableCell>
                      <Chip label={status} color={status === "Confirmed" ? "success" : status === "Canceled" ? "error" : "default"} size="small" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {/* Total Records Line */}
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Total Records: {total || patients.length}
            </Typography>
          </Box>
        </CardContent>

        {/* Right side - Pagination */}
            <Box display="flex" alignItems="center" gap={2} justifyContent="flex-end" borderTop={1} borderColor={"divider"}>
              <TextField
                select
                size="small"
                value={limit}
                onChange={(e) => {
                  const v = Number(e.target.value) || 10;
                  setLimit(v);
                  setPage(1);
                }}
                sx={{ width: 80 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </TextField>

              <Box display="flex" alignItems="center" gap={1}>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => setPage((p) => Math.max(1, p - 1))} 
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Typography variant="body2" sx={{ mx: 1 }}>
                  Page {page}{totalPages ? ` / ${totalPages}` : ''}
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => setPage((p) => p + 1)} 
                  disabled={!hasMore}
                >
                  Next
                </Button>
              </Box>
            </Box>
      </Card>
    </Box>
  );
}
