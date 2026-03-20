import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography,Box,Paper } from "@mui/material";
import styles from "../../component/Container.module.css";
import {useGetStatesQuery,useGetDistrictsQuery,useCreateDistrictMutation,useGetCountryQuery} from '../../features/api/locationApi';
import Loader from "../../component/Loader";
import { useNavigate } from "react-router-dom";
const DistrictMaster = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const {data:countries} = useGetCountryQuery();
  console.log("Countries from API:", countries);
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const {data:states} = useGetStatesQuery(selectedCountry);
  console.log("States from API:", states);
  const [showSuccess, setShowSuccess] = useState(false);    
  const{data:districts,isLoading,refetch} = useGetDistrictsQuery(selectedState);
  const [createDistrict] = useCreateDistrictMutation();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate("/layout/DistrictMaster");
      }, 2500); // 2.5 seconds
  
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);
 // normaize country data
  const countryList = Array.isArray(countries)
    ? countries
    : Array.isArray(countries?.data)
    ? countries.data
    :[];

  // normaize state data
  const stateList = Array.isArray(states)
    ? states
    : Array.isArray(states?.data)
    ? states.data
    :[];

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async(data) => {
    try{
      await createDistrict({
        FK_StateId:selectedState,
        DistrictName:data.district
      }).unwrap();
      reset();
      refetch();
      setShowSuccess(true);
    }catch(err){
      console.error("Failed to add district: ", err);
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
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.header}>District Master</Typography>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          select
          label="Select Country"
          SelectProps={{ native: true }}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          sx={{ width: "100%" }}
        >
          <option value="" disabled></option>
          {countryList.map((c) => <option key={c.countryId} value={c.countryId}>{c.CountryName}</option>)}
        </TextField>

        <TextField
          select
          label="Select State"
          SelectProps={{ native: true }}
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          sx={{ width: "100%", mt: 2 }}
        >
          <option value="" disabled></option>
          {Array.isArray(stateList) && stateList.map((s) => (<option key={s.stateId} value={s.stateId}>{s.StateName}</option>))}
        </TextField>

        <TextField
          sx={{ width: "100%", mt: 2 }}
          label="District Name"
          {...register("district", { required: "District is required" })}
          error={!!errors.district}
          helperText={errors.district?.message}
        />

        <Button variant="contained" type="submit" sx={{ width: "100%", mt: 2 }}>
          Save
        </Button>
      </form>
    </Container>
  );
};

export default DistrictMaster;
