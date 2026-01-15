import {useGetOPDScheduleQuery} from '../../features/api/scheduleApi';
import BranchName from '../../Comman/Branch';
import Loader from '../../component/Loader';
import style from '../BillingMaster/RateListMaster.module.css';
import DoctorList from '../../Comman/DoctorList';
import { useMemo, useState } from 'react';
import { Paper, TextField, Typography } from '@mui/material';
import {
  Box,
  Grid,
  Button,
} from '@mui/material'

const DoctorSchedule = () => {
  const [selectedFromDate,setSelectedFromDate] = useState('');
  const [selectedToDate,setSelectedToDate] = useState('');
  const [selectedDoctor,setSelectedDoctor] = useState('');
  const [selectedBranch,setSelectedBranch] = useState('');
  const [selectedScheduleType,setScheduleType] = useState('');
  const [searchText,setSearchText] = useState('');

  const {data:doctorAppointmet,isLoading} = useGetOPDScheduleQuery(
    {fromDate:selectedFromDate, toDate:selectedToDate, doctor:selectedDoctor, branch:selectedBranch, scheduleType:selectedScheduleType},
    {skip : !selectedBranch || !selectedDoctor || !selectedFromDate || !selectedToDate || !selectedScheduleType}
  );

  const fromatDate = (date) => new Date(date).toLocaleDateString('en-GB');

  // normailze appointment
  const doctorList = useMemo(() => {
    if(Array.isArray(doctorAppointmet)) return doctorAppointmet;
    if(Array.isArray(doctorAppointmet?.data)) return doctorAppointmet?.data;
    return [];
  },[doctorAppointmet]);

  // filter appointment
  const filteredAppointments = useMemo(() => {
    if(!selectedBranch || !selectedDoctor || !selectedFromDate || !selectedScheduleType || !selectedToDate) return [];

    const fromDate = new Date(selectedFromDate);
    fromDate.setHours(0,0,0,0);
    const toDate = new Date(selectedToDate);
    toDate.setHours(23,59,59,999);

    return doctorList.filter((appt) => {
      if(!appt.scheduleDate) return false;

      const scheduleDate = new Date(appt.scheduleDate).getTime();
      if(scheduleDate < fromDate || scheduleDate > toDate) return false;
    });
  },[doctorList,selectedBranch,selectedDoctor,selectedFromDate,selectedScheduleType,selectedToDate]);

  if(isLoading) return <Loader/>;

  return (
    <Box sx={{p:{xs:2,md:3}, mt:{xs:4,md:6}}}>
      <Paper>
        <Typography variant='h5' className={style.header} sx={{fontSize:{xs:'1.rem',md:'1.5rem'}}}>Doctor Scheduled</Typography>

        <Box sx={{p:2,backgroundColor:'#f9f9f9', borderRadius:1,mb:2}}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label='Branch Name'
                size='small'
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                InputLabelProps={{shrink:true}}
                fullWidth              >
                  {/* {BranchName.find((b) => b.id === fkBranchId)?.BranchName || fkBranchId} */}
                </TextField>
            </Grid>
            <Grid></Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );



}
export default DoctorSchedule;