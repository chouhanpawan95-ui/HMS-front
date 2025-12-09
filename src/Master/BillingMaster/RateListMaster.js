import {
  Box,
  Button,
  Container,
  Paper,
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
} from "@mui/material";
import {
  useCreateRateListMutation,
  useGetRateListQuery,
  useCreateRateListDetailMutation,
  useGetRateListDetailQuery,
  useGetServiceQuery,
  useUpdateRateListDetailMutation,
} from "../../features/api/billingMasterApi";
import { useForm } from "react-hook-form";
import Loader from "../../component/Loader";
import { useEffect, useState } from "react";
import style from "../BillingMaster/RateListMaster.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";

const RateListMaster = () => {
  
  const { id } = useParams();
  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [createRateList, { isLoading, isSuccess, isError, error }] =
    useCreateRateListMutation();

  const [selectedRateList, setSelectedRateList] = useState("");
  const { data: ratelist = [] } = useGetRateListQuery();

  const [selectdService, setSelectedService] = useState("");
  const { data: service = [] } = useGetServiceQuery();

  const { data: ratelistdetail, refetch } = useGetRateListDetailQuery(id);
  const [createRateListDetail] = useCreateRateListDetailMutation();

  const [updateRateListDetail] = useUpdateRateListDetailMutation();

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

  const deleteRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const [activeTab, setActiveTab] = useState(0);
  const [createRateListId, setCreatedRateListId] = useState("");

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

  // Get service label from service object
  const serviceLabel = (s) => {
    return s?.serviceName || s?.ServiceName || s?.name || s?.id || "Unknown";
  };

  const onSubmitRateList = async (data) => {
    try {
      const res = await createRateList({
        FK_BranchId: data.FK_BranchId || "",
        RateListName: data.RateListName,
        StartDate: data.StartDate,
        Validupto: data.Validupto,
        IsActive: true,
      }).unwrap();

      // alert("Rate List added successfully!");

      setCreatedRateListId(res?.RateListId || res?._id); // USE backend returned ID
      setActiveTab(1); // move next tab

      reset();
    } catch (err) {
      console.error("Failed to add RateList:", err);
      alert("RateList crearion failed: " + JSON.stringify(err.data));
    }
  };

  const details = Array.isArray(ratelistdetail)
   ? ratelistdetail
   : ratelistdetail?.data ?? [];

  useEffect(() => {
    if (isEdit && details.length > 0) {
      setRows(
        details.map((item) => ({
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
      setActiveTab(1);
    }
  }, [id,isEdit, details]);

  const submitDetails = async () => {
    if (!createRateList && !isEdit) {
      return alert("RateList id missing");
    }
    if (isEdit) {
      for (let formData of rows) {
        await updateRateListDetail({
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
        });
      }
      alert("RateListDetail updated");
      return;
    }
    try {
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
        });
      }
      alert("RateListDetail created");
      // setActiveTab(0);
      setRows([]);
    } catch (err) {
      alert("Details error: " + JSON.stringify(err.data));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Rate List" disabled={isEdit}/>
        <Tab label="Rate List Detail" disabled={!createRateListId} />
      </Tabs>

      {activeTab === 0 && (
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

      {activeTab === 1 && (
        <Paper>
          <Typography variant="h4" mb={2} className={style.header}>
            RateList Detail
          </Typography>

          <form onSubmit={handleSubmit(submitDetails)} className={style.form}>
            <TableContainer component={Paper} sx={{ maxHeight: 500, borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow style={{ background: "#5896d4ff" }}>
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
                        {Array.isArray(service) &&
                          service.map((s) => {
                            const idVal =
                              s?.serviceId ?? s?.serviceId ?? s?._id ?? s?.id;
                            return (
                              <option key={idVal} value={idVal}>
                                {serviceLabel(s)}
                              </option>
                            );
                          })}
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
                          handleRowChange(idx, "RateSemiDelux", e.target.value)
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
                          handleRowChange(idx, "ServiceCharge", e.target.value)
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
          <Box className={style.buttonContainer}>
            <Button onClick={() => setActiveTab(0)} variant="contained">
              Back
            </Button>

            <Button onClick={addRow} variant="contained">
              + Add Row
            </Button>

            <Button type="button" variant="contained" onClick={submitDetails}>
              {isEdit ? 'Update':'Create'}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default RateListMaster;
