import style from "./RateListMaster.module.css";
import {
  useGetPackageMasterQuery,
  useCreatePackageMasterMutation,
  useGetPackageDetailQuery,
  useCreatePackageDetailMutation,
  useGetServiceQuery,
  useUpdatePackageDetailMutation,
  useDeletePackageDetailMutation,
  useUpdatePackageMasterMutation,
} from "../../features/api/billingMasterApi";
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
  Pagination,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Loader from "../../component/Loader";
import { use, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Discount } from "@mui/icons-material";

const PackageMaster = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [createPackageMaster, { isLoading: isCreatePackageMasterLoading }] =
    useCreatePackageMasterMutation();
  const [createPackageDetail, { isLoading: isCreatePackageDetailLoading }] =
    useCreatePackageDetailMutation();
  const [deletePackageDetail, { isLoading: isDeletePackageDetailLoading }] =
    useDeletePackageDetailMutation();
  const [updatePackageDetail, { isLoading: isUpdatePackageDetailLoading }] =
    useUpdatePackageDetailMutation();
  const [updatePackageMaster, { isLoading: isUpdatePackageMasterLoading }] =
    useUpdatePackageMasterMutation();

  const [selectedPackageMaster, setSelectedPackageMaster] = useState("");
  const { data: packageMaster, isLoading: isPackageMasterLoading } =
    useGetPackageMasterQuery();

  const [createdPackageMasterId, setCreatedPackageMasterId] = useState("");

  const { data: packageDetail, isLoading: isPackageDetailLoading } =
    useGetPackageDetailQuery();

  const [selectedService, setSelectedService] = useState("");
  const { data: serviceList } = useGetServiceQuery();
  const location = useLocation();

  const rowRefs = useRef([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Normalize services into a consistent shape { id, label, raw }
  // so dropdowns show a human friendly service name regardless of API shape
  const normalizedServices = Array.isArray(serviceList)
    ? serviceList.map((s) => {
        const idVal =
          s?.serviceId ??
          s?.ServiceId ??
          s?.service_code ??
          s?.serviceCode ??
          s?._id ??
          s?.id ??
          "";
        const label =
          (s?.serviceName ??
            s?.ServiceName ??
            s?.name ??
            s?.title ??
            s?.label ??
            idVal) ||
          "Unknown";
        return { id: idVal, label, raw: s };
      })
    : Array.isArray(serviceList?.data)
    ? serviceList.data.map((s) => {
        const idVal =
          s?.serviceId ??
          s?.ServiceId ??
          s?.service_code ??
          s?.serviceCode ??
          s?._id ??
          s?.id ??
          "";
        const label =
          (s?.serviceName ??
            s?.ServiceName ??
            s?.name ??
            s?.title ??
            s?.label ??
            idVal) ||
          "Unknown";
        return { id: idVal, label, raw: s };
      })
    : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm();

  const [row, setRow] = useState([
    {
      PackageName: "",
      PackageCodeNo: "",
      PackageAmount: "",
      IsGlobal: false,
      ValidFrom: "",
      Validupto: "",
      PackageGroup: "",
    },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  // clear editing highlight when not on Package Detail tab
  useEffect(() => {
    if (activeTab !== 2) setEditingIndex(null);
  }, [activeTab]);

  // get package detail data array from api response
  const details = Array.isArray(packageDetail)
    ? packageDetail
    : packageDetail?.data ?? [];

  // load package detail into rows when in edit mode
  useEffect(() => {
    if (isEdit && details.length > 0) {
      // robustly match FK_PackageId against route id (handle different casing/field names)
      const packageDetailsForId = details.filter((item) => {
        const fk =
          item.FK_PackageId ??
          item.fk_PackageId ??
          item.FK_Package_Id ??
          item.PackageMasterID ??
          item.packageMasterId ??
          item.packageId ??
          "";
        return String(fk) === String(id);
      });

      setRow(
        packageDetailsForId.map((item) => ({
          _id: item._id ?? item.pkgDetailId ?? item.pkgDetailId,
          FK_ServiceId: item.FK_ServiceId,
          RateGeneral: item.RateGeneral,
          RatePrivate: item.RatePrivate,
          Discount: item.Discount,
          ServiceCharge: item.ServiceCharge,
        }))
      );
      setCreatedPackageMasterId(id);
      setActiveTab(2);

      // If navigation included a focus detail id, find and scroll/highlight that row
      const focusDetailId = location?.state?.focusDetailId;
      if (focusDetailId) {
        const idx = packageDetailsForId.findIndex(
          (item) =>
            String(item._id ?? item.pkgDetailId ?? item.pkgDetailId) ===
            String(focusDetailId)
        );
        if (idx !== -1) {
          // small timeout to allow DOM to render
          setTimeout(() => {
            rowRefs.current[idx]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            setEditingIndex(idx);
            // replace history state so focus doesn't persist on further navigation
            try {
              navigate(location.pathname, { replace: true, state: {} });
            } catch (err) {
              /* ignore */
            }
          }, 50);
        }
      }
    }
  }, [id, isEdit, details, location, navigate]);

  // Package Detail
  useEffect(() => {
    if (!isEdit || !details.length) return;

    const filtered = details.filter(
      (d) => String(d.FK_PackageId) === String(id)
    );

    setRow(
      filtered.map((d) => ({
        _id: d._id,
        FK_ServiceId: d.FK_ServiceId,
        RateGeneral: d.RateGeneral,
        RatePrivate: d.RatePrivate,
        Discount: d.Discount,
        ServiceCharge: d.ServiceCharge,
      }))
    );
  }, [isEdit, id, details]);

  const rowsPerPage = 10;

  // normatize api data
  const infoList = Array.isArray(packageMaster)
    ? packageMaster
    : Array.isArray(packageMaster?.data)
    ? packageMaster.data
    : [];

  const infoDetail = Array.isArray(packageDetail)
    ? packageDetail
    : Array.isArray(packageDetail?.data)
    ? packageDetail.data
    : [];

  // merge package master and detail data
  // Map over masters (ensures a master row stays visible even if it has no details)
  const mergedData = infoList.map((pm) => {
    const pmId =
      pm._id ?? pm.packageMasterId ?? pm.PackageMasterID ?? pm.packageId ?? "";

    const detail = infoDetail.find((d) => {
      const fk = d.FK_PackageId ?? d.fk_PackageId ?? d.PackageMasterID ?? "";
      return String(fk) === String(pmId);
    });

    return {
      FK_PackageId: pmId,
      FK_ServiceId: detail?.FK_ServiceId ?? "",

      PackageName: pm.PackageName ?? "--",
      PackageCodeNo: pm.PackageCodeNo ?? "--",
      PackageAmount: pm.PackageAmount ?? "--",
      PackageGroup: pm.PackageGroup ?? "--",
      ValidFrom: ((pm.ValidFrom ?? "") || "").split("T")[0] || "--",
      ValidUpto: ((pm.Validupto ?? "") || "").split("T")[0] || "--",

      RateGeneral: detail?.RateGeneral ?? "",
      RatePrivate: detail?.RatePrivate ?? "",
      Discount: detail?.Discount ?? "",
      ServiceCharge: detail?.ServiceCharge ?? "",
    };
  });

  // if editing, prefill the package master form with master data

  useEffect(() => {
    if (isEdit && infoList.length > 0) {
      const currentPackageMaster = infoList.find(
        (pm) => (pm._id ?? pm.packageId) === id
      );
      if (!currentPackageMaster) return;
      reset({
        PackageName: currentPackageMaster.PackageName ?? "-",
        PackageCode: currentPackageMaster.PackageCode ?? "-",
        PackageAmount: currentPackageMaster.PackageAmount ?? "-",
        PackageGroup: currentPackageMaster.PackageGroup ?? "-",
        ValidFrom:
          (
            (currentPackageMaster.ValidFrom ??
              currentPackageMaster.validFrom ??
              currentPackageMaster.validfrom) ||
            ""
          ).split("T")[0] || "",
        ValidUpto:
          (
            (currentPackageMaster.Validupto ??
              currentPackageMaster.validUpto ??
              currentPackageMaster.validupto) ||
            ""
          ).split("T")[0] || "",
      });
      setCreatedPackageMasterId(
        currentPackageMaster._id ?? currentPackageMaster.packageId ?? ""
      );
    }
  }, [isEdit, id, infoList, reset]);

  // search + filter + pagination
  const [search, setSearch] = useState("");
  const [filterPackageGroup, setFilterPackageGroup] = useState("");
  const [page, setPage] = useState(1);
  // apply search + filter
  const filteredRows = mergedData.filter((row) => {
    const packageName = (row.PackageName ?? "").toString().toLowerCase();
    // const fkServiceStr =

    // const matchesSearch = filterService ? row.ServiceId === filterService : true;
    const matchesPackageGroup = filterPackageGroup
      ? packagegroup === filterPackageGroup.toLowerCase()
      : true;

    return matchesPackageGroup;
  });

  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const updateMasterAndDetail = async() => {
    try{
      await updatePackageMaster({
        id,
        payload:{
          PackageName:getValues('PackageName'),
          PackageCodeNo: getValues('PackageCodeNo'),
          PackageAmount: getValues('PackageAmount'),
          ValidFrom:getValues('ValidFrom'),
          ValidUpto:getValues('ValidUpto')
        },
      }).unwrap();

      for (const d of row){
        const payload = {
          fk_PackageId:id,
          FK_ServiceId:d.FK_ServiceId,
          RateGeneral:d.RateGeneral,
          RatePrivate:d.RatePrivate,
          Discount:d.Discount,
          ServiceCharge:d.ServiceCharge
        };
        if (d._id){
          await updatePackageDetail({
            id:d._id,
            payload,
          }).unwrap();
        }else{
          await createPackageDetail(payload).unwrap();
        }
      }
      alert('Package Update successfully');
      navigate('/PackageMaster');
    }catch(error){
      console.error(error);
      alert('Update failed. Please try again.');
    }
  };

  // combaine loading states
  const isLoading =
    isPackageMasterLoading ||
    isPackageDetailLoading ||
    isCreatePackageMasterLoading ||
    isCreatePackageDetailLoading ||
    isUpdatePackageDetailLoading ||
    isDeletePackageDetailLoading ||
    isUpdatePackageMasterLoading;

  if (isLoading) return <Loader />;

  const addRow = () => {
    setRow((prev) => [
      ...prev,
      {
        FK_PackageId: "",
        FK_ServiceId: "",
        RateGeneral: "",
        RatePrivate: "",
        Discount: "",
        ServiceCharge: "",
      },
    ]);
  };

  const deleteRow = async (index) => {
    const r = row[index];
    if (r?._id) {
      await deletePackageDetail({
        id: r._id ?? r.pkgDetailId ?? r.pkgDetailId,
      })
        .unwrap()
        .catch((err) => console.error("Delete failed", err));
    }
    setRow((prev) => prev.filter((_, i) => i !== index));
    if (index === editingIndex) setEditingIndex(null);
  };

  // handle package master form submit
  const handleRowChange = (rowIndex, fieldName, value) => {
    setRow((prev) =>
      prev.map((row, idx) => {
        if (idx === rowIndex) {
          return { ...row, [fieldName]: value };
        }
        return row;
      })
    );
  };

  const onSubmitPackageMaster = async (data) => {
    try {
      let res;
      if (isEdit) {
        res = await updatePackageMaster({ id, payload: data });
        setCreatedPackageMasterId(id);
      } else {
        res = await createPackageMaster(data);
        setCreatedPackageMasterId(
          res.data._id ?? res.data.packageMasterId ?? res.data.PackageMasterID
        );
      }
      setActiveTab(2);
      reset();
    } catch (err) {
      console.error("Failed to submit package master:", err);
      alert("Error submitting package master. Please try again.");
    }
  };

  const submitPackageDetails = async () => {
    if (!createdPackageMasterId && isEdit) {
      return alert("Please save the Package Master details first.");
    }
    if (isEdit) {
      try {
        for (let formData of row) {
          if (formData._id || formData.pkgDetailId) {
            await updatePackageDetail({
              id: formData._id ?? formData.pkgDetailId,
              payload: {
                FK_PackageId: createdPackageMasterId,
                FK_ServiceId: formData.FK_ServiceId,
                RateGeneral: formData.RateGeneral,
                RatePrivate: formData.RatePrivate,
                Discount: formData.Discount,
                ServiceCharge: formData.ServiceCharge,
              },
            }).unwrap();
          } else {
            await createPackageDetail({
              FK_PackageId: createdPackageMasterId,
              FK_ServiceId: formData.FK_ServiceId,
              RateGeneral: formData.RateGeneral,
              RatePrivate: formData.RatePrivate,
              Discount: formData.Discount,
              ServiceCharge: formData.ServiceCharge,
            }).unwrap();
          }
        }
      } catch (err) {
        console.error("Failed to submit package details:", err);
        alert("Update failed. Please try again." + JSON.stringify(err));
        return;
      }
      alert("Package details updated successfully.");
      setActiveTab(0);
      return;
    }
    try {
      console.log(
        "Creating package details for PackageMasterId:",
        createdPackageMasterId,
        row
      );
      for (let formData of row) {
        await createPackageDetail({
          FK_PackageId: createdPackageMasterId,
          FK_ServiceId: formData.FK_ServiceId,
          RateGeneral: formData.RateGeneral,
          RatePrivate: formData.RatePrivate,
          Discount: formData.Discount,
          ServiceCharge: formData.ServiceCharge,
        }).unwrap();
      }
      alert("Package details created successfully.");
      setActiveTab(0);
      setRow([
        {
          FK_PackageId: "",
          FK_ServiceId: "",
          RateGeneral: "",
          RatePrivate: "",
          Discount: "",
          ServiceCharge: "",
        },
      ]);
    } catch (err) {
      alert("Creation failed. Please try again." + JSON.stringify(err));
    }
  };

  const packagegroup = [
    "GENERAL",
    "PAT",
    "TAP",
    "PANEL",
    "Insurance",
    "CmbPartyType",
  ];

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        mt: { xs: 2, sm: 4, md: 6 },
        width: "100%",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Package List" />
        <Tab label="Package Master" />
        <Tab
          label="Package Detail"
          disabled={!createdPackageMasterId && !isEdit}
        />
      </Tabs>

      {activeTab === 0 && (
        <Paper>
          <Box>
            <Typography variant="h4" className={style.header}>
              Package List
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
                mb: 2,
                mt: 2,
                // display: "flex",
                // flexWrap: "wrap",
                // gap: 2,
                // mb: 1,
                // mt:1,
                // alignItems: "center",
              }}
            >
              {/* Search */}
              <TextField
                label="Search"
                placeholder="Search service, Package ...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: "100%", mb: "30%" } }}
              />
              {/* package group filter */}
              <FormControl sx={{ width: { xs: "100%", mb: "30%" } }}>
                <InputLabel>Package Group</InputLabel>
                <Select
                  value={filterPackageGroup}
                  label="Package Group"
                  onChange={(e) => setFilterPackageGroup(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(mergedData.map((row) => row.PackageGroup))].map(
                    (g) => (
                      <MenuItem key={g} value={g}>
                        {g}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 500,
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: 2,
                }}
              >
                <Table
                  stickyHeader
                  size="small"
                  sx={{
                    minWidth: 1500,
                    "& th, & td": {
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "Service Name",
                        "Package Name",
                        "Package Code",
                        "Package Amount",
                        "Package Group",
                        "Valid From",
                        "Valid Upto",
                        "Rate General",
                        "Rate Private",
                        "Discount",
                        "Service Charge",
                        "Action",
                      ].map((title) => (
                        <TableCell
                          key={title}
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: "#578ee5",
                            color: "white",
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
                        <TableCell>
                          {normalizedServices.find(
                            (s) => String(s.id) === String(row.FK_ServiceId)
                          )?.label || row.FK_ServiceId}
                        </TableCell>
                        <TableCell>{row.PackageName}</TableCell>
                        <TableCell>{row.PackageCodeNo}</TableCell>
                        <TableCell>{row.PackageAmount}</TableCell>
                        <TableCell>{row.PackageGroup}</TableCell>
                        <TableCell>{row.ValidFrom}</TableCell>
                        <TableCell>{row.ValidUpto}</TableCell>
                        <TableCell>{row.RateGeneral}</TableCell>
                        <TableCell>{row.RatePrivate}</TableCell>
                        <TableCell>{row.Discount}</TableCell>
                        <TableCell>{row.ServiceCharge}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              const detailForRow = infoDetail.find((d) => {
                                const fk =
                                  d.FK_PackageId ??
                                  d.fk_PackageId ??
                                  d.FK_Package_Id ??
                                  d.PackageMasterID ??
                                  d.packageMasterId ??
                                  d.packageId ??
                                  "";
                                return (
                                  String(fk) ===
                                  String(
                                    row.FK_PackageId ?? row.fk_PackageId ?? ""
                                  )
                                );
                              });
                              const focusDetailId =
                                detailForRow &&
                                (detailForRow._id ??
                                  detailForRow.pkgDetailId ??
                                  detailForRow.packageDetailId ??
                                  detailForRow.PackageDetailID);
                              navigate(
                                `/PackageMaster/${
                                  row.FK_PackageId ?? row.fk_PackageId ?? ""
                                }`,
                                {
                                  state: { focusDetailId },
                                }
                              );
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

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
            Package Master
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmitPackageMaster)}
            className={style.form}
          >
            <TextField
              label="Package Name"
              fullWidth
              margin="normal"
              {...register("PackageName", {
                required: "Package name is required",
              })}
              error={!!errors.PackageName}
              helperText={errors.PackageName?.message}
            />
            <TextField
              label="Package Code"
              fullWidth
              margin="normal"
              {...register("PackageCodeNo", {
                required: "Package code is required",
              })}
            />
            <TextField
              label="Package Amount"
              fullWidth
              margin="normal"
              type="number"
              {...register("PackageAmount", {
                required: "Package amount is required",
              })}
            />
            <TextField
              label="Package Group"
              select
              fullWidth
              margin="normal"
              SelectProps={{ native: true }}
              {...register("PackageGroup", {
                required: "Package group is required",
              })}
              error={!!errors.PackageGroup}
              helperText={errors.PackageGroup?.message}
            >
              <option value=""></option>
              {packagegroup.map((pg) => (
                <option key={pg} value={pg}>
                  {pg}
                </option>
              ))}
            </TextField>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Valid From"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("ValidFrom", {
                  required: "Valid from date is required",
                })}
              />
              <TextField
                label="Valid Upto"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("ValidUpto", {
                  required: "Valid upto date is required",
                })}
              />
            </Grid>
            <Button type="submit" variant="contained" className={style.button}>
              Next
            </Button>
          </form>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          {/* ================= EDIT MODE ONLY ================= */}
          {isEdit && (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Package Master
              </Typography>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Package Name"
                    fullWidth
                    {...register("PackageName")}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Package Code"
                    fullWidth
                    {...register("PackageCodeNo")}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Package Amount"
                    type="number"
                    fullWidth
                    {...register("PackageAmount")}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Package Group"
                    fullWidth
                    SelectProps={{ native: true }}
                    {...register("PackageGroup")}
                  >
                    <option value=""></option>
                    {packagegroup.map((pg) => (
                      <option key={pg} value={pg}>
                        {pg}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    type="date"
                    label="Valid From"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("ValidFrom")}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    type="date"
                    label="Valid Upto"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("ValidUpto")}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* ================= PACKAGE DETAIL (BOTH MODES) ================= */}
          <Typography variant="h5" sx={{ mb: 2 }}>
            Package Details
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Rate General</TableCell>
                    <TableCell>Rate Private</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Service Charge</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          SelectProps={{ native: true }}
                          value={r.FK_ServiceId}
                          onChange={(e) =>
                            handleRowChange(idx, "FK_ServiceId", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {normalizedServices.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </TextField>
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={r.RateGeneral}
                          onChange={(e) =>
                            handleRowChange(idx, "RateGeneral", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={r.RatePrivate}
                          onChange={(e) =>
                            handleRowChange(idx, "RatePrivate", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={r.Discount}
                          onChange={(e) =>
                            handleRowChange(idx, "Discount", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={r.ServiceCharge}
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
                        <Button color="error" onClick={() => deleteRow(idx)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* ================= BUTTONS ================= */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={addRow}>
              + Add Row
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={isEdit ? updateMasterAndDetail : submitPackageDetails}
            >
              {isEdit ? "Update Package" : "Create Package"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
export default PackageMaster;
