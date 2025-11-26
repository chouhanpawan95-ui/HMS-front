import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import styles from "../component/Container.module.css";

const CountryMaster = () => {
  const [locationData, setLocationData] = useState({});

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("locationData")) || {};
    setLocationData(storedData);
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const updated = {
      ...locationData,
      [data.country]: locationData[data.country] || []
    };

    localStorage.setItem("locationData", JSON.stringify(updated));
    localStorage.setItem("selectedCountry", JSON.stringify(data));

    setLocationData(updated);
    alert("Country Saved!");
    reset();
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.header}>Country Master</Typography>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        
        <TextField
          fullWidth
          label="Country Name"
          {...register("country", { required: "Country Name is required" })}
          error={!!errors.country}
          helperText={errors.country?.message}
        />

        <TextField
          fullWidth
          label="Country Code"
          type="number"
          {...register("countryCode", { required: "Country Code is required" })}
          error={!!errors.countryCode}
          helperText={errors.countryCode?.message}
          sx={{ mt: 2 }}
        />

        <Button className={styles.button} variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
          Save Country
        </Button>
      </form>

      <Box mt={4}>
        <Typography variant="h6">Saved Countries:</Typography>
        <ul>
          {Object.keys(locationData).map((country, i) => (
            <li key={i}><strong>{country}</strong></li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default CountryMaster;


