import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import style from "../BillingMaster/RateListMaster.module.css";
import { useGetCitiesQuery } from "../../features/api/locationApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../../component/Loader";
import {
  useCreatePartyMasterMutation,
  useGetRateListQuery,
} from "../../features/api/billingMasterApi";

const PartyMaster = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [selectedCity, setSelectedCity] = useState("");
  const { data: cityResponse, isLoading: isCityLoading } = useGetCitiesQuery();
  const city = cityResponse?.data ?? [];

  const [selectedRateList, setSelectedRateList] = useState("");
  const { data: rateListResponse, isLoading: isRateListLoading } =
    useGetRateListQuery();
  const rateList = rateListResponse ?? [];
  console.log("RateList Response:", rateListResponse);
  console.log("RateList Data:", rateList);

  const [
    createPartyMaster,
    { isLoading: isPartyMasterLoading, isSuccess, isError, error },
  ] = useCreatePartyMasterMutation();

  const onSubmit = async (data) => {
    try {
      await createPartyMaster({
        PartyName: data.partyname,
        ShortName: data.shortname,
        PartyType: data.partytype,
        StartDate: data.startdate,
        FK_CityId: data.cityname,
        ContactPerson: data.contactperson,
        ContactNoMob: data.contactnomod,
        EmailId: data.emailid,
        FK_RateListId: data.rateListId,
        Remarks: data.remarks,
        FreeDays: data.freedays,
        NoofVisit: data.noofvisit,
      }).unwrap();
    } catch (err) {
      console.error("Error: ", err.data);
    }
  };

  const partyType = [
    "GENERAL",
    "PAT",
    "TAP",
    "PANEL",
    "Insurance",
    "CmbPartyType",
  ];

  const isLoading = isCityLoading || isPartyMasterLoading || isRateListLoading;
  if (isLoading) return <Loader />;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: { xs: "100%", md: 1000 },
          mx: "auto",
          borderRadius: 3,
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "white",
          mt: { xs: 6, sm: 8 },
          overflow: "hidden",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} className={style.header}>
            Party Master
          </Typography>
        </Box>

        <Box p={{ xs:2 ,sm:3 ,md:4 }} >
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Party Name"
                fullWidth
                {...register("partyname", {
                  required: "Party Name is required",
                })}
                error={!!errors.partyname}
                helperText={errors.partyname?.message}
                size='medium'
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Party Type"
                SelectProps={{ native: true }}
                {...register("partytype", {
                  required: "Party Type is required",
                })}
                error={!!errors.partytype}
                helperText={errors.partytype?.message}
              >
                <option value=""></option>
                {partyType.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Short Name"
                fullWidth
                {...register("shortname", {
                  required: "Short Name is required",
                })}
                error={!!errors.shortname}
                helperText={errors.shortname?.message}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={1}>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="date"
                label="Start Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("startdate", {
                  required: "Start Date is required",
                })}
                error={!!errors.startdate}
                helperText={errors.startdate?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="City"
                SelectProps={{ native: true }}
                {...register("cityname", { required: "City is required" })}
                error={!!errors.cityname}
                helperText={errors.cityname?.message}
              >
                <option value=""></option>
                {city.map((c) => (
                  <option key={c.CityId} value={c.CityId}>
                    {c.CityName}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Rate List"
                SelectProps={{ native: true }}
                {...register("rateListId", {
                  required: "Rate List is required",
                })}
                error={!!errors.rateListId}
                helperText={errors.rateListId?.message}
              >
                <option value=""></option>
                {rateList.map((r) => (
                  <option key={r.rateListId} value={r.rateListId}>
                    {r.RateListName}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={1}>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Contact Person"
                fullWidth
                {...register("contactperson", {
                  required: "Contact Person is required",
                })}
                error={!!errors.contactperson}
                helperText={errors.contactperson?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Contact No"
                fullWidth
                type="number"
                {...register("contactno", {
                  required: "Contact No is required",
                })}
                error={!!errors.contactno}
                helperText={errors.contactno?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

          </Grid>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Remarks"
                fullWidth
                {...register("remark", { required: "Remark is required" })}
                error={!!errors.remark}
                helperText={errors.remark?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Free Days"
                fullWidth
                {...register("freedays", { required: "Free Days is required" })}
                error={!!errors.freedays}
                helperText={errors.freedays?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="No of Visits"
                fullWidth
                {...register("noofvisit", {
                  required: "No of Visit is required",
                })}
                error={!!errors.noofvisit}
                helperText={errors.noofvisit?.message}
              />
            </Grid>

            
          </Grid>
          {/* Submit Button */}
            <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ minWidth: 200 }}
              >
                Save
              </Button>
            </Grid>
        </form>
        </Box>
      </Paper>
    </Box>
  );
};
export default PartyMaster;
