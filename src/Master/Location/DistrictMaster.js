import { useEffect, useState } from "react";
import styles from "../../component/Container.module.css"
import { useForm } from "react-hook-form";
import { Button, Container, TextField, Typography } from "@mui/material";

const DistrictMaster = () =>{
  const[selectedCountry,setSelectedCountry] = useState('');
  const[selectState,setSelectedState] = useState('');
  const[countries,setCountries] = useState([]);
  const[states,setStates] = useState([]);
  const[locationData,setLocationData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('locationData')) || {};
    setLocationData(stored);
    setCountries(Object.keys(stored));

    const selCountry = JSON.parse(localStorage.getItem('selectedCountry'))?.country;
    if(selCountry) setSelectedCountry(selCountry);

    const selState = JSON.parse(localStorage.getItem('loactionData'))?.state;
    if(selState) setSelectedState(selState);

  }, []);

  // Update states when selected country changes
  useEffect(() => {
    if(selectedCountry && locationData[selectedCountry]) {
      setStates(locationData[selectedCountry]);
    } else {
      setStates([]);
    }
  }, [selectedCountry, locationData]);

  const { register, handleSubmit, reset, formState:{ errors } } = useForm();

  const onSubmit = (formData) =>{
    const updated = {
      ...locationData,
      [selectedCountry]:[...(locationData[selectedCountry] || []),formData.district],

      [selectState]:[...(locationData[selectState] || []),formData.district]
    };

    localStorage.setItem("locationData",JSON.stringify(updated));
    setLocationData(updated);

    alert("District Added");
    reset();
  };

  return(
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.header}>Distric Master</Typography>

      <div className={styles.form}>
        {/* Select Country Dropdown */}
        <TextField select fullWidth label="Select Country" SelectProps={{native:true}} value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} sx={{ mb:2 }}>
          <option value="" disabled>Select ..</option>
          {countries.map((country,i) =>(
            <option key={i} value={country}>{ country }</option>
          ))}
        </TextField>

        {/* Select State Dropdown */}
        <TextField select fullWidth label="Select State" SelectProps={{ native:true }} value={selectState} onChange={(e) => setSelectedState(e.target.value)} sx={{ mb:2 }}>
          <option value='' disabled>Select ...</option>
          {states.map((state,i) =>(
            <option key={i} value={state}>{state}</option>
          ))}
        </TextField>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label='District Name' {...register("district",{required:'District name is required'})} error={!!errors.district} helperText={errors.state?.message}/>

          <Button className={styles.button} variant="contained" fullWidth type="submit" sx={{ mt:2 }}>Save</Button>
        </form>
      </div>     
      
    </Container>
  )

  

}
export default DistrictMaster;