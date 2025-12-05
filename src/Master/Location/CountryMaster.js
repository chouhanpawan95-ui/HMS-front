// src/components/CountryMaster.js
import {
  Container,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {useGetCountryQuery, useCreateCountryMutation} from '../../features/api/locationApi';
import styles from "../../component/Container.module.css";
import Loader from "../../component/Loader";

export default function CountryMaster() {
  const {data:country, isLoading, refetch} = useGetCountryQuery();
  const [createCountry] = useCreateCountryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const onSubmit = async(formData) => {
    try{
      await createCountry({
        CountryName:formData.name,
        CountryCode:formData.code
      }).unwrap();

      reset();
      refetch();
    }catch(err){
      console.error("Failed to add country: ", err);
      console.log('Api validation error message:', err.data);
      alert("backend error"+JSON.stringify(err.data));
    }
  };

  if(isLoading) return <Loader></Loader>

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.header} sx={{ mb: 2 }}>
        Country Master
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <TextField className={styles.text}
          label="Country Name"
          {...register("name", { required: "Country Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Country Code"
          {...register("code", { required: "Country Code is required" })}
          error={!!errors.code}
          helperText={errors.code?.message}
        />
        <Button type="submit" variant="contained" className={styles.button}>
          Save
        </Button>
      </form>
    </Container>
  );
}
