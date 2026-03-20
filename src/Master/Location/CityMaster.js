import { useState,useEffect} from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography,Box,Paper } from "@mui/material";
import styles from "../../component/Container.module.css";
import {useGetCountryQuery,useGetStatesQuery,useGetDistrictsQuery,useGetCitiesQuery,useCreateCityMutation} from '../../features/api/locationApi';
import Loader from "../../component/Loader";
import { useNavigate } from "react-router-dom";
const CityMaster = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const {data:countries} = useGetCountryQuery();
  const navigate = useNavigate();
   const [showSuccess, setShowSuccess] = useState(false); 
  const [selectedState, setSelectedState] = useState("");
  const {data:states} = useGetStatesQuery(selectedCountry);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const {data:districts} = useGetDistrictsQuery(selectedState);
useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate("/layout/CityMaster");
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

  // normaize district data
  const districtList = Array.isArray(districts)
    ? districts
    : Array.isArray(districts?.data)
    ? districts.data
    :[];

  const {data:CityMaster,isLoading,refetch} = useGetCitiesQuery(selectedDistrict);
  const [createCity] = useCreateCityMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async(data) => {
    try{
      await createCity({
        FK_DistrictId:selectedDistrict,
        CityName:data.city
      }).unwrap();
      reset();
      refetch();
      setShowSuccess(true);
    }catch(err){
      console.error("Failed to add city: ", err);
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
      <Typography variant="h4" className={styles.header}>City Master</Typography>

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
          select
          label="Select District"
          SelectProps={{ native: true }}
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          sx={{ width: "100%", mt: 2 }}
        >
          <option value="" disabled></option>
          {Array.isArray(districtList) && districtList.map((d) => (<option key={d.districtId} value={d.districtId}>{d.DistrictName}</option>))}
        </TextField>

        <TextField
          label="City Name"
          sx={{ width: "100%", mt: 2 }}
          {...register("city", { required: "City is required" })}
          error={!!errors.city}
          helperText={errors.city?.message}
        />

        <Button variant="contained" type="submit" sx={{ width: "100%", mt: 2 }}>
          Save
        </Button>
      </form>
    </Container>
  );
};

export default CityMaster;
