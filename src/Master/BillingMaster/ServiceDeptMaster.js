import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography } from "@mui/material";
import styles from "../../component/Container.module.css";

const ServiceDepartmentMaster = () => {
  const { register, handleSubmit, reset } = useForm();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('serviceDepartments')) || [];
    setServices(stored);
  }, []);

  const onSubmit = (data) => {
    const updated = [...services, data.name];
    localStorage.setItem('serviceDepartments', JSON.stringify(updated));
    setServices(updated);
    reset();
  };

  return (
    <Container className={styles.container}>
      {/* <Box sx={{ width: '100%', maxWidth: 700 }}> */}
        <Typography variant="h4" className={styles.header} sx={{mb:2}}>
          Service Department Master
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField label="Service Name" {...register('name', { required: "Service Department Master" })} sx={{ width:'100%', mt:'2px'}} />
          <Button className={styles.button} variant="contained"  type="submit" sx={{ mt: 2, width:'100%'}}>Add Service</Button>
        </form>
      {/* </Box> */}
    </Container>
  );
};

export default ServiceDepartmentMaster;