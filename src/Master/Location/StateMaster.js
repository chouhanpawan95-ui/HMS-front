import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Typography } from "@mui/material";
import styles from "../../component/Container.module.css";
import {
  useGetStatesQuery,
  useCreateStateMutation,
  useGetCountryQuery,
} from "../../features/api/locationApi";
import Loader from "../../component/Loader";

const StateMaster = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countries = [] } = useGetCountryQuery();

  const { data: state, isLoading, refetch } = useGetStatesQuery(selectedCountry);
  const [createState] = useCreateStateMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createState({
        FK_CountryId:selectedCountry,
        StateName: data.state,
      }).unwrap();

      reset();
      refetch();
    } catch (err) {
      console.error("Failed to add state: ", err);
      console.log("Api validation error message:", err.data);
      alert("backend error" + JSON.stringify(err.data));
    }
  };
  if (isLoading) return <Loader></Loader>;

  return (
    <Container className={styles.container}>
      <Typography variant="h4" className={styles.header}>
        State Master
      </Typography>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          select
          label="Select Country"
          SelectProps={{ native: true }}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          sx={{ width: "100%" }}
        >
          <option value="" disabled>
            Select Country
          </option>

          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.CountryName}
            </option>
          ))}
        </TextField>

        <TextField
          label="State Name"
          sx={{ width: "100%", mt: 2 }}
          {...register("state", { required: "State is required" })}
          error={!!errors.state}
          helperText={errors.state?.message}
        />

        <Button variant="contained" type="submit" sx={{ width: "100%", mt: 2 }}>
          Save
        </Button>
      </form>
    </Container>
  );
};

export default StateMaster;
