import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import styles from "../component/Container.module.css";

const StateMaster = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [locationData, setLocationData] = useState({});
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("locationData")) || {};
    setLocationData(stored);
    setCountries(Object.keys(stored));

    const selCountry = JSON.parse(localStorage.getItem("selectedCountry"))?.country;
    if (selCountry) setSelectedCountry(selCountry);
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const updated = {
      ...locationData,
      [selectedCountry]: [...(locationData[selectedCountry] || []), data.state]
    };

    localStorage.setItem("locationData", JSON.stringify(updated));
    setLocationData(updated);

    alert("State Added!");
    reset();
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.header}>State Master</Typography>

      <div className={styles.form}>
        {/* Select Country Dropdown */}
        <TextField
          select
          fullWidth
          label="Select Country"
          SelectProps={{ native: true }}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          sx={{ mb: 2 }}
        >
          <option value="" disabled>Select...</option>
          {countries.map((country, i) => (
            <option key={i} value={country}>{country}</option>
          ))}
        </TextField>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

          <TextField
            fullWidth
            label="State Name"
            {...register("state", { required: "State Name is required" })}
            error={!!errors.state}
            helperText={errors.state?.message}
          />

          <Button className={styles.button} variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
            Save State
          </Button>
        </form>
      </div>

      {selectedCountry && locationData[selectedCountry]?.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">
            States in {selectedCountry}:
          </Typography>
          <ul>
            {locationData[selectedCountry].map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ul>
        </Box>
      )}
    </Container>
  );
};

export default StateMaster;



