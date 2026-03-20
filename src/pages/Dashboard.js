/* eslint-disable unicode-bom */
// Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";
import Loader from "../component/Loader";
import { useGetPatientsQuery, useGetopdVisitQuery } from "../features/api/patientsApi";
import { useGetBillMasterQuery, useLazyGetBillMasterByRegIdQuery } from '../features/api/Hooks/billingApi';
import { Link, useNavigate } from 'react-router-dom';
export default function Dashboard() {
  const navigate = useNavigate();
  // Pagination / search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  // OPD visits state (we will show these rows instead of patients)
  const [opdList, setOpdList] = useState([]);
  const [filteredOpd, setFilteredOpd] = useState([]);
  const { data: billdetails } = useGetBillMasterQuery();
  const [fetchBillsByRegId, { data: billsByReg, isLoading: billsByRegLoading, isError: billsByRegError }] = useLazyGetBillMasterByRegIdQuery();
  const [lastRequestedRegId, setLastRequestedRegId] = useState(null);
  // Query OPD visits with pagination and optional search
  const { data: getOpd, isLoading: getOpdLoading } = useGetopdVisitQuery({ page, limit, q: searchQuery });
  console.log("billdetails", billdetails);
  const [openBillsDialog, setOpenBillsDialog] = useState(false);
  const [selectedPatientForBills, setSelectedPatientForBills] = useState(null);
  const [billsFilterText, setBillsFilterText] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  // Date filter: default to today in YYYY-MM-DD format to show today's visits by default
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  console.log("filteredPatients", filteredPatients);
  // API call
  const {
    data: patientsResp,
    error,
    isLoading,
    isError,
  } = useGetPatientsQuery({ page, limit, q: searchQuery });
  // Extract array from API response (memoized to avoid changing identity every render)
  const patients = useMemo(() => {
    return Array.isArray(patientsResp)
      ? patientsResp
      : patientsResp?.data && Array.isArray(patientsResp.data)
        ? patientsResp.data
        : [];
  }, [patientsResp]);
  // Now handle OPD updates and apply filters
  useEffect(() => {
    const rows = Array.isArray(getOpd?.data)
      ? getOpd.data
      : Array.isArray(getOpd)
        ? getOpd
        : [];
    setOpdList(rows);
    // Apply current filters when new OPD data arrives
    // (date filter defaults to today via selectedDate state)
    const applyFilters = () => {
      const dateMatches = (row) => {
        if (!selectedDate) return true;
        const raw = row.visitDate || row.visitDateTime || row.dateTime || row.VisitDate || row.visitDateTimeUTC || row.visitdate || '';
        if (!raw) return false; // no date on record
        const parsed = new Date(raw);
        if (!isNaN(parsed)) {
          return parsed.toISOString().slice(0, 10) === selectedDate;
        }
        // fallback: string-based compare
        return String(raw).slice(0, 10) === selectedDate;
      };
      const textMatches = (row) => {
        if (!searchQuery) return true;
        const lower = searchQuery.toLowerCase();
        const fk = String(row.fkRegId || "").toLowerCase();
        const vid = String(row.pkVisitId || row._id || "").toLowerCase();
        const pname = (patients || []).find(p => String(p.patientId) === String(row.fkRegId) || String(p.id) === String(row.fkRegId));
        const name = pname ? `${pname.firstName || ""} ${pname.lastName || ""}`.toLowerCase() : (String(row.patientName || "").toLowerCase());
        return fk.includes(lower) || vid.includes(lower) || name.includes(lower);
      };
      const filtered = rows.filter(r => dateMatches(r) && textMatches(r));
      setFilteredOpd(filtered);
    };
    applyFilters();
  }, [getOpd, selectedDate, searchQuery, patients]);
  // Prefer total count from OPD response; fall back to patients response
  const opdTotal = getOpd?.total || getOpd?.totalCount || getOpd?.meta?.total || null;
  const serverTotal = opdTotal ?? (
    patientsResp?.total || patientsResp?.totalCount || patientsResp?.meta?.total || null
  );
  // If date or text filters are active we operate in client-filtered mode
  const isFiltered = Boolean(selectedDate || (searchQuery && searchQuery.trim() !== ""));
  const displayTotal = isFiltered ? filteredOpd.length : (serverTotal ?? filteredOpd.length);
  const displayTotalPages = displayTotal ? Math.ceil(displayTotal / limit) : null;
  // When filtered, use client-side pagination (slice the filtered array); otherwise rely on server-side pages
  const hasMore = displayTotalPages ? page < displayTotalPages : (opdList.length === limit && !isFiltered);
  // Sync filtered patients when API data changes
  useEffect(() => {
    if (patientsResp) {
      setFilteredPatients(patients);
    }
    // reset to first page when user changes filters (text/date) so paging remains intuitive
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientsResp, selectedDate, searchQuery]);
  // Log when regid fetch returns data for debugging
  useEffect(() => {
    if (Array.isArray(billsByReg)) {
      console.log('billsByReg changed:', billsByReg, 'lastRequestedRegId:', lastRequestedRegId);
    }
  }, [billsByReg, lastRequestedRegId]);
  // Resolve selected patient object from `selectedPatientId` using loaded `patients`
  const resolveSelectedPatient = () => {
    if (!selectedPatientId) return null;
    const found = (patients || []).find((p) =>
      String(p.patientId) === String(selectedPatientId) ||
      String(p.id) === String(selectedPatientId) ||
      String(p.PK_RegId) === String(selectedPatientId) ||
      String(p.oldNo) === String(selectedPatientId)
    );
    return found || { patientId: selectedPatientId, PK_RegId: selectedPatientId };
  };
  // Show loader if patients or OPD are loading
  if (isLoading || getOpdLoading) return <Loader />;
  return (
    <Box className="dashboard-wrapper" sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mt: { xs: 2, sm: 2, md: 3 } }}>
      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load patients:{" "}
          {error?.data?.message || error?.error || JSON.stringify(error)}
        </Alert>
      )}
      {/* TABLE SECTION */}
      {/* Compact date picker above the table (aligned over 'Seq') */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* LEFT SIDE (Search + Date) */}
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search visits (visit id, reg id, name)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 250 }}
          />
          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ width: 150 }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
          >
            Today
          </Button>

          <Button size="small" onClick={() => setSelectedDate("")}>
            Clear
          </Button>
        </Box>
        {/* RIGHT SIDE (Actions) */}
        <Box display="flex" flexWrap="wrap" gap={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              const patient = resolveSelectedPatient();
              if (!patient) return alert("Select patient first");
              navigate("/layout/Billinginformation", { state: { patient } });
            }}
          >
            Create Bill
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              const patient = resolveSelectedPatient();
              if (!patient) return alert("Select patient first");
              navigate("/layout/BillReceipt", { state: { selectedPatient: patient } });
            }}
          >
            Receipt
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={!selectedPatientId}
            onClick={() =>
              selectedPatientId &&
              navigate(`/layout/IPDRegistration/${selectedPatientId}`)
            }
          >
            IPD
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <TableContainer
          className="table-container"
          component={Paper}
          sx={{
            maxHeight: 500,
            borderRadius: 2,
            overflowX: "auto",
            overflowY: "auto",
            boxShadow: 1,
            width: "100%",
          }}
        >
          {/* minWidth ensures ALL columns show on mobile via horizontal scroll */}
          <Table
            stickyHeader
            sx={{
              height: "100%",
              minWidth: 1200,
              "& .MuiTableCell-head": {
                backgroundColor: "#578EE5",
                color: "#fff",
                fontWeight: 600,
                textAlign: "center",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#578EE5", color: '#fff', textAlign: 'center', width: 50 }}>
                  {/* Checkbox column */}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#578EE5", color: '#fff', textAlign: 'center' }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} sx={{ flexWrap: 'nowrap' }}>
                    <span>Seq</span>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#578EE5",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  RegID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    whiteSpace: "nowrap",
                    backgroundColor: "#578EE5"
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#578EE5",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Visit Date & Time
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#578EE5",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  DOB
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#578EE5",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sex
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#578EE5",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  MobileNo
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#578EE5",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Address
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#578EE5",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Bill
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOpd.length > 0 ? (
                // When filters are active, show a page-slice of the filtered results, otherwise the server has provided a page
                (isFiltered ? filteredOpd.slice((page - 1) * limit, page * limit) : filteredOpd)?.map((row, i) => {
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
                      <TableCell sx={{ whiteSpace: "nowrap", textAlign: 'center' }}>
                        <Checkbox
                          checked={selectedPatientId === row.fkRegId}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPatientId(row.fkRegId);
                            } else {
                              setSelectedPatientId(null);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          #{(page - 1) * limit + i + 1}
                        </div>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{row.fkRegId || ""}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>
                            {(name || "").charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>{name}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{visitDateTime}{row.visitTime ? `, ${row.visitTime}` : ""}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {patient?.dateOfBirth?.split("T")[0] || ""}
                      </TableCell>

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
                            const candidate = patient || { patientId: row.fkRegId, PK_RegId: row.fkRegId, oldNo: row.oldRegId, displayRegId: row.fkRegId };
                            setSelectedPatientForBills(candidate);
                            setBillsFilterText("");
                            setOpenBillsDialog(true);
                            const resolvedRegId = String(row.fkRegId ?? candidate.patientId ?? candidate.PK_RegId ?? candidate.id ?? candidate.oldNo ?? '').trim();
                            setLastRequestedRegId(resolvedRegId || null);
                            console.log('View Bills clicked; fetching bills for regid:', resolvedRegId);
                            if (resolvedRegId) fetchBillsByRegId(resolvedRegId);
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
                  <TableCell colSpan={10} align="center" sx={{ py: 2 }}>
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
                const allBills = Array.isArray(billsByReg?.data)
                  ? billsByReg.data
                  : Array.isArray(billsByReg)
                    ? billsByReg
                    : Array.isArray(billdetails?.data)
                      ? billdetails.data
                      : Array.isArray(billdetails)
                        ? billdetails
                        : [];
                if (!selectedPatientForBills) return <Typography>No patient selected.</Typography>;
                console.log("fetchedBills (billsByReg):", billsByReg, "fallback billdetails:", billdetails?.data);
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

                // If we requested bills by regid from the API, prefer that array as-is (it was already filtered server-side)
                let filtered = [];
                if (Array.isArray(billsByReg) && billsByReg.length > 0) {
                  // Copy the array to avoid mutating read-only arrays returned by RTK Query
                  filtered = Array.isArray(allBillsArr) ? allBillsArr.slice() : [];
                } else {
                  // Filter bills matching any of candidate ids (numeric or string match)
                  filtered = (Array.isArray(allBillsArr) ? allBillsArr.slice() : []).filter((b) => {
                    const billIdsToCheck = [b.FK_RegId, b.OLDRegID, b.OLDRegId, b.oldRegId, b.patientId, b.FK_RegId?.toString(), b.PK_BillId];
                    return candidateIds.some((cid) => billIdsToCheck.some((x) => x !== undefined && x !== null && String(x) === String(cid)));
                  });
                }
                console.log('allBillsArr.length=', allBillsArr.length, 'candidateIds=', candidateIds, 'filtered.length=', filtered.length);

                // Apply simple text filter (search within BillNo or Remarks)
                if (billsFilterText && billsFilterText.trim() !== '') {
                  const q = billsFilterText.trim().toLowerCase();
                  filtered = filtered.filter((b) => (String(b.BillNo || b.billId || b.PK_BillId || '') + ' ' + String(b.Remarks || '')).toLowerCase().includes(q));
                }

                // Sort by BillDate desc when possible (sort a shallow copy to avoid mutating input)
                if (Array.isArray(filtered)) {
                  filtered = filtered.slice().sort((a, b) => {
                    const da = a.BillDate ? new Date(a.BillDate).getTime() : 0;
                    const db = b.BillDate ? new Date(b.BillDate).getTime() : 0;
                    return db - da;
                  });
                }
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
                                  to="/layout/Billinginformation"
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2">
            Total: <strong>{displayTotal}</strong>
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              select
              size="small"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              sx={{ width: 80 }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </TextField>
            <Button
              size="small"
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Typography>
              {page} / {displayTotalPages || 1}
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
  );
}
