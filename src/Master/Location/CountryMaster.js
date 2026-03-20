// src/components/CountryMaster.js
import {
  Container,
  TextField,
  Button,
  Typography,Box,Paper
} from "@mui/material";
import { useForm } from "react-hook-form";
import {useGetCountryQuery, useCreateCountryMutation} from '../../features/api/locationApi';
import styles from "../../component/Container.module.css";
import Loader from "../../component/Loader";
import { useState,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
export default function CountryMaster() {
  const {data:country, isLoading, refetch} = useGetCountryQuery();
  const [createCountry] = useCreateCountryMutation();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

useEffect(() => {
  if (showSuccess) {
    const timer = setTimeout(() => {
      setShowSuccess(false);
      navigate("/layout/CountryMaster");
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }
}, [showSuccess, navigate]);

  const onSubmit = async(formData) => {
    try{
      await createCountry({
        CountryName:formData.name,
        CountryCode:formData.code
      }).unwrap();

      reset();
      refetch();
        setShowSuccess(true);
    }catch(err){
      console.error("Failed to add country: ", err);
      console.log('Api validation error message:', err.data);
      alert("backend error"+JSON.stringify(err.data));
    }
  };

  if(isLoading) return <Loader></Loader>
if (showSuccess) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafc",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#ffffff",
          width: 350,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "8px solid #5C8FD6",   // ✅ Blue circle
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <Typography
            sx={{
              fontSize: 60,
              color: "#5C8FD6",   // ✅ Blue tick
              fontWeight: "bold",
            }}
          >
            ✓
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1F2A44", mb: 1 }}
        >
          Thank you!
        </Typography>

        <Typography variant="body1" sx={{ color: "#555" }}>
          Saved Successfully.
        </Typography>
      </Paper>
    </Box>
  );
}
  return (
    <Container className={styles.container} >
      <Typography variant="h4" className={styles.header} sx={{ mb: 2 }}>
        Country Master
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <TextField className={styles.text}
          label="Country Name"
          {...register("name", { required: "Country Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          // sx={{color:"#578ee5"}}
          focused 
        />
        <TextField
          label="Country Code"
          {...register("code", { required: "Country Code is required" })}
          error={!!errors.code}
          helperText={errors.code?.message}
          sx={{color:"#578ee5"}}
          focused 
        />
        <Button type="submit" variant="contained" className={styles.button}>
          Save
        </Button>
      </form>
    </Container>
  );
}
