// Dashboard.jsx
import React, { useEffect, useState } from "react";
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
  MenuItem,
  TableContainer,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import SearchBar from "../component/SearchBar";
import Loader from "../component/Loader";
import { useGetPatientsQuery } from "../features/api/patientsApi";

// Chart data
const chartData = [
  { day: "Mon", medical: 45, appointed: 25 },
  { day: "Tue", medical: 60, appointed: 40 },
  { day: "Wed", medical: 50, appointed: 35 },
  { day: "Thu", medical: 75, appointed: 55 },
  { day: "Fri", medical: 80, appointed: 70 },
  { day: "Sat", medical: 55, appointed: 40 },
  { day: "Sun", medical: 70, appointed: 60 },
];

export default function Dashboard() {
  const theme = useTheme();

  // Pagination / search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  // API call
  const {
    data: patientsResp,
    error,
    isLoading,
    isError,
  } = useGetPatientsQuery({ page, limit, q: searchQuery });

  // Extract array from API response
  const patients = Array.isArray(patientsResp)
    ? patientsResp
    : patientsResp?.data && Array.isArray(patientsResp.data)
    ? patientsResp.data
    : [];

  // Extract total count if provided
  const total =
    patientsResp?.total ||
    patientsResp?.totalCount ||
    patientsResp?.meta?.total ||
    null;

  const totalPages = total ? Math.ceil(total / limit) : null;
  const hasMore = totalPages ? page < totalPages : patients.length === limit;

  // Keep filtered data synced
  // Initialize filtered data when API response arrives.
  // Use patientsResp as dependency to avoid loops when `patients` is reconstructed
  // as an empty array on every render before the API resolves.
  useEffect(() => {
    if (patientsResp) {
      setFilteredPatients(patients);
    }
  }, [patientsResp]);

  // Show loader
  if (isLoading) return <Loader />;

  return (
    <Box className="dashboard-wrapper" sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load patients:{" "}
          {error?.data?.message || error?.error || JSON.stringify(error)}
        </Alert>
      )}

      {/* Chart */}
      <Card className="dashboard-card" elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Statistics
          </Typography>

          {/* responsive chart wrapper: allow horizontal scroll on very small screens */}
          <Box className="chart-scroll" sx={{ width: "100%", overflowX: "auto" }}>
            <Box
              className="chart-container"
              sx={{
                minWidth: { xs: 600, sm: 700, md: 900 },
                height: { xs: 180, sm: 220, md: 250 },
                minHeight: 140,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="medical"
                    fill={theme.palette.primary.main}
                    radius={6}
                  />
                  <Bar
                    dataKey="appointed"
                    fill={theme.palette.success.light}
                    radius={6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Box
        className="search-section"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <SearchBar patients={patients} onFilter={setFilteredPatients} />
      </Box>

      {/* TABLE SECTION */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <TableContainer
          className="table-container"
          component={Paper}
          sx={{
            maxHeight: 450,
            overflowX: "auto",
            overflowY: "auto",
            borderRadius: 8,
            boxShadow: 1,
            width: "100%",
          }}
        >
          {/* minWidth ensures ALL columns show on mobile via horizontal scroll */}
          <Table stickyHeader sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  Patient ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  Date & Time
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  DOB
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sex
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  MobileNo
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  Address
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((row, i) => {
                  const name = `${row.title ? row.title + " " : ""}${
                    row.firstName || row.name || ""
                  } ${row.lastName || ""}`.trim();

                  const dateTime = row.dateTime
                    ? new Date(row.dateTime).toLocaleString()
                    : row.date || "";

                  return (
                    <TableRow key={i}>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.patientId || row.id}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar className="avatar-responsive" sx={{ width: 32, height: 32 }}>
                            {(row.firstName || row.name || "")
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>{name}</Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {dateTime}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {row.dateOfBirth || ""}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {row.sex || ""}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {row.permanentAddress?.mobileNo || ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          maxWidth: 240,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.permanentAddress?.addressLine || ""}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination + Total */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total Records: {total ?? patients.length}
          </Typography>

          {/* Pagination Controls */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Limit selector */}
            <TextField
              select
              size="small"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              sx={{ width: 90 }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </TextField>

            {/* Page controls */}
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>

              <Typography variant="body2">
                Page {page}
                {totalPages ? ` / ${totalPages}` : ""}
              </Typography>

              <Button
                size="small"
                variant="outlined"
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
