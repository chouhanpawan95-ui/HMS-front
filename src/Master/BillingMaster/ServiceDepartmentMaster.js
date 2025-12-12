import { Button, Container, TextField, Typography } from "@mui/material";
import styles from "../../component/Container.module.css";
import {useGetServiceDepartmentMasterQuery,useCreateServiceDepartmentMasterMutation} from '../../features/api/billingMasterApi';
import Loader from "../../component/Loader";
import { useForm } from "react-hook-form";


const ServiceDepartmentMaster =() =>{
  const{data:serviceDepartmentMaster,isLoading,refetch} = useGetServiceDepartmentMasterQuery();
  console.log("Service Department Master Data:", serviceDepartmentMaster);
  const[createServiceDepartmentMaster] = useCreateServiceDepartmentMasterMutation();
  console.log("Create Service Department Master Mutation:", createServiceDepartmentMaster);

  const{
    register,
    handleSubmit,
    reset,
    formState:{errors},
  } = useForm();

  const onSubmit = async(formData) => {
    try{
      await createServiceDepartmentMaster({
        DeptName:formData.name,
        DeptType:formData.type,
        SeqNo:formData.seqNo
      }).unwrap();
      reset();
      refetch();
    }catch(err){
      console.error("Failed to add department: ", err);
      console.log('Api validation error message:', err.data);
      alert("backend error"+JSON.stringify(err.data));
    }
  };

  if(isLoading) return <Loader></Loader>

  return(
    <Container className={styles.container}>
      
      <Typography variant="h4" className={styles.header} sx={{mb:2}}>Service Deptartment Master</Typography>

      <form 
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}>
        <TextField className={styles.text}
        label='Department Name'
        {...register ('name',{required:"Department Name is required"})}
        error={!!errors.name}
        helperText={errors.name?.message}
        />
        <TextField className={styles.text}
        label='Department Type'
        {...register ('type',{required:"Department Type is required"})}
        error={!!errors.type}
        helperText={errors.type?.message}
        />
        <TextField className={styles.text}
        label='Department SeqNo'
        {...register ('seqNo',{required:"Department SeqNo is required"})}
        error={!!errors.seqNo}
        helperText={errors.seqNo?.message}
        />

        <Button className={styles.button} type="submit" variant="contained">Save</Button>

      </form>

    </Container>
  );
}
export default ServiceDepartmentMaster;