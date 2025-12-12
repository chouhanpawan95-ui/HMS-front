import { Paper, Typography, Box, TextField, MenuItem } from "@mui/material";
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
  const { data: city = [], isLoading: isCityLoading } = useGetCitiesQuery();

  const [selectedRateList, setSelectedRateList] = useState("");
  const { data: rateList = [], isLoading: isRateListLoading } =
    useGetRateListQuery();

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
        FK_RateListId: data.ratelist,
        Remarks: data.remarks,
        FreeDays: data.freedays,
        NoofVisit: data.noofvisit,
      }).unwrap();
    } catch (err) {
      console.error("Error: ", err.data);
    }
  };

  const partyType = {
    general: "GENERAL",
    pat: "PAT",
    tpa: "TAP",
    panel: "PANEL",
    insurance: "Insurance",
    cmbpartytype: "CmbPartyType",
  };

  const isLoading = isCityLoading || isPartyMasterLoading || isRateListLoading;
  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: "auto", mt: 10 }}>
        <Box>
          <Typography variant="h5" className={style.header}>
            Party Master
          </Typography>
        </Box>

        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Party Name"
            fullWidth
            {...register("partyname", {
              required: "Party Name is required",
            })}
            error={!!errors.partyname}
            helperText={errors.partyname?.message}
          />
          <TextField
            select
            SelectProps={{native:true}}
            label="Party Type"
            fullWidth
            {...register("partytype", {
              required: "Party Type is required",
            })}
            error={!!errors.partytype}
            helperText={errors.partytype?.message}
          >
            {Object.values(partyType).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("startdate", {
              required: "Start Date is required",
            })}
            error={!!errors.startdate}
            helperText={errors.startdate?.message}
          />
          <TextField
            label="Short Name"
            {...register("shortname", {
              required: "Short Name is required",
            })}
            error={!!errors.shortname}
            helperText={errors.shortname?.message}
          />
          <TextField
            select
            label="City Name"
            {...register("cityId", {
              required: "City is required",
            })}
            error={!!errors.cityId}
            helperText={errors.cityId?.message}
          >     
            {/* {city.map((c) => (
              <option key={c.CityId} value={c.CityId}>{ c.CityName }</option>
            ))} */}
          </TextField>
          
          <TextField
            label="Contact Person"
            {...register("contactperson", {
              required: "Contact Person is required",
            })}
            error={!!errors.contactperson}
            helperText={errors.contactperson?.message}
          />
          <TextField
            label="Contact No "
            type="number"
            {...register("contactno", {
              required: "Contact No is required",
            })}
            error={!!errors.contactno}
            helperText={errors.contactno?.message}
          />
          <TextField
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="RateList Id"
            {...register("rateListid", {
              required: "RateList Id is required",
            })}
            error={!!errors.FK_RateListId}
            helperText={errors.FK_RateListId?.message}
          />
          <TextField
            label="Remark"
            {...register("remark", {
              required: "Remark is required",
            })}
            error={!!errors.remark}
            helperText={errors.remark?.message}
          />
          <TextField
            label="Free Days"
            {...register("freedays", {
              required: "Free Days is required",
            })}
            error={!!errors.freedays}
            helperText={errors.freedays?.message}
          />
          <TextField
            label="No of Visit"
            {...register("noofvisit", { required: "No of Visit is required" })}
            error={!!errors.noofvisit}
            helperText={errors.noofvisit?.message}
          />

          <button type="submit" className={style.button}>
            Save
          </button>
        </form>
      </Paper>
    </Box>
  );
};
export default PartyMaster;
