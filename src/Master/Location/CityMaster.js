import { useState} from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography } from "@mui/material";
import styles from "../../component/Container.module.css";
import {useGetCountryQuery,useGetStatesQuery,useGetDistrictsQuery,useGetCitiesQuery,useCreateCityMutation} from '../../features/api/locationApi';
import Loader from "../../component/Loader";

const CityMaster = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const {data:countries=[]} = useGetCountryQuery();

  const [selectedState, setSelectedState] = useState("");
  const {data:states=[]} = useGetStatesQuery(selectedCountry);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const {data:districts=[]} = useGetDistrictsQuery(selectedState);

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
          {countries.map((c) => <option key={c._id} value={c._id}>{c.CountryName}</option>)}
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
          {Array.isArray(states) && states.map((s) => (<option key={s._id} value={s._id}>{s.StateName}</option>))}
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
          {Array.isArray(districts) && districts.map((d) => (<option key={d._id} value={d._id}>{d.DistrictName}</option>))}
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
