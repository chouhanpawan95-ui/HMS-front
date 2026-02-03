import { Button, Container, TextField, Typography, Box, Paper, Grid } from "@mui/material";
import styles from "../../component/Container.module.css";
import { useGetServiceDepartmentMasterQuery, useCreateServiceDepartmentMasterMutation } from '../../features/api/Hooks/serviceApi.js';
import Loader from "../../component/Loader";
import { useForm } from "react-hook-form";
import style from "../BillingMaster/RateListMaster.module.css";

const ServiceDepartmentMaster = () => {
  const { data: serviceDepartmentMaster, isLoading, refetch } = useGetServiceDepartmentMasterQuery();
  console.log("Service Department Master Data:", serviceDepartmentMaster);
  const [createServiceDepartmentMaster] = useCreateServiceDepartmentMasterMutation();
  console.log("Create Service Department Master Mutation:", createServiceDepartmentMaster);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await createServiceDepartmentMaster({
        DeptName: formData.name,
        DeptType: formData.type,
        SeqNo: formData.seqNo
      }).unwrap();
      reset();
      refetch();
    } catch (err) {
      console.error("Failed to add department: ", err);
      console.log('Api validation error message:', err.data);
      alert("backend error" + JSON.stringify(err.data));
    }
  };

  if (isLoading) return <Loader></Loader>

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      backgroundColor: "#f4f6f8",
      minHeight: "100vh",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <Paper elevation={4}
        sx={{
          maxWidth: { xs: "95%", sm: "90%", md: 960 },
          width: '100%',
          mb: 4,
          // mx: "auto",
          borderRadius: 3,
          mt: { xs: 2, sm: 4, md: 6 },
          overflow: "hidden",
          background: "White",
          p: { xs: 2, sm: 3, md: 4 },
        }}>
        <Box>
          <Typography variant="h4" className={style.header} >Service Deptartment Master</Typography>
        </Box>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form
            onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} style={{display: 'flex',flexDirection: 'column'}}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth
                  size="small"
                  label='Department Name'
                  {...register('name', { required: "Department Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField  
                  fullWidth
                  size="small"
                  label='Department Type'
                  {...register('type', { required: "Department Type is required" })}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField  
                  fullWidth
                  size="small"
                  label='Department SeqNo'
                  {...register('seqNo', { required: "Department SeqNo is required" })}
                  error={!!errors.seqNo}
                  helperText={errors.seqNo?.message}
                />
              </Grid>
              <Button className={styles.button} type="submit" variant="contained">Save</Button>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
export default ServiceDepartmentMaster;