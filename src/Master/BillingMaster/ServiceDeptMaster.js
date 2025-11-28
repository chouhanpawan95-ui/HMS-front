import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
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
      <Box sx={{ width: '100%', maxWidth: 700 }}>
        <Typography variant="h4" className={styles.header} sx={{ mb: 2 }}>
          Service Department Master
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField fullWidth label="Service Name" {...register('name', { required: true })} sx={{ mb: 2 }} />
          <Button type="submit" variant="contained">Add Service</Button>
        </form>

        {services.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Existing Services</Typography>
            <ul>
              {services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ServiceDepartmentMaster;