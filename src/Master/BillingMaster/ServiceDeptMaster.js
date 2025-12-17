import React from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCreateServiceMutation } from "../../features/api/Hooks/serviceApi";
import { jsx } from "react/jsx-runtime";

export default function SampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createService, { isLoading }] = useCreateServiceMutation();

  const onSubmit = async (data) => {
    console.log("Raw Form Data:", data);

    const payload = {
      FK_CategoryId: 1,
      ServiceName: data.serviceName,
      FK_TestTypeId: 1,
      IsOutSidePerform: false,
      IsSCApplicable: false,
      ServiceCode: data.serviceCode || "NA",
      CPTCode: data.cptCode || "NA",
      ServiceDescription: data.description,
      IsActive: data.isActive || false,
      InvestigationType: data.investigationType || "General",
      ServiceTime: data.serviceTime || "",
      InvestigationGroup: data.investigationGroup || "",
      HSNNO: data.hsnNo || "",
      IsDoctorIDRequired: data.isDoctorIDRequired || false,
      FK_SampleTypeId: Number(data.sampleTypeId) || 0,
      FK_LabDepartmentID: Number(data.departmentName),
      DeliveryPeriod: data.deliveryPeriod || "",
      DeliveryTime: data.deliveryTime || "",
    };

    console.log("Final Payload Sending to API:", payload);

    try {
      const response = await createService(payload).unwrap();
      console.log("API Response:", response);
      alert("Service Created Successfully!");
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to create service");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: "auto", mt: 10}} >
      <Typography variant="h4" mb={2}>
        Service Master
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>

          {/* Department Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department Name"
              fullWidth
              {...register("departmentName", {
                required: "Department name is required",
              })}
              error={!!errors.departmentName}
              helperText={errors.departmentName?.message}
            />
          </Grid>

          {/* Category Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category Name"
              fullWidth
              {...register("FK_CategoryId", {
                required: "Category name is required",
              })}
              error={!!errors.FK_CategoryId}
              helperText={errors.FK_CategoryId?.message}
            />
          </Grid>

          {/* Service Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Service Name"
              fullWidth
              {...register("serviceName", {
                required: "Service name is required",
              })}
              error={!!errors.serviceName}
              helperText={errors.serviceName?.message}
            />
          </Grid>

          {/* Test Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Test Type"
              fullWidth
              {...register("testType", {
                required: "Test type is required",
              })}
              error={!!errors.testType}
              helperText={errors.testType?.message}
            />
          </Grid>

          {/* Description */}
         <Grid item xs={12}>
        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          sx={{ width: { xs: "100%", sm: "100%", md: "230%" } }}   // widen on large screens
          {...register("description")}
        />
      </Grid>


          {/* ===================================== */}
          {/* LAB FORMAT → FORCE NEW LINE           */}
          {/* ===================================== */}

          <Grid item xs={12} style={{ width: "100%", display: "block" }}>
            <Typography variant="h6" mt={2}>
              Lab Format
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Test Name"
              fullWidth
              {...register("labTestName", {
                required: "Test name is required",
              })}
              error={!!errors.labTestName}
              helperText={errors.labTestName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Reference Range"
              fullWidth
              {...register("referenceRange", {
                required: "Reference range is required",
              })}
              error={!!errors.referenceRange}
              helperText={errors.referenceRange?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Actual Result"
              fullWidth
              {...register("actualResult", {
                required: "Actual result is required",
              })}
              error={!!errors.actualResult}
              helperText={errors.actualResult?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormLabel>Is Heading</FormLabel>
            <FormControlLabel
              control={<Checkbox {...register("isHeading")} />}
            />
          </Grid>

          {/* ===================================== */}
          {/* WORD DOCUMENT → FORCE NEW LINE        */}
          {/* ===================================== */}

          <Grid item xs={12} style={{ width: "100%", display: "block" }}>
            <Typography variant="h6" mt={2}>
              Word Document Relation with Service
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Document Name"
              fullWidth
              {...register("documentName", {
                required: "Document name is required",
              })}
              error={!!errors.documentName}
              helperText={errors.documentName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Document File Name"
              fullWidth
              {...register("documentFileName", {
                required: "Document file name is required",
              })}
              error={!!errors.documentFileName}
              helperText={errors.documentFileName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormLabel>Is Active</FormLabel>
            <FormControlLabel
              control={<Checkbox {...register("isActive")} />}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isLoading}
              sx={{ textTransform: "none" }}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </Grid>

        </Grid>
      </form>
    </Paper>
  );
}