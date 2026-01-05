import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography } from "@mui/material";
import styles from "../../component/Container.module.css";
import {useGetStatesQuery,useGetDistrictsQuery,useCreateDistrictMutation,useGetCountryQuery} from '../../features/api/locationApi';
import Loader from "../../component/Loader";

const DistrictMaster = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const {data:countries} = useGetCountryQuery();
  console.log("Countries from API:", countries);

  const [selectedState, setSelectedState] = useState("");
  const {data:states} = useGetStatesQuery(selectedCountry);
  console.log("States from API:", states);

  const{data:districts,isLoading,refetch} = useGetDistrictsQuery(selectedState);
  const [createDistrict] = useCreateDistrictMutation();

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
    }catch(err){
      console.error("Failed to add district: ", err);
      console.log('Api validation error message:', err.data);
      alert("backend error"+JSON.stringify(err.data));
    }

  };
  if(isLoading) return <Loader></Loader>

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
