import { useForm } from "react-hook-form";
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

// export default function SampleForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [createService, { isLoading }] = useCreateServiceMutation();

//   const onSubmit = async (data) => {
//     console.log("Raw Form Data:", data);

//     const payload = {
//       FK_CategoryId: 1,
//       ServiceName: data.serviceName,
//       FK_TestTypeId: 1,
//       IsOutSidePerform: false,
//       IsSCApplicable: false,
//       ServiceCode: data.serviceCode || "NA",
//       CPTCode: data.cptCode || "NA",
//       ServiceDescription: data.description,
//       IsActive: data.isActive || false,
//       InvestigationType: data.investigationType || "General",
//       ServiceTime: data.serviceTime || "",
//       InvestigationGroup: data.investigationGroup || "",
//       HSNNO: data.hsnNo || "",
//       IsDoctorIDRequired: data.isDoctorIDRequired || false,
//       FK_SampleTypeId: Number(data.sampleTypeId) || 0,
//       FK_LabDepartmentID: Number(data.departmentName),
//       DeliveryPeriod: data.deliveryPeriod || "",
//       DeliveryTime: data.deliveryTime || "",
//     };

//     console.log("Final Payload Sending to API:", payload);

//     try {
//       const response = await createService(payload).unwrap();
//       console.log("API Response:", response);
//       alert("Service Created Successfully!");
//     } catch (error) {
//       console.error("API Error:", error);
//       alert("Failed to create service");
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: "auto", mt: 10}} >
//       <Typography variant="h4" mb={2}>
//         Service Master
//       </Typography>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={2}>

//           {/* Department Name */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Department Name"
//               fullWidth
//               {...register("departmentName", {
//                 required: "Department name is required",
//               })}
//               error={!!errors.departmentName}
//               helperText={errors.departmentName?.message}
//             />
//           </Grid>

//           {/* Category Name */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Category Name"
//               fullWidth
//               {...register("FK_CategoryId", {
//                 required: "Category name is required",
//               })}
//               error={!!errors.FK_CategoryId}
//               helperText={errors.FK_CategoryId?.message}
//             />
//           </Grid>

//           {/* Service Name */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Service Name"
//               fullWidth
//               {...register("serviceName", {
//                 required: "Service name is required",
//               })}
//               error={!!errors.serviceName}
//               helperText={errors.serviceName?.message}
//             />
//           </Grid>

//           {/* Test Type */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Test Type"
//               fullWidth
//               {...register("testType", {
//                 required: "Test type is required",
//               })}
//               error={!!errors.testType}
//               helperText={errors.testType?.message}
//             />
//           </Grid>

//           {/* Description */}
//          <Grid item xs={12}>
//         <TextField
//           label="Description"
//           multiline
//           rows={4}
//           fullWidth
//           sx={{ width: { xs: "100%", sm: "100%", md: "230%" } }}   // widen on large screens
//           {...register("description")}
//         />
//       </Grid>

//           {/* ===================================== */}
//           {/* LAB FORMAT → FORCE NEW LINE           */}
//           {/* ===================================== */}

//           <Grid item xs={12} style={{ width: "100%", display: "block" }}>
//             <Typography variant="h6" mt={2}>
//               Lab Format
//             </Typography>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Test Name"
//               fullWidth
//               {...register("labTestName", {
//                 required: "Test name is required",
//               })}
//               error={!!errors.labTestName}
//               helperText={errors.labTestName?.message}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Reference Range"
//               fullWidth
//               {...register("referenceRange", {
//                 required: "Reference range is required",
//               })}
//               error={!!errors.referenceRange}
//               helperText={errors.referenceRange?.message}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Actual Result"
//               fullWidth
//               {...register("actualResult", {
//                 required: "Actual result is required",
//               })}
//               error={!!errors.actualResult}
//               helperText={errors.actualResult?.message}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormLabel>Is Heading</FormLabel>
//             <FormControlLabel
//               control={<Checkbox {...register("isHeading")} />}
//             />
//           </Grid>

//           {/* ===================================== */}
//           {/* WORD DOCUMENT → FORCE NEW LINE        */}
//           {/* ===================================== */}

//           <Grid item xs={12} style={{ width: "100%", display: "block" }}>
//             <Typography variant="h6" mt={2}>
//               Word Document Relation with Service
//             </Typography>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Document Name"
//               fullWidth
//               {...register("documentName", {
//                 required: "Document name is required",
//               })}
//               error={!!errors.documentName}
//               helperText={errors.documentName?.message}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Document File Name"
//               fullWidth
//               {...register("documentFileName", {
//                 required: "Document file name is required",
//               })}
//               error={!!errors.documentFileName}
//               helperText={errors.documentFileName?.message}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormLabel>Is Active</FormLabel>
//             <FormControlLabel
//               control={<Checkbox {...register("isActive")} />}
//             />
//           </Grid>

//           {/* Submit Button */}
//           <Grid item xs={12}>
//             <Button
//               variant="contained"
//               fullWidth
//               type="submit"
//               disabled={isLoading}
//               sx={{ textTransform: "none" }}
//             >
//               {isLoading ? "Submitting..." : "Submit"}
//             </Button>
//           </Grid>

//         </Grid>
//       </form>
//     </Paper>
//   );
// }

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
    formState: { errors },
  } = useForm();

  // const [row,setRow] = useState([{
  //   // FK_department :'',
  //   FK_CategoryId :'',
  //   ServiceName :'',
  //   ServiceDescription :'',
  //   IsActive:false,
  //   FK_TextTypeId:1,
  //   IsOutSidePerform:'',
  //   IsSCApplicable:false,
  //   ServiceCode:'',
  //   CPTCode:'',
  //   InvestigationType:'',
  //   ServiceTime:'',
  //   InvestigationGroup:'',
  //   HSNNO:'',
  //   IsDoctorIDRequired:false,
  //   FK_SampleTypeId:0,
  //   FK_LabDepartmentId:0,
  //   DeliveryPeriod:'',
  //   DeliveryTime:'',
  // }])

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
            <Grid container spacing={3} sx={{ mb: 4 }}>
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
              <Grid item xs={12} sm={6} md={4}>
                  <TextField
                  fullWidth
                  value={selectedCategory}
                  size="small"
                  label='Category'
                />

              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                sx={{ height: "50%", width: "40%" }}
              >
                <TextField
                  label="Service Name"
                  fullWidth
                  size="small"
                  {...register("ServiceName")}
                />
              </Grid>
              <Grid item xs={12} sm={6} mb={4} sx={{ width: "70%" }}>
                <TextField
                  label="Description"
                  {...register("ServiceDescription")}
                  fullWidth
                  sx={{ width: "100%" }}
                  rows={4}
                  multiline
                />
              </Grid>
              <Grid item xs={12} sm={6} mb={4} sx={{ height: "50%", width: "40%" }}>
                <TextField
                  label="Service Code"
                  // type="number"
                  fullWidth
                  size="small"
                  {...register("ServiceCode")}
                />
              </Grid>
              <Grid item xs={12} sm={6} mb={4} sx={{ height: "50%", width: "30%" }}>
                <TextField
                  label="Service Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  {...register("ServiceTime")}
                />
              </Grid>
              <Grid item xs={12} sm={6} mb={4} sx={{width:'30%'}}>
                <Button type="Submit" variant="contained" sx={{alignItems:'center'}}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
export default ServiceMaster;
