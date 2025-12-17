import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tabs,
  Tab,
  TableContainer,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Pagination,
} from "@mui/material";
import {
  useGetServiceQuery
} from "../../features/api/Hooks/serviceApi.js";
import {
  useUpdateRateListMutation
} from "../../features/api/Hooks/ratelistApi.js";
import {
  useCreateRateListMutation,
  useGetRateListQuery,
  useCreateRateListDetailMutation,
  useGetRateListDetailQuery,
  useUpdateRateListDetailMutation,
  useDeleteRateListDetailMutation,
} from "../../features/api/Hooks/ratelistApi";
import { useForm } from "react-hook-form";
import Loader from "../../component/Loader";
import { useEffect, useState } from "react";
import style from "../BillingMaster/RateListMaster.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Discount } from "@mui/icons-material";

const RateListMaster = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const ratelistId = id ? String(id):"";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm();

  const [ createRateList,  { isLoading: isCreateLoading, isSuccess, isError, error } ] = useCreateRateListMutation();

  // const [selectedRateList, setSelectedRateList] = useState("");

  const [selectdService, setSelectedService] = useState("");
  const { data: service = [], isLoading: isServiceLoading } =
    useGetServiceQuery();

  

  // Normalize services into a consistent shape so we always use the DB identifier
  // for option values (this handles cases where API returns fields like serviceId, ServiceId, service_code, _id, etc.)
  const normalizedServices = Array.isArray(service)
    ? service.map((s) => {
        const idVal =
          s?.serviceId ??
          s?.ServiceId ??
          s?.service_code ??
          s?.serviceCode ??
          s?._id ??
          s?.id ??
          "";
        const label =
          (s?.serviceName ?? s?.ServiceName ?? s?.name ?? s?.title ?? idVal) ||
          "Unknown";
        return { id: idVal, label, raw: s };
      })
    : [];
    console.log("Test project");
  const { data: ratelist = [], isLoading: isRateListLoading } =
    useGetRateListQuery();
        console.log("Test project1",ratelist);
  const { data: ratelistdetail, isLoading: isRateListDetailLoading } =
    useGetRateListDetailQuery();
     console.log("Test project2",ratelistdetail);
  const [deleteRateListDetail] = useDeleteRateListDetailMutation();

  const [createRateListDetail] = useCreateRateListDetailMutation();

  const [updateRateListDetail] = useUpdateRateListDetailMutation();
  const [updateRateList, {isLoading:isUpdateRateListLoading}]  = useUpdateRateListMutation();

  const navigate = useNavigate();

  // Search + Filters + Pagination
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterRateList, setFilterRateList] = useState("");

  
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([
    {
      FK_ServiceId: "",
      RateGeneral: "",
      RateSemiPrivate: "",
      RatePrivate: "",
      RateSemiDelux: "",
      RateDelux: "",
      ServiceCharge: "",
      Discount: "",
      MaxDiscountLimit: "",
      IsActive: true,
    },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [createRateListId, setCreatedRateListId] = useState(ratelistId);

  // Get details array from API response
  const details = Array.isArray(ratelistdetail)
    ? ratelistdetail
    : ratelistdetail?.data ?? [];

  // Load details into rows when in edit mode
  useEffect(() => {
    if (isEdit && details.length > 0) {
      const rateDetailsForId = details.filter((item) => {
        const fk =
          item.FK_RateListId ??
          item.FK_rateListId ??
          item.ratelistId ??
          item.rateListId ??
          "";
        return String(fk) === String(id);
    });
      setRows(
        rateDetailsForId.map((item) => ({
          _id: item._id,
          FK_ServiceId: item.FK_ServiceId,
          RateGeneral: item.RateGeneral,
          RateSemiPrivate: item.RateSemiPrivate,
          RatePrivate: item.RatePrivate,
          RateSemiDelux: item.RateSemiDelux,
          RateDelux: item.RateDelux,
          ServiceCharge: item.ServiceCharge,
          Discount: item.Discount,
          MaxDiscountLimit: item.MaxDiscountLimit,
        }))
      );
      setCreatedRateListId(id);
      setActiveTab(2);
    }
  }, [id, isEdit, details]);

  const rowsPerPage = 10;

  // Normalize API data
  const infoList = Array.isArray(ratelist)
    ? ratelist
    : Array.isArray(ratelist?.data)
    ? ratelist?.data
    : [];

  const infoDetail = Array.isArray(ratelistdetail)
    ? ratelistdetail
    : Array.isArray(ratelistdetail?.data)
    ? ratelistdetail.data
    : [];

  // Merge rateList + rateListDetail
  const mergedData = infoList.map((rl) => {
    const rlId = 
      rl._id ?? rl.ratelistId ?? rl.RateListId ?? rl.rateListId ?? '';

    const detail = infoDetail.find((r) => {
      const fk = r.FK_RateListId ?? r.FK_rateListId ?? r.RateListMaster ?? "";
      return String(fk) === String(rlId);
    });
    return {
      FK_RateListId:rlId,
      BranchId:rl.FK_BranchId ?? '--',
      RateListName:rl.RateListName ?? '--',
      StartDate:
        (rl?.StartDate ?? rl?.startdate)
          ? (rl?.StartDate ?? rl?.startdate).split("T")[0]: "--",
      Validupto:
        (rl?.Validupto ?? rl?.Validupto ?? rl?.validupto)
          ? (rl?.Validupto ?? rl?.validupto).split("T")[0] : "--",
      RateDelux:detail?.RateDelux ?? '',
      RateGeneral:detail?.RateGeneral ?? '',
      RatePrivate:detail?.RatePrivate ?? '',
      RateSemiDelux:detail?.RateSemiDelux ?? '',
      RateSemiPrivate:detail?.RateSemiPrivate ?? '',
      FK_ServiceId:detail?.FK_ServiceId??'',
      MaxDiscountLimit:detail?.MaxDiscountLimit ?? '',
      ServiceCharge:detail?.ServiceCharge ?? '',
      Discount:detail?.Discount ?? '',
    };
  });

  // Apply search + filters
  const filteredRows = mergedData.filter((row) => {
    const fkServiceStr = (row.FK_ServiceId ?? "").toString().toLowerCase();
    const rateListNameStr = (row.RateListName ?? "").toString().toLowerCase();
    const branchIdStr = (row.BranchId ?? "").toString();
    const matchesSearch =
      fkServiceStr.includes(search.toLowerCase()) ||
      rateListNameStr.includes(search.toLowerCase()) ||
      branchIdStr.includes(search);

    const matchesBranch = filterBranch ? row.BranchId === filterBranch : true;
    const matchesService = filterService
      ? row.FK_ServiceId === filterService
      : true;
    const matchesRateList = filterRateList
      ? row.RateListName === filterRateList
      : true;

    return matchesSearch && matchesBranch && matchesService && matchesRateList;
  });

  // If editing, prefill the RateList form with master values
  useEffect(() => {
    if (isEdit && infoList.length > 0) {
      const currentRateList = infoList.find(
        (r) => (r._id ?? r.rateListId) === id
      );
      if (currentRateList) {
        reset({
          RateListName: currentRateList.RateListName,
          StartDate: ((currentRateList.StartDate ?? currentRateList.startdate) || "").split("T")[0] || "",
          Validupto: ((currentRateList.Validupto ?? currentRateList.validupto) || "").split("T")[0] || "",
          FK_BranchId: currentRateList.FK_BranchId ?? "",
        });
        setCreatedRateListId(currentRateList._id ?? currentRateList.rateListId ?? "");
      }
    }
  }, [isEdit, infoList, id, reset]);

  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Combined loading state: show loader if any API is loading
  const isLoading =
    isCreateLoading ||
    isServiceLoading ||
    isRateListLoading ||
    isRateListDetailLoading;
  if (isLoading) return <Loader />;

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        FK_ServiceId: "",
        RateGeneral: "",
        RateSemiPrivate: "",
        RatePrivate: "",
        RateSemiDelux: "",
        RateDelux: "",
        ServiceCharge: "",
        Discount: "",
        MaxDiscountLimit: "",
        IsActive: true,
      },
    ]);
  };

  const deleteRow = async (index) => {
    const row = rows[index];
    if (row._id) {
      await deleteRateListDetail(row._id ?? row.rateListDetailId);
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle row change in table
  const handleRowChange = (rowIdx, fieldName, value) => {
    setRows((prev) =>
      prev.map((row, idx) => {
        if (idx === rowIdx) {
          return { ...row, [fieldName]: value };
        }
        return row;
      })
    );
  };

  // Get service label from service object (robust to various field names)
  const serviceLabel = (s) => {
    return (
      s?.serviceName ||
      s?.ServiceName ||
      s?.name ||
      s?.title ||
      s?.serviceTitle ||
      s?.displayName ||
      s?.id ||
      s?._id ||
      "Unknown"
    );
  };

  const onSubmitRateList = async (data) => {
    try {
      let res;
      if (isEdit) {
        // update existing rate list
        res = await updateRateList({ id, payload: {
          FK_BranchId: data.FK_BranchId || "",
          RateListName: data.RateListName,
          StartDate: data.StartDate,
          Validupto: data.Validupto,
          IsActive: true,
        }}).unwrap();
      } else {
        res = await createRateList({
        FK_BranchId: data.FK_BranchId || "",
        RateListName: data.RateListName,
        StartDate: data.StartDate,
        Validupto: data.Validupto,
        IsActive: true,
        }).unwrap();
      }

      // alert("Rate List added successfully!");

      setCreatedRateListId(res?.rateListId || res?.RateListId || res?._id || "");
      setActiveTab(2); // move next tab

      reset();
    } catch (err) {
      console.error("Failed to add RateList:", err);
      alert("RateList crearion failed: " + JSON.stringify(err.data));
    }
  };

  const submitDetails = async () => {
    if (!createRateListId && !isEdit) {
      return alert("RateList id missing");
    }
    if (isEdit) {
      try {
        // Master update happens from Rate List tab; details update only here

        for (let formData of rows) {
          if (formData._id || formData.rateListDetailId) {
            await updateRateListDetail({
              id: formData._id ?? formData.rateListDetailId,
              payload: {
                FK_RateListId: id,
                FK_ServiceId: formData.FK_ServiceId,
                RateGeneral: formData.RateGeneral,
                RateSemiPrivate: formData.RateSemiPrivate,
                RatePrivate: formData.RatePrivate,
                RateSemiDelux: formData.RateSemiDelux,
                RateDelux: formData.RateDelux,
                Discount: formData.Discount,
                MaxDiscountLimit: formData.MaxDiscountLimit,
                ServiceCharge: formData.ServiceCharge,
                IsActive: formData.IsActive,
              },
            }).unwrap();
          } else {
            // create new detail if no id present
            await createRateListDetail({
              FK_RateListId: id,
              FK_ServiceId: formData.FK_ServiceId,
              RateGeneral: formData.RateGeneral,
              RateSemiPrivate: formData.RateSemiPrivate,
              RatePrivate: formData.RatePrivate,
              RateSemiDelux: formData.RateSemiDelux,
              RateDelux: formData.RateDelux,
              Discount: formData.Discount,
              MaxDiscountLimit: formData.MaxDiscountLimit,
              ServiceCharge: formData.ServiceCharge,
              IsActive: formData.IsActive,
            }).unwrap();
          }
        }
      } catch (err) {
        console.error("Update error:", err);
        alert("Update failed: " + JSON.stringify(err));
        return;
      }
      alert("RateListDetail updated");
      setActiveTab(0);
      return;
    }
    try {
      console.log("Creating rows for RateListId:", createRateListId, rows);
      for (let formData of rows) {
        await createRateListDetail({
          FK_RateListId: createRateListId,
          FK_ServiceId: formData.FK_ServiceId,
          RateGeneral: formData.RateGeneral,
          RateSemiPrivate: formData.RateSemiPrivate,
          RatePrivate: formData.RatePrivate,
          RateSemiDelux: formData.RateSemiDelux,
          RateDelux: formData.RateDelux,
          Discount: formData.Discount,
          MaxDiscountLimit: formData.MaxDiscountLimit,
          ServiceCharge: formData.ServiceCharge,
          IsActive: formData.IsActive,
        }).unwrap();
      }
      alert("RateListDetail created");
      setActiveTab(0);
      setRows([
        {
          FK_ServiceId: "",
          RateGeneral: "",
          RateSemiPrivate: "",
          RatePrivate: "",
          RateSemiDelux: "",
          RateDelux: "",
          ServiceCharge: "",
          Discount: "",
          MaxDiscountLimit: "",
          IsActive: true,
        },
      ]);
    } catch (err) {
      alert("Details error: " + JSON.stringify(err.data));
    }
  };

  const updateMasterAndDetail = async () => {
    try{
      await updateRateList({
        id:createRateListId,
        payload:{
          RateListName:getValues('RateListName'),
          FK_BranchId:getValues('FK_BranchId'),
          StartDate:getValues('StartDate'),
          Validupto:getValues('Validupto')
        }
      }).unwrap();

      for (const d of rows){
        const payload = {
          FK_RateListId:createRateListId,
          FK_ServiceId:d.FK_ServiceId,
          RateDelux:d.RateDelux,
          RateGeneral:d.RateGeneral,
          RatePrivate:d.RatePrivate,
          RateSemiDelux:d.RateSemiDelux,
          RateSemiPrivate:d.RateSemiPrivate,
          Discount:d.Discount,
          MaxDiscountLimit:d.MaxDiscountLimit,
          ServiceCharge:d.ServiceCharge,
        };
        if(d._id){
          await updateRateListDetail({
            id:String(d._id),
            payload,
          }).unwrap();
        }else{
          await createRateListDetail(payload).unwrap();
        }
      }
      alert('Rate Update Successfully');
      navigate('/RateListMaster');
    }catch(err){
      alert('Update failed')
      console.log('Update failed: '+(error?.data?.message || error?.message || 'Unknow error'))
    }
  }

  return (
    <Box sx={{ p: 3, mt: 6 }}>
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Rate List Info" />
        <Tab label="Rate List" />
        <Tab label="Rate List Detail" disabled={!createRateListId && !isEdit} />
      </Tabs>

      {activeTab === 0 && (
        <Paper>
          <Box>
            {/* Page Title */}
            <Typography
              variant="h4"
              className={style.header}
            >
              RateList Info
            </Typography>

            {/* Filters Section */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 1,
                mt:1,
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
                  {[...new Set(mergedData.map((row) => row.BranchId))].map(
                    (b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    )
                  )}
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
                  {[...new Set(mergedData.map((row) => row.FK_ServiceId))].map(
                    (s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    )
                  )}
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
                  {[...new Set(mergedData.map((row) => row.RateListName))].map(
                    (r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>

            {/* Table */}
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 500, borderRadius: 2 }}
            >
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
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#578EE5",
                          color: "#fff",
                        }}
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
                          onClick={() =>
                            navigate(`/RateListMaster/${row.FK_RateListId}`)
                          }
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
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: "auto", mt: 10 }}>
          <Typography variant="h4" mb={2} className={style.header}>
            Rate List
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmitRateList)}
            className={style.form}
          >
            {/* RateList Name */}
            <TextField
              label="RateList Name"
              fullWidth
              margin="normal"
              {...register("RateListName", {
                required: "RateList name is required",
              })}
              error={!!errors.RateListName}
              helperText={errors.RateListName?.message}
            />

            {/* Start Date */}
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              {...register("StartDate", { required: "Start date is required" })}
              error={!!errors.StartDate}
              helperText={errors.StartDate?.message}
            />

            {/* Valid Upto */}
            <TextField
              label="Valid Upto"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              {...register("Validupto", {
                required: "Validupto date is required",
              })}
              error={!!errors.Validupto}
              helperText={errors.Validupto?.message}
            />

            {/* Branch (optional: you can remove if not needed) */}
            <TextField
              label="Branch ID"
              fullWidth
              margin="normal"
              {...register("FK_BranchId")}
            />

            <Button type="submit" variant="contained" className={style.button}>
              Next
            </Button>
          </form>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper>

          {isEdit && (
            <>
            <Typography variant="h5" sx={{ mb:2 }}>RateList Master</Typography>

            <Grid container spacing={2} sx={{ mb:4 }}>
              <Grid item xs={12} mb={4}>
                <TextField
                  label="RateList Name"
                  fullWidth
                  {...register('RateListName')}
                />
              </Grid>
              
              <Grid item xs={12} mb={4}>
                <TextField
                  label="BranchId"
                  fullWidth
                  {...register('FK_BranchId')}
                />
              </Grid>
              <Grid item xs={12} mb={4}>
                <TextField
                  label='StartDate'
                  fullWidth
                  type="date"
                  {...register('StartDate')}
                  InputLabelProps={{shrink:true}}
                />
              </Grid>
              <Grid item xs={12} mb={4}>
                <TextField
                  label="ValidUpto"
                  fullWidth
                  type="date"
                  InputLabelProps={{shrink:true}}
                  {...register('Validupto')}
                />
              </Grid>
            </Grid>
            </>
          )}

          <Typography variant="h4" mb={2} className={style.header}>
            RateList Detail
          </Typography>

          <form onSubmit={handleSubmit(submitDetails)} className={style.form}>

            <TableContainer
              component={Paper}
              sx={{ maxHeight: 500, borderRadius: 2 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow style={{ background: "#578EE5" }}>
                    <TableCell>Service</TableCell>
                    <TableCell>Rate General</TableCell>
                    <TableCell>Rate Semi Private</TableCell>
                    <TableCell>Rate Private</TableCell>
                    <TableCell>Rate Semi Delux</TableCell>
                    <TableCell>Rate Delux</TableCell>
                    <TableCell>Rate Service Charge</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>MaxDiscount Limit</TableCell>
                    {/* <TableCell>IsActive</TableCell> */}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <TextField
                          select
                          SelectProps={{ native: true }}
                          size="small"
                          value={row.FK_ServiceId}
                          onChange={(e) =>
                            handleRowChange(idx, "FK_ServiceId", e.target.value)
                          }
                        >
                          <option value="">select service</option>
                          {Array.isArray(normalizedServices) &&
                            normalizedServices.map((s) => (
                              <option
                                key={s.id || `${s.label}-${Math.random()}`}
                                value={s.id}
                              >
                                {s.label}
                              </option>
                            ))}
                        </TextField>
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.RateGeneral}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(idx, "RateGeneral", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.RateSemiPrivate}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(
                              idx,
                              "RateSemiPrivate",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.RatePrivate}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(idx, "RatePrivate", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.RateSemiDelux}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(
                              idx,
                              "RateSemiDelux",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.RateDelux}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(idx, "RateDelux", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.ServiceCharge}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(
                              idx,
                              "ServiceCharge",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.Discount}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(idx, "Discount", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          value={row.MaxDiscountLimit}
                          type="number"
                          onChange={(e) =>
                            handleRowChange(
                              idx,
                              "MaxDiscountLimit",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => deleteRow(idx)}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </form>

          <Box sx={{mt:3, display:'flex', gap:2}}>
            <Button onClick={() => setActiveTab(1)} variant="contained">
              Back
            </Button>

            <Button onClick={addRow} variant="contained">
              + Add Row
            </Button>

            <Button variant="contained" onClick={isEdit ? updateMasterAndDetail:submitDetails}
            >
              {isEdit ? "Update Rate" : "Create Rate"}
            </Button>
          </Box>
        </Paper>
      )}

    </Box>
  );
};

export default RateListMaster;
