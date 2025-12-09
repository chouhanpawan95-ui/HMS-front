import {
  Table,
  TableContainer,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
} from "@mui/material";

import {
  useGetRateListQuery,
  useGetServiceQuery,
  useGetRateListDetailQuery,
} from "../../features/api/billingMasterApi";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/Loader";
import style from "../BillingMaster/RateListMaster.module.css";

const RateListInfo = () => {
  const navigate = useNavigate();

  const { data: ratelist = [] } = useGetRateListQuery();
  const { data: service = [] } = useGetServiceQuery();
  const { data: ratelistdetail, isLoading } = useGetRateListDetailQuery();

  // Search + Filters + Pagination
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterRateList, setFilterRateList] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Normalize API data
  const infoList = Array.isArray(ratelist)
    ? ratelist
    : Array.isArray(ratelist?.data)
    ? ratelist.data
    : [];

  const infoDetail = Array.isArray(ratelistdetail)
    ? ratelistdetail
    : Array.isArray(ratelistdetail?.data)
    ? ratelistdetail.data
    : [];

  // Merge rateList + rateListDetail
  const mergedData = infoDetail.map((detail) => {
    const rl = infoList.find((r) => r._id === detail.FK_RateListId);
    return {
      ...detail,
      RateListName: rl?.RateListName || "--",
      BranchId: rl?.FK_BranchId || "--",
      StartDate: rl?.StartDate?.split("T")[0] || "--",
      Validupto: rl?.Validupto?.split("T")[0] || "--",
    };
  });

  // Apply search + filters
  const filteredRows = mergedData.filter((row) => {
    const matchesSearch =
      row.FK_ServiceId.toLowerCase().includes(search.toLowerCase()) ||
      row.RateListName.toLowerCase().includes(search.toLowerCase()) ||
      row.BranchId.toString().includes(search);

    const matchesBranch = filterBranch ? row.BranchId === filterBranch : true;
    const matchesService = filterService ? row.FK_ServiceId === filterService : true;
    const matchesRateList = filterRateList ? row.RateListName === filterRateList : true;

    return matchesSearch && matchesBranch && matchesService && matchesRateList;
  });

  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        RateList Info
      </Typography>

      {/* Filters Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        {/* Search */}
        <TextField
          label="Search"
          placeholder="Search Service, RateList, Branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", md: "30%" } }}
        />

        {/* Branch Filter */}
        <FormControl sx={{ width: { xs: "100%", md: "20%" } }}>
          <InputLabel>Branch</InputLabel>
          <Select
            value={filterBranch}
            label="Branch"
            onChange={(e) => setFilterBranch(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {[...new Set(mergedData.map((row) => row.BranchId))].map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Service Filter */}
        <FormControl sx={{ width: { xs: "100%", md: "20%" } }}>
          <InputLabel>Service</InputLabel>
          <Select
            value={filterService}
            label="Service"
            onChange={(e) => setFilterService(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {[...new Set(mergedData.map((row) => row.FK_ServiceId))].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* RateList Filter */}
        <FormControl sx={{ width: { xs: "100%", md: "20%" } }}>
          <InputLabel>RateList</InputLabel>
          <Select
            value={filterRateList}
            label="RateList"
            onChange={(e) => setFilterRateList(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {[...new Set(mergedData.map((row) => row.RateListName))].map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 500, borderRadius: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                "ServiceId",
                "BranchId",
                "RateList Name",
                "StartDate",
                "Validupto",
                "General",
                "SemiPrivate",
                "Private",
                "SemiDelux",
                "Delux",
                "Discount",
                "MaxLimit",
                "ServiceCharge",
                "Action",
              ].map((title) => (
                <TableCell
                  key={title}
                  sx={{ fontWeight: "bold", backgroundColor: "#1976d2" }}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.FK_ServiceId}</TableCell>
                <TableCell>{row.BranchId}</TableCell>
                <TableCell>{row.RateListName}</TableCell>
                <TableCell>{row.StartDate}</TableCell>
                <TableCell>{row.Validupto}</TableCell>
                <TableCell>{row.RateGeneral}</TableCell>
                <TableCell>{row.RateSemiPrivate}</TableCell>
                <TableCell>{row.RatePrivate}</TableCell>
                <TableCell>{row.RateSemiDelux}</TableCell>
                <TableCell>{row.RateDelux}</TableCell>
                <TableCell>{row.Discount}</TableCell>
                <TableCell>{row.MaxDiscountLimit}</TableCell>
                <TableCell>{row.ServiceCharge}</TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/RateListMaster/${row.FK_RateListId}`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default RateListInfo;
