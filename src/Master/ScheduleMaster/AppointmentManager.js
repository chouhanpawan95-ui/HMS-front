import {
  Box,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableBody,
  Dialog,
  Button,
  Checkbox,
} from "@mui/material";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import style from "../BillingMaster/RateListMaster.module.css";
import {
  useGetOPDScheduleQuery,
  useGetOPDAppointmentQuery,
  useGetOPDAppointmentBlockDetailQuery,
  useDeleteOPDAppointmentMutation,
  useDeleteOPDAppointmentBlockDetailMutation,
} from "../../features/api/scheduleApi";
import OPDAppointment from "./OPDappointment";
import Loader from "../../component/Loader";
import DoctorList from "../../Comman/DoctorList";
import BlockAppointment from "./BlockAppointment";
import CancelAppointment from "./CancelAppointment";

dayjs.extend(utc);

/* -------------------- Utility -------------------- */
const normalizeDate = (dateValue) => {
  if (!dateValue) return null;
  return dayjs(dateValue).utc().format("YYYY-MM-DD");
};

/* -------------------- Component -------------------- */
const AppointmentManager = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [openAppointment, setOpenAppointment] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openBlock, setOpenBlock] = useState(false);
  const [selectedBlockSlot, setSelectedBlockSlots] = useState(new Set());
  const [openCancel, setOpenCancel] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState(new Set());

  // delete mutations for releasing items
  const [deleteAppointment] = useDeleteOPDAppointmentMutation();
  const [deleteBlockDetail] = useDeleteOPDAppointmentBlockDetailMutation();

  /* -------------------- APIs -------------------- */
  const { data: opdScheduleResponse, isLoading: isScheduleLoading } =
    useGetOPDScheduleQuery();

  const { data: appointmentsResponse, isLoading: isAppointmentLoading } =
    useGetOPDAppointmentQuery(
      { doctorId: selectedDoctor, date: selectedDate },
      { skip: !selectedDoctor || !selectedDate }
    );

  const { data: blockDetailsResponse, isLoading: isBlockDetailsLoading } =
    useGetOPDAppointmentBlockDetailQuery(
      { doctorId: selectedDoctor, date: selectedDate },
      { skip: !selectedDoctor || !selectedDate }
    );

  /* -------------------- Normalize Responses -------------------- */
  const opdSchedules = useMemo(() => {
    if (Array.isArray(opdScheduleResponse)) return opdScheduleResponse;
    if (Array.isArray(opdScheduleResponse?.data))
      return opdScheduleResponse.data;
    return [];
  }, [opdScheduleResponse]);

  const appointmentList = useMemo(() => {
    if (Array.isArray(appointmentsResponse)) return appointmentsResponse;
    if (Array.isArray(appointmentsResponse?.data))
      return appointmentsResponse.data;
    return [];
  }, [appointmentsResponse]);

  const blockedList = useMemo(() => {
    if (Array.isArray(blockDetailsResponse)) return blockDetailsResponse;
    if (Array.isArray(blockDetailsResponse?.data))
      return blockDetailsResponse.data;
    return [];
  }, [blockDetailsResponse]);

  /* -------------------- Filter Appointments -------------------- */
  const appointments = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];

    return appointmentList.filter((appt) => {
      return (
        String(appt.fkConsultantId) === String(selectedDoctor) &&
        normalizeDate(appt.apptDate) === selectedDate
      );
    });
  }, [appointmentList, selectedDoctor, selectedDate]);

  const appointmentByIdMap = useMemo(() => {
    const map = new Map();
    appointmentList.forEach((appt) => {
      map.set(appt.appointmentId, appt);
    });
    return map;
  }, [appointmentList]);

  /* -------------------- Booked Slot Map -------------------- */
  const bookedSlots = useMemo(() => {
    const map = new Map();

    appointments.forEach((appt) => {
      if (!appt?.apptTime || !appt?.apptDate) return;

      const date = normalizeDate(appt.apptDate);

      const parsed = dayjs(
        `${date} ${appt.apptTime}`,
        ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD hh:mm A"],
        true
      );

      if (!parsed.isValid()) return;

      map.set(parsed.format("HH:mm"), appt);
    });

    blockedList.forEach((block) => {
      const date = normalizeDate(block.apptDate);
      if (date !== selectedDate) return;

      const linkedAppointment =
        appointmentByIdMap.get(block.fkCreatedById) || null;

      map.set(block.apptTime, {
        ...block,
        isBlocked: true,
        linkedAppointment,
      });
    });

    return map;
  }, [appointments, blockedList, selectedDate, appointmentByIdMap]);

  /* -------------------- Doctor Schedule -------------------- */
  const availableSchedule = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return null;

    return opdSchedules.find((row) => {
      return (
        String(row.fkDoctorId) === String(selectedDoctor) &&
        row.isActive &&
        normalizeDate(row.scheduleDate) === selectedDate
      );
    });
  }, [opdSchedules, selectedDoctor, selectedDate]);

  /* -------------------- Slot Generator -------------------- */
  const generateSlots = (date, from, to, interval) => {
    const slots = [];
    let start = dayjs(`${date} ${from}`, "YYYY-MM-DD HH:mm");
    const end = dayjs(`${date} ${to}`, "YYYY-MM-DD HH:mm");

    while (start.isBefore(end)) {
      slots.push(start.format("HH:mm"));
      start = start.add(interval, "minute");
    }
    return slots;
  };

  const timeSlots = useMemo(() => {
    if (!availableSchedule) return [];

    return generateSlots(
      selectedDate,
      availableSchedule.fromApptTime,
      availableSchedule.toApptTime,
      availableSchedule.intervalMinuit
    );
  }, [availableSchedule, selectedDate]);

  /* -------------------- UI Helpers -------------------- */
  const isDoctorUnavailable =
    selectedDoctor && selectedDate && !availableSchedule && !isScheduleLoading;

  const closeDialog = () => {
    setOpenAppointment(false);
    setSelectedSlot(null);
  };

  const closeBlock = () => {
    setOpenBlock(false);
    setSelectedBlockSlots(new Set());
  };

  const handleSlotClick = (slot) => {
    const appt = bookedSlots.get(slot);

    // Clicking an empty slot should open the booking dialog
    if (!appt) {
      setSelectedSlot(slot);
      setOpenAppointment(true);
      return;
    }

    // Clicking a booked row does nothing; selection for block/cancel
    // is handled via the row checkboxes.
  };

  /* -------------------- Multiple row -------------------- */

  const toggleAppointmentSelection = (id) => {
    setSelectedAppointments((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const clearSelections = () => {
    setSelectedAppointments(new Set());
  };

  const toggleBlockSlot = (slot) => {
    setSelectedBlockSlots((prev) => {
      const next = new Set(prev);
      next.has(slot) ? next.delete(slot) : next.add(slot);
      return next;
    });
  };

  /* -------------------- Release Selected -------------------- */
  const handleRelease = async () => {
    if (selectedAppointments.size === 0 && selectedBlockSlot.size === 0) return;

    if (!window.confirm("Are you sure you want to release the selected items?"))
      return;

    const failed = [];
    let successCount = 0;

    try {
      // delete selected appointments (includes cancelled & booked)
      for (const selId of selectedAppointments) {
        // try to resolve to a real appointment record to get its DB id
        const appt = appointmentList.find((a) =>
          [
            a._id,
            a.appointmentId,
            String(a._id),
            String(a.appointmentId),
          ].includes(String(selId))
        );

        const idToDelete = appt
          ? appt._id || appt.appointmentId || selId
          : selId;

        try {
          await deleteAppointment({ id: idToDelete }).unwrap();
          successCount++;
        } catch (err) {
          console.error("Failed to delete appointment id", idToDelete, err);
          failed.push({
            type: "appointment",
            id: idToDelete,
            reason: err?.data || err?.message,
          });
        }
      }

      // delete blocks matching selected slots for the selected date & doctor
      for (const slot of selectedBlockSlot) {
        const matches = blockedList.filter((b) => {
          return (
            normalizeDate(b.apptDate) === selectedDate &&
            String(b.apptTime) === String(slot) &&
            String(b.fkDoctorId) === String(selectedDoctor)
          );
        });

        if (matches.length === 0) {
          failed.push({
            type: "block",
            slot,
            reason: "No matching block record found",
          });
          continue;
        }

        for (const b of matches) {
          const id =
            b.id ||
            b._id ||
            b.appointmentBlockDetailId ||
            b.blockId ||
            b.opdAppointmentBlockDetailId;
          if (!id) {
            failed.push({
              type: "block",
              slot,
              reason: "No deletable id on block record",
            });
            continue;
          }

          try {
            await deleteBlockDetail({ id }).unwrap();
            successCount++;
          } catch (err) {
            console.error("Failed to delete block id", id, err);
            failed.push({
              type: "block",
              id,
              slot,
              reason: err?.data || err?.message,
            });
          }
        }
      }

      // report results
      if (failed.length === 0) {
        alert(`Released ${successCount} items successfully`);
      } else {
        alert(
          `Released ${successCount} items, but ${failed.length} failed. Check console for details.`
        );
        console.warn("Release failures:", failed);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to release selected items");
    } finally {
      setSelectedAppointments(new Set());
      setSelectedBlockSlots(new Set());
    }
  };

  /* -------------------- Loading -------------------- */
  if (isScheduleLoading || isAppointmentLoading || isBlockDetailsLoading)
    return <Loader />;

  /* -------------------- Render -------------------- */
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, mt: { xs: 4, md: 6 } }}>
      <Paper>
        <Typography
          variant="h5"
          className={style.header}
          sx={{ fontSize: { xs: "1.1rem", md: "1.5rem" } }}
        >
          Appointment Manager
        </Typography>

        {/* -------------------- Filters -------------------- */}
        <Grid container spacing={2} mt={1} alignItems="center" >
          <Grid item xs={13} sm={7} md={4} >
            <FormControl fullWidth size="small">
              <InputLabel>Doctor Name</InputLabel>
              <Select
                label="Doctor Name"
                value={selectedDoctor}
                fullWidth
                sx={{width:'141px'}}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                {DoctorList.map((d) => (
                  <MenuItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Appointment Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Grid>

          
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              disabled={selectedAppointments.size === 0}
              onClick={() => setOpenCancel(true)}
            >
              Cancel ({selectedAppointments.size})
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              disabled={selectedBlockSlot.size === 0}
              onClick={() => setOpenBlock(true)}
            >
              Block ({selectedBlockSlot.size})
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              disabled={
                selectedAppointments.size === 0 && selectedBlockSlot.size === 0
              }
              onClick={handleRelease}
            >
              Release
            </Button>
          </Grid>
        </Grid>

        {/* -------------------- Table -------------------- */}
        <TableContainer sx={{ mt: 2, width: "100%", overflowX: "auto" }}>
          <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                {[
                  "Select",
                  "Time",
                  "Patient Id",
                  "Patient Name",
                  "Age",
                  "Appt Type",
                  "Contact No",
                  "Referred By",
                  "Remarks",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ backgroundColor: "#578EE5", color: "#fff" }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isDoctorUnavailable && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No Appointment Will Be Scheduled
                  </TableCell>
                </TableRow>
              )}

              {availableSchedule &&
                timeSlots.map((slot) => {
                  const booked = bookedSlots.get(slot);
                  const isBlocked = booked?.isBlocked === true;
                  const isCancelled = booked?.isCancelled === true;
                  const isBooked = !!booked && !isCancelled;
                  const isEmpty = !booked;
                  const isSelectedForBlock = selectedBlockSlot.has(slot);
                  const isSelected = selectedAppointments.has(booked?._id);

                  return (
                    <TableRow
                      key={slot}
                      hover={!booked}
                      onClick={() => {
                        if (booked) return;

                        handleSlotClick(slot);
                      }}
                      sx={{
                        backgroundColor: isBlocked
                          ? "#ffebee"
                          : isSelectedForBlock
                          ? "#abb2ff"
                          : isCancelled
                          ? "#fff3cd"
                          : booked
                          ? "#e8f5e9"
                          : "inherit",
                        cursor: booked ? "not-allowed" : "pointer",
                      }}
                    >
                      <TableCell padding="checkbox">
                        {/* Booked or Cancelled appointments */}
                        {booked && !isBlocked && (
                          <Checkbox
                            checked={isSelected}
                            size="small"
                            onChange={() =>
                              toggleAppointmentSelection(booked._id)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}

                        {/* Blocked slots can be selected for release */}
                        {isBlocked && (
                          <Checkbox
                            checked={isSelectedForBlock}
                            size="small"
                            onChange={() => toggleBlockSlot(slot)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}

                        {/* Empty slots (to select multiple for blocking) */}
                        {isEmpty && !isBlocked && (
                          <Checkbox
                            checked={isSelectedForBlock}
                            size="small"
                            onChange={() => toggleBlockSlot(slot)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: booked ? "bold" : "normal" }}
                      >
                        {slot}
                      </TableCell>
                      <TableCell>{booked?.appointmentId ?? "--"}</TableCell>
                      <TableCell>
                        {booked
                          ? `${booked.firstName} ${booked.lastName}`
                          : "--"}
                      </TableCell>
                      <TableCell>{booked?.ageYear ?? "--"}</TableCell>
                      <TableCell>{booked?.apptType ?? "--"}</TableCell>
                      <TableCell>{booked?.contactNo ?? "--"}</TableCell>
                      <TableCell>{booked?.referredBy ?? "--"}</TableCell>
                      <TableCell>{booked?.remarks ?? "--"}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* -------------------- Dialog -------------------- */}
      <Dialog
        open={openAppointment}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
      >
        <OPDAppointment
          doctorId={selectedDoctor}
          appointmentDate={selectedDate}
          appointmentTime={selectedSlot}
          appointments={appointments}
          onClose={closeDialog}
        />
      </Dialog>
      <Dialog open={openBlock} onClose={closeBlock} maxWidth="md" fullWidth>
        <BlockAppointment
          doctorId={selectedDoctor}
          appointmentDate={selectedDate}
          appointmentTimes={[...selectedBlockSlot]}
          onClose={closeBlock}
          onSuccess={() => {
            setSelectedBlockSlots(new Set());
            setOpenBlock(false);
          }}
        />
      </Dialog>
      <Dialog
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        maxWidth="md"
        fullWidth
      >
        <CancelAppointment
          appointmentIds={[...selectedAppointments]}
          onClose={() => setOpenCancel(false)}
          onSuccess={() => {
            clearSelections();
            setOpenCancel(false);
          }}
        />
      </Dialog>
    </Box>
  );
};

export default AppointmentManager;
