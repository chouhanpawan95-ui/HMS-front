// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

import SearchBar from "../component/SearchBar";
import Loader from "../component/Loader";
import { useGetPatientsQuery,useGetopdVisitQuery } from "../features/api/patientsApi";
import {useGetBillMasterQuery} from '../features/api/Hooks/billingApi';
import { Link } from 'react-router-dom';
export default function Dashboard() {
  const theme = useTheme();
  // Pagination / search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  // OPD visits state (we will show these rows instead of patients)
  const [opdList, setOpdList] = useState([]);
  const [filteredOpd, setFilteredOpd] = useState([]);
  const { data: billdetails } = useGetBillMasterQuery();

  // Query OPD visits with pagination and optional search
  const { data: getOpd, error: getOpdError, isLoading: getOpdLoading, isError: getOpdIsError } = useGetopdVisitQuery({ page, limit, q: searchQuery });
  console.log("billdetails",billdetails);
  const [openBillsDialog, setOpenBillsDialog] = useState(false);
  const [selectedPatientForBills, setSelectedPatientForBills] = useState(null);
  const [billsFilterText, setBillsFilterText] = useState("");
  console.log("filteredPatients",filteredPatients);
  // API call
  const {
    data: patientsResp,
    error,
    isLoading,
    isError,
  } = useGetPatientsQuery({ page, limit, q: searchQuery });
  console.log("seepatient",patientsResp);
console.log("getopdvisit", getOpd);

  useEffect(() => {
    const rows = Array.isArray(getOpd?.data)
      ? getOpd.data
      : Array.isArray(getOpd)
      ? getOpd
      : [];
    setOpdList(rows);
    setFilteredOpd(rows);
  }, [getOpd]);
  // Extract array from API response
  const patients = Array.isArray(patientsResp)
    ? patientsResp
    : patientsResp?.data && Array.isArray(patientsResp.data)
    ? patientsResp.data
    : [];

  // Prefer total count from OPD response; fall back to patients response
  const opdTotal = getOpd?.total || getOpd?.totalCount || getOpd?.meta?.total || null;
  const total = opdTotal ?? (
    patientsResp?.total || patientsResp?.totalCount || patientsResp?.meta?.total || null
  );

  const totalPages = total ? Math.ceil(total / limit) : null;
  // hasMore should reflect which list we're showing (OPD by default)
  const hasMore = totalPages ? page < totalPages : (opdList.length === limit);

  // Sync filtered patients when API data changes
  useEffect(() => {
    if (patientsResp) {
      setFilteredPatients(patients);
    }
  }, [patientsResp]);

  // Show loader if patients or OPD are loading
  if (isLoading || getOpdLoading) return <Loader />;

  return (
    <Box className="dashboard-wrapper" sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load patients:{" "}
          {error?.data?.message || error?.error || JSON.stringify(error)}
        </Alert>
      )}

       {/* Search Bar (now filters OPD visits) */}
      <Box
        className="search-section"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <TextField
          size="small"
          placeholder="Search visits (visit id, reg id, name)"
          value={searchQuery}
          onChange={(e) => {
            const q = e.target.value;
            setSearchQuery(q);

            // Client-side filter for immediate responsiveness while the API fetch runs
            const lower = q.toLowerCase();
            if (!lower) {
              setFilteredOpd(opdList);
              return;
            }
            setFilteredOpd(
              (opdList || []).filter((o) => {
                const fk = String(o.fkRegId || "").toLowerCase();
                const vid = String(o.pkVisitId || o._id || "").toLowerCase();
                const pname = (patients || []).find(p => String(p.patientId) === String(o.fkRegId) || String(p.id) === String(o.fkRegId));
                const name = pname ? `${pname.firstName || ""} ${pname.lastName || ""}`.toLowerCase() : (String(o.patientName || "").toLowerCase());
                return fk.includes(lower) || vid.includes(lower) || name.includes(lower);
              })
            );
          }}
          sx={{ width: 360 }}
        />
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
          <Table stickyHeader sx={{ minWidth: 1100, '& .MuiTableCell-head': { backgroundColor: '#f5f5f5', whiteSpace: 'nowrap', textAlign: 'center', py: 1 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} sx={{ flexWrap: 'nowrap' }}>
                    <span>Seq</span>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  Reg ID
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
                  Visit Date & Time
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
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    whiteSpace: "nowrap",
                  }}
                >
                  Bill
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOpd.length > 0 ? (
                filteredOpd?.map((row, i) => {
                  // Try to find patient details for display
                  const patient = (patients || []).find((p) =>
                    String(p.patientId) === String(row.fkRegId) ||
                    String(p.id) === String(row.fkRegId) ||
                    String(p.oldNo) === String(row.oldRegId) ||
                    String(p.PK_RegId) === String(row.fkRegId)
                  );

                  const name = patient
                    ? `${patient.title ? patient.title + " " : ""}${patient.firstName || patient.name || ""} ${patient.lastName || ""}`.trim()
                    : (row.patientName || "");

                  const visitDateTime = row.visitDate
                    ? (new Date(row.visitDate).toLocaleString())
                    : (row.visitDateTime || row.dateTime || "");

                  return (
                    <TableRow key={row.pkVisitId || row._id || i}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: 12, color: '#666' }}>#{i + 1}</div>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.fkRegId || ""}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar className="avatar-responsive" sx={{ width: 32, height: 32 }}>
                            {(name || "").charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>{name}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{visitDateTime}{row.visitTime ? `, ${row.visitTime}` : ""}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{patient?.dateOfBirth || ""}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{patient?.sex || ""}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{patient?.permanentAddress?.mobileNo || ""}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {patient?.permanentAddress?.addressLine || ""}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedPatientForBills(patient || { patientId: row.fkRegId, PK_RegId: row.fkRegId, oldNo: row.oldRegId });
                            setOpenBillsDialog(true);
                          }}
                        >
                          View Bills
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 2 }}>
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bills Dialog */}
        <Dialog open={openBillsDialog} onClose={() => setOpenBillsDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Patient Bills</DialogTitle>
          <DialogContent>
            {
              (() => {
                const allBills = Array.isArray(billdetails?.data)
                  ? billdetails.data
                  : Array.isArray(billdetails)
                  ? billdetails
                  : [];
                if (!selectedPatientForBills) return <Typography>No patient selected.</Typography>;
            console.log("checkdata",billdetails?.data);
                // determine candidate registration ids (try multiple possibilities)
                const candidateIds = [];
                const addCandidate = (v) => {
                  if (v === undefined || v === null) return;
                  const num = Number(v);
                  if (!isNaN(num) && num !== 0) candidateIds.push(num);
                  // also keep string representation for non-numeric ids
                  candidateIds.push(String(v));
                };
                addCandidate(selectedPatientForBills.PK_RegId);
                addCandidate(selectedPatientForBills.id);
                addCandidate(selectedPatientForBills.patientId);
                addCandidate(selectedPatientForBills.oldNo);
                addCandidate(selectedPatientForBills.oldRegId || selectedPatientForBills.OLDRegID);
               
                // normalize bills array
                const allBillsArr = allBills || [];

                // Filter bills matching any of candidate ids (numeric or string match)
                let filtered = allBillsArr.filter((b) => {
                  const billIdsToCheck = [b.FK_RegId, b.OLDRegID, b.OLDRegId, b.oldRegId, b.patientId, b.FK_RegId?.toString(), b.PK_BillId];
                  return candidateIds.some((cid) => billIdsToCheck.some((x) => x !== undefined && x !== null && String(x) === String(cid)));
                });

                // Apply simple text filter (search within BillNo or Remarks)
                if (billsFilterText && billsFilterText.trim() !== '') {
                  const q = billsFilterText.trim().toLowerCase();
                  filtered = filtered.filter((b) => (String(b.BillNo || b.billId || b.PK_BillId || '') + ' ' + String(b.Remarks || '')).toLowerCase().includes(q));
                }

                // Sort by BillDate desc when possible
                filtered.sort((a, b) => {
                  const da = a.BillDate ? new Date(a.BillDate).getTime() : 0;
                  const db = b.BillDate ? new Date(b.BillDate).getTime() : 0;
                  return db - da;
                });

                if (!filtered.length) return <Typography>No bills found for this patient.</Typography>;

                return (
                  <>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <TextField size="small" placeholder="Filter by bill # or remarks" value={billsFilterText} onChange={(e) => setBillsFilterText(e.target.value)} sx={{ flex: 1 }} />
                      <Typography sx={{ ml: 1 }}><strong>{filtered.length}</strong> bill(s)</Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ mt: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Bill ID</TableCell>
                            <TableCell>Bill No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Net Amount</TableCell>
                            <TableCell>Remarks</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filtered.map((b, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Button
                                  component={Link}
                                  to="/Billinginformation"
                                  state={{ bill: b, patient: selectedPatientForBills }}
                                  size="small"
                                  variant="text"
                                  sx={{ textTransform: 'none', color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                  {b.billId || b.PK_BillId || b.BillNo}
                                </Button>
                              </TableCell>
                              <TableCell>{b.BillNo || b.billId || b.PK_BillId}</TableCell>
                              <TableCell>{b.BillDate ? new Date(b.BillDate).toLocaleString() : ''}</TableCell>
                              <TableCell>{b.NetBillAmt ?? b.NetAmt ?? ''}</TableCell>
                              <TableCell>{b.Remarks || ''}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                );
              })()
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBillsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

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
            Total Records: {opdTotal ?? filteredOpd.length}
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
