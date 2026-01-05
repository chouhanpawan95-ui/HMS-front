import { Controller, useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import {
  useCreateServiceMutation,
  useGetServiceCategoryMasterQuery,
  useGetServiceQuery,
} from "../../features/api/Hooks/serviceApi";
import { useState } from "react";
import Loader from "../../component/Loader";
import style from "../BillingMaster/RateListMaster.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const ServiceMaster = () => {
  // const [selectedDepartment,setSelectedDepartment] = useState();
  // const {data:serviceDepartment=[], isLoading:isServiceDepartmentLoading} = useGetServiceDepartmentMasterQuery();

  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: serviceCategory = [], isLoading: isServiceCategoryLoading } =
    useGetServiceCategoryMasterQuery();
  console.log('Category sample:', serviceCategory[0]);

  const {
    data: Service = [],
    isLoading: isServiceLoading,
    refetch,
  } = useGetServiceQuery();
  const [createdService] = useCreateServiceMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const onSubmitService = async (data) => {
    try {
      await createdService({
        FK_CategoryId: 1,
        ServiceName: data.ServiceName,
        ServiceDescription: data.ServiceDescription || "",
        ServiceCode: data.ServiceCode || "NA",
        ServiceTime: data.ServiceTime || "",

        FK_TestTypeId: 1,
        IsOutSidePerform: false,
        IsSCApplicable: false,
        CPTCode: "NA",
        IsActive: true,
        InvestigationType: "General",
        InvestigationGroup: "",
        HSNNO: "",
        IsDoctorIDRequired: false,
        FK_SampleTypeId: 0,
        FK_LabDepartmentID: 0,
        DeliveryPeriod: "",
        DeliveryTime: "",
      }).unwrap();

      reset();
      refetch();
      alert("Service created successfully.");
    } catch (err) {
      console.error("Service Error:", err);
      console.error("Backend message:", err?.data?.message);
      console.error("Validation errors:", err?.data?.errors);
      alert("Service not created.");
    }
  };

  const isLoading = isServiceCategoryLoading || isServiceLoading;
  if (isLoading) return <Loader />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: { xs: "62%" },
          mb: 1000,
          mx: "auto",
          borderRadius: 3,
          mt: { xs: 6, sm: 8 },
          overflow: "hidden",
          background: "White",
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} className={style.header}>
            Service Master
          </Typography>
        </Box>

        <Box p={{ xs: 2, sm: 3, md: 4 }}>
          <form onSubmit={handleSubmit(onSubmitService)}>
            <Grid container spacing={3}>
              {/* <Grid
                item
                xs={12}
                sm={6}
                md={4}
                sx={{ height: "50%", width: "40%" }}
              >
                <TextField
                  select
                  SelectProps={{ native: true }}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  fullWidth
                  value={selectedCategory}
                  size="small"
                  required
                >
                  <option value="">Select Category</option>
                  {serviceCategory.map((sc) => (
                    <option key={sc.categoryId} value={sc.categoryId}>
                      {sc.CategoryName}
                    </option>
                  ))}
                </TextField>
              </Grid> */}
              <Grid sx={{ width: { xs: "100%", md: "40%" } }}>
                  <TextField
                  fullWidth
                  value={selectedCategory}
                  size="small"
                  label='Category'
                />

              </Grid>

              <Grid item xs={12} sm={6}  sx={{ height: "50%", width: "40%" }}       >
                <TextField
                  label="Service Name"
                  fullWidth
                  size="small"
                  {...register("ServiceName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}  sx={{ width: "83%" }}>
                <TextField
                  label="Description"
                  {...register("ServiceDescription")}
                  fullWidth
                  sx={{ width: "100%" }}
                  rows={4}
                  multiline
                />
              </Grid>
              <Grid item xs={12} sm={6}  sx={{ height: "53%", width: "43%" }}>
                <TextField
                  label="Service Code"
                  // type="number"
                  fullWidth
                  size="small"
                  {...register("ServiceCode")}
                />
              </Grid>
              <Grid item xs={12} sm={6}  sx={{ height: "53%", width: "33%" }}>
                <Controller
                  name="ServiceTime"
                  control={control}
                  defaultValue={null}
                  render={({field}) => (
                    <TimePicker
                      {...field}
                      label='Service Time'
                      value={field.value ?? null}
                      onChange={(val) => field.onChange(val)}
                      slotProps={{
                        textField:{
                          fullWidth:true,
                          size:'small',
                          error : !!errors.ServiceTime,
                          helperText: errors.ServiceTime?.message
                        }
                      }}
                    />
                  )}
                />
                {/* <TextField
                  label="Service Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  {...register("ServiceTime")}
                /> */}
              </Grid>
              <Grid item xs={12} sm={6} sx={{width:'30%'}}>
                <Button type="Submit" variant="contained" sx={{alignItems:'center'}}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
    </LocalizationProvider>
  );
};
export default ServiceMaster;
