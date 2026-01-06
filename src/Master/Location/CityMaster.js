import { useState} from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography } from "@mui/material";
import styles from "../../component/Container.module.css";
import {useGetCountryQuery,useGetStatesQuery,useGetDistrictsQuery,useGetCitiesQuery,useCreateCityMutation} from '../../features/api/locationApi';
import Loader from "../../component/Loader";

const CityMaster = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const {data:countries} = useGetCountryQuery();

  const [selectedState, setSelectedState] = useState("");
  const {data:states} = useGetStatesQuery(selectedCountry);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const {data:districts} = useGetDistrictsQuery(selectedState);

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
      alert("City added successfully");
    }catch(err){
      console.error("Failed to add city: ", err);
      console.log('Api validation error message:', err.data);
      alert("backend error"+JSON.stringify(err.data));
    }
  };
  if(isLoading) return <Loader></Loader>

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
