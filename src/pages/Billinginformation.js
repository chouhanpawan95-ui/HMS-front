import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  FormControlLabel,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  Pagination,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Radio, RadioGroup, FormControl } from "@mui/material";
import { useGetPatientsQuery } from "../features/api/patientsApi";
import { useGetRateListQuery} from '../features/api/Hooks/ratelistApi'
import {useGetPartyNameQuery} from '../features/api/Hooks/partyApi.js';
import {useCreateBillMutation,useCreateBilldetailsMutation,useGetBillMasterByIdQuery, useGetBillDetailByBillIdQuery} from '../features/api/Hooks/billingApi.js';
import {useGetServiceQuery} from '../features/api/Hooks/serviceApi';
import SearchBar from "../component/SearchBar.js";
import Loader from "../component/Loader.js";
import DeleteIcon from "@mui/icons-material/Delete";

const BillingInformation = ({ doctorList = [], billTypeList = [], categoryList = [] }) => {
  const routerLocation = useLocation();

  const { bill, patient } = routerLocation.state || {};

  console.log("pawan test", bill?.billId, patient);
  const [firstName, setFirstName] = useState("");
  const [containsOption, setContainsOption] = useState("Contains");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data: patientsResp, isLoading } = useGetPatientsQuery();
  const { data:GetRatelistResponse,  error } = useGetRateListQuery();
  const [createBill, { data: createbilldetails, isLoading: isCreating, error: createBillError }] = useCreateBillMutation();
  const [createBillDetails, { data: createBillDetailsResp, isLoading: isCreatingDetails, error: createBillDetailsError }] = useCreateBilldetailsMutation();
  const { data: services } = useGetServiceQuery();
  const { data: getBillMaster } = useGetBillMasterByIdQuery(bill?.billId);
  const { data: getBillDetail } = useGetBillDetailByBillIdQuery(bill?.billId);
  console.log("getBillMaster", getBillMaster);
  console.log("getBillMaster1", getBillDetail);
  // Utility: resolve service name from various potential sources
  const resolveServiceName = (input) => {
    console.log("input", input)
    if (!input) return "";
    // If input is an object
    if (typeof input === "object") {
      const it = input;
      return (
        it.ServiceName || it.serviceName || it.Service || it.name || it.Description || it.ServiceDesc || ""
      );
    }
    // If input is an id string/number, search known service lists
    const id = String(input);
    // Search services first
    if (Array.isArray(services)) {
      const found = services?.find(
        s => String(s.serviceId || s.FK_ServiceId) === String(rate.FK_ServiceId)
      );
      if (found) return found.ServiceName || found.serviceName || found.name || found.Service || "";
    }
    // Fallback: search rate list details (may contain service names)
    if (Array.isArray(filteredRateListDetails)) {
      const found = filteredRateListDetails?.find((s) => String(s.FK_ServiceId || s.serviceId || s.id || s._id) === id);
      if (found) return found.ServiceName || found.serviceName || found.Service || found.name || "";
    }
    return "";
  };
  console.log("CreateBill response", createbilldetails, "loading", isCreating, "error", createBillError)
  const { data: GetRatedetails } = useGetRateListQuery();
  const { data: partyNameData } = useGetPartyNameQuery();
  // console.log("GetRatedetails",GetRatedetails)
  const [rate, setRate] = useState("");
  const [billDate, setBillDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredPatients, setFilteredPatients] = useState([]);
  // Invoice/Bill No (controlled field)
  const [billNo, setBillNo] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  // Target RateListId
  const [selectedRateListId, setSelectedRateListId] = useState("");
  const [partyName, setPartyName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [billingRemarks, setBillingRemarks] = useState("");
  // First API response (RateList)
  const rateList = GetRatelistResponse?.data || [];

  // Second API response (RateListDetails)
  const rateListDetails = GetRatedetails?.data || [];

  // 2. Filter RateList by rateListId
  const filteredRateList = rateList.filter(
    (item) => item.rateListId === selectedRateListId
  );

  // 3. Filter Details by FK_RateListId
  const filteredRateListDetails = rateListDetails.filter(
    (item) => item.FK_RateListId === selectedRateListId
  );
  // 4. Extract FK_ServiceId from details
  console.log("filteredRateListDetails", filteredRateListDetails);
  const result = filteredRateListDetails.map(rate => {
    const service = services?.find(
      s => s.serviceId === rate.FK_ServiceId
    );

    return {
      ...rate,
      ServiceName: service ? service.ServiceName : null
    };
  });
  const serviceIds = filteredRateListDetails.map((item) => item.FK_ServiceId);
  const [tableRows, setTableRows] = useState([]); // main table rows
  const [isViewMode, setIsViewMode] = useState(false);
  const location = useLocation();
  // useEffect(()=>{
  //   if(bill?.billId){

  //   }
  // },[bill?.billId])
  // Add new row to table
  // Add a row; if `item` provided, populate fields from the service item
  const handleAddRow = (item) => {
    if (isViewMode) return; // don't add rows when viewing an existing bill
    const newRow = item
      ? {
        FK_ServiceId: item.FK_ServiceId || item.FK_ServiceId || item.FK_ServiceId || "",
        ServiceName: item.ServiceName || item.serviceName || resolveServiceName(item.FK_ServiceId) || resolveServiceName(item) || "",
        RateGeneral: item.RateGeneral ?? item.Rate ?? item.RateAmount ?? 0,
        Qty: item.Unit ?? item.UnitQty ?? 1,
        Discountpercent: item.Discountpercent ?? 0,
        Discount: item.Discount ?? 0,
        SCPercent: item.SCPercent ?? 0,
        ServiceCharge: item.ServiceCharge ?? item.ServiceCharges ?? 0,
        Remarks: item.Remarks || item.remark || "",
        ...item,
      }
      : {
        ServiceName: "",
        FK_ServiceId: null,
        RateGeneral: 0,
        Qty: 1,
        NetAmount: 0,
        Remarks: "",
      };
    setTableRows((prev) => [...prev, newRow]);
  };

  // Apply a selected service to an existing row (edit mode)
  const applyServiceToRow = (item, rowIndex) => {
    setTableRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIndex) return r;
        return {
          ...r,
          FK_ServiceId: item.FK_ServiceId || r.FK_ServiceId || "",
          ServiceName: item.ServiceName || item.serviceName || resolveServiceName(item.FK_ServiceId) || r.ServiceName || "",
          RateGeneral: item.RateGeneral || item.Rate || r.RateGeneral || 0,
          Discountpercent: item.Discountpercent ?? r.Discountpercent ?? 0,
          Discount: item.Discount ?? r.Discount ?? 0,
          SCPercent: item.SCPercent ?? r.SCPercent ?? 0,
          ServiceCharge: item.ServiceCharge ?? r.ServiceCharge ?? 0,
          ...item,
        };
      })
    );
    setEditingRowIndex(null);
    setSelectedServices([]);
    setOpenPopup(false);
  };
  //Calculation of service
  const calculateNetFromAmount = (row) => {
    const rate = Number(row.RateGeneral) || 0;
    const qty = Number(row.Qty) || 1;

    const gross = rate * qty;

    let discountPercent = Number(row.Discountpercent) || 0;
    let discountAmount = Number(row.Discount) || 0;

    let scPercent = Number(row.SCPercent) || 0;
    let scAmount = Number(row.ServiceCharge) || 0;

    // ✅ If USER types DISCOUNT AMOUNT → calculate %
    if (discountAmount > 0 && discountPercent === 0) {
      discountPercent = (discountAmount / gross) * 100;
    }
    // ✅ If USER types DISCOUNT % → calculate AMOUNT
    else if (discountPercent > 0 && discountAmount === 0) {
      discountAmount = (gross * discountPercent) / 100;
    }

    const afterDiscount = gross - discountAmount;

    // ✅ If USER types SERVICE CHARGE AMOUNT → calculate %
    if (scAmount > 0 && scPercent === 0) {
      scPercent = (scAmount / afterDiscount) * 100;
    }
    // ✅ If USER types SERVICE CHARGE % → calculate AMOUNT
    else if (scPercent > 0 && scAmount === 0) {
      scAmount = (afterDiscount * scPercent) / 100;
    }

    const netAmount = afterDiscount + scAmount;

    return {
      discountAmount: discountAmount.toFixed(2),
      discountPercent: discountPercent.toFixed(2),
      serviceChargeAmount: scAmount.toFixed(2),
      serviceChargePercent: scPercent.toFixed(2),
      netAmount: netAmount.toFixed(2),
    };
  };

  // Calculate totals from all table rows
  const calculateBillTotals = () => {
    let totalGross = 0;
    let totalDiscount = 0;
    let totalServiceCharge = 0;
    let totalNetAmount = 0;

    tableRows.forEach((row) => {
      const rate = Number(row.RateGeneral) || 0;
      const qty = Number(row.Qty) || 1;
      const gross = rate * qty;

      const result = calculateNetFromAmount(row);

      totalGross += gross;
      totalDiscount += Number(result.discountAmount) || 0;
      totalServiceCharge += Number(result.serviceChargeAmount) || 0;
      totalNetAmount += Number(result.netAmount) || 0;
    });

    return {
      totalGross: totalGross.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalServiceCharge: totalServiceCharge.toFixed(2),
      totalNetAmount: totalNetAmount.toFixed(2),
    };
  };




  // When API loads → set default value automatically
  useEffect(() => {
    if (
      GetRatelistResponse?.data &&
      GetRatelistResponse.data.length > 0
    ) {
      setSelectedRateListId(GetRatelistResponse.data[0].rateListId);
    }
  }, [GetRatelistResponse]);
console.log("CreateRate",GetRatelistResponse?.data);
  // If navigated with a bill in location.state, populate bill and rows
  useEffect(() => {
    const bill = location?.state?.bill;
    const patientFromNav = location?.state?.patient;
    if (patientFromNav) {
      setSelectedPatient(patientFromNav);
    }
    if (bill) {
      console.log('Loading bill from navigation state:', bill);
      setIsViewMode(true);
      setBillDetails((prev) => ({
        ...prev,
        PK_BillId: bill.PK_BillId || bill.billId || bill.id || prev.PK_BillId,
        BillNo: bill.BillNo || bill.billId || prev.BillNo,
        BillDate: bill.BillDate || prev.BillDate,
        FK_RegId: bill.FK_RegId || prev.FK_RegId,
        FK_DoctorId: bill.FK_DoctorId || prev.FK_DoctorId,
        TotalAmt: bill.TotalAmt || bill.TotalAmount || prev.TotalAmt,
        DiscountAmt: bill.DiscountAmt || bill.Discount || prev.DiscountAmt,
        NetBillAmt: bill.NetBillAmt || bill.NetAmt || prev.NetBillAmt,
        Remarks: bill.Remarks || prev.Remarks,
      }));
      const result = getBillDetail?.map(rate => {
        const service = services?.find(
          s => s.serviceId === rate.FK_ServiceId
        );

        return {
          ...rate,
          ServiceName: service ? service.ServiceName : null
        };
      });
      console.log("pawan chouhan",result)
      // map details if present
      const detailsArr = result// bill.BillDetails || bill.details || bill.billDetails || bill.BillDetail || [];
      if (Array.isArray(detailsArr) && detailsArr.length > 0) {
        const mapped = detailsArr.map((d) => ({
          FK_ServiceId: d.FK_ServiceId || d.serviceId || d.FK_ServiceId || "",
          ServiceName: d.ServiceName,
          RateGeneral: d.Rate ?? d.rate ?? 0,
          Qty: d.Unit ?? d.unit ?? 1,
          Discountpercent: 0,
          Discount: d.Discount ?? 0,
          SCPercent: 0,
          ServiceCharge: d.ServiceCharges ?? 0,
          Remarks: d.Remarks || "",
        }));
        setTableRows(mapped);
      }
    }
  }, [location]);
  const handleConfirmYes = async () => {
    setOpenDialog(false);
    let billMasterPayload;
    try {
      const totals = calculateBillTotals();

      // helper to compute FK_RegId
      const computeRegId = () => {
        if (billDetails.FK_RegId && !isNaN(Number(billDetails.FK_RegId))) return Number(billDetails.FK_RegId);
        if (selectedPatient?.PK_RegId && !isNaN(Number(selectedPatient.PK_RegId))) return Number(selectedPatient.PK_RegId);
        if (selectedPatient?.id && !isNaN(Number(selectedPatient.id))) return Number(selectedPatient.id);
        if (selectedPatient?._id && !isNaN(Number(selectedPatient._id))) return Number(selectedPatient._id);
        const pid = selectedPatient?.patientId;
        if (typeof pid === 'string') {
          const m = pid.match(/(\d+)/);
          if (m) return Number(m[1]);
        }
        return 0;
      };

      billMasterPayload = {
        FK_BillingCompanyId: billDetails.FK_BillingCompanyId || 1,
        FK_FinYearId: billDetails.FK_FinYearId || 1,
        FK_BranchId: billDetails.FK_BranchId || 1,
        FK_BillTypeId: billDetails.FK_BillTypeId || 1,
        FK_CategoryId: billDetails.FK_CategoryId || 1,
        FK_BillSerieseId: billDetails.FK_BillSerieseId || 1,
        BillNo: billDetails.BillNo || "",
        BillDate: billDate || billDetails.BillDate || new Date().toISOString(),
        BillTime: billDetails.BillTime || new Date().toISOString().slice(11, 19),
        FK_RegId: selectedPatient?.patientId || "",//computeRegId(),
        FK_IPDId: billDetails.FK_IPDId || 0,
        FK_DoctorId: billDetails.FK_DoctorId || 0,
        FK_DrDeptID: billDetails.FK_DrDeptID || 0,
        FK_ReferredById: billDetails.FK_ReferredById || 0,
        FK_PartyId: billDetails.FK_PartyId || 0,
        IsMLC: billDetails.IsMLC === true ? true : false,
        IsAcademic: billDetails.IsAcademic === true ? true : false,
        AgeYear: billDetails.AgeYear || 0,
        AgeMonth: billDetails.AgeMonth || 0,
        AgeDays: billDetails.AgeDays || 0,
        TotalAmt: Number(totals.totalGross) || 0,
        ServiceChargeAmt: Number(totals.totalServiceCharge) || 0,
        DiscountAmt: Number(totals.totalDiscount) || 0,
        NetBillAmt: Number(totals.totalNetAmount) || 0,
        RateType: billDetails.RateType || "",
        Remarks: billingRemarks || billDetails.Remarks || "",
        Iscancel: billDetails.Iscancel === true ? true : false,
        FK_CreatedById: billDetails.FK_CreatedById || 1,
        FK_CancelledById: billDetails.FK_CancelledById || 0,
        CancelledDateTime: billDetails.CancelledDateTime || null,
        PrintCount: billDetails.PrintCount || 0,
        FreeReason: billDetails.FreeReason || "",
        IsActive: billDetails.IsActive !== false ? true : false,
        PK_SynchId: billDetails.PK_SynchId || "",
        OLDBillID: billDetails.OLDBillID || "",
        OLDBillNo: billDetails.OLDBillNo || "",
        OLDRegID: billDetails.OLDRegID || "",
        ReportDeliveryDateTime: billDetails.ReportDeliveryDateTime || null,
        FK_OrganizerId: billDetails.FK_OrganizerId || 0,
        Tokenno: billDetails.Tokenno || "",
        Cancelreason: billDetails.Cancelreason || "",
        HospitalDiscount: billDetails.HospitalDiscount || 0,
        MOUDiscount: billDetails.MOUDiscount || 0,
        FK_PaytypeID: billDetails.FK_PaytypeID || 0,
        BillRefID: billDetails.BillRefID || 0,
        Diagnosis: billDetails.Diagnosis || "",
      };

      // Remove invalid PK_BillId if present
      if (Object.prototype.hasOwnProperty.call(billMasterPayload, 'PK_BillId')) {
        if (!billMasterPayload.PK_BillId || Number(billMasterPayload.PK_BillId) <= 0) delete billMasterPayload.PK_BillId;
      }

      console.log("Create bill master payload:", billMasterPayload);
      const billMasterResp = await createBill(billMasterPayload).unwrap();
      console.log("Create bill master response:", billMasterResp);

      // extract id from response
      const extractMasterId = (resp) => {
        if (!resp) return null;
        return resp.PK_BillId || resp.pk_billid || resp.billId || resp.id || resp._id || (resp.data && (resp.data.PK_BillId || resp.data.id || resp.data._id));
      };
      const masterId = extractMasterId(billMasterResp);

      // create bill details referring to masterId
      if (masterId && Array.isArray(tableRows) && tableRows.length > 0) {
        const details = tableRows.map((r) => {
          const res = calculateNetFromAmount(r);
          const rate = Number(r.RateGeneral) || Number(r.Rate) || 0;
          const qty = Number(r.Qty) || 1;
          const amount = rate * qty;
          return {
            FK_BillId: String(masterId),
            FK_ServiceId: String(r.FK_ServiceId || ""),
            Rate: rate,
            Unit: qty,
            Amount: amount,
            Discount: Number(res.discountAmount) || Number(r.Discount) || 0,
            ServiceCharges: Number(res.serviceChargeAmount) || Number(r.ServiceCharge) || 0,
            NetAmt: Number(res.netAmount) || 0,
            FK_PackageId: r.FK_PackageId || "",
            IsPerformed: Boolean(r.IsPerformed) || false,
            Remarks: r.Remarks || "",
            Received: Boolean(r.Received) || false,
            FK_BillableServiceTranID: r.FK_BillableServiceTranID || "",
            FK_DoctorID: billDetails.FK_DoctorId ? String(billDetails.FK_DoctorId) : (selectedPatient?.doctorId ? String(selectedPatient.doctorId) : ""),
          };
        });

        try {
          console.log('Submitting bill details (one-by-one) for master id', masterId);
          // Post each detail individually (matches provided /api/billdetails example)
          for (const d of details) {
            console.log('Posting bill detail:', d);
            await createBillDetails(d).unwrap();
          }
          console.log('All bill details submitted successfully');
        } catch (dErr) {
          console.error('Error creating bill details:', dErr);
          alert('✅ Bill created, but failed to create one or more bill details. Check console for details.');
          setSelectedPatient(null);
          return;
        }
      }

      setSelectedPatient(null);
      alert("✅ Bill created successfully!");
    } catch (err) {
      console.error("Error creating bill:", err);
      // Duplicate key / PK_BillId:null retry logic: only on master create
      const errString = JSON.stringify(err || {}).toLowerCase();
      if (errString.includes('duplicate key') || errString.includes('pk_billid')) {
        try {
          const fallbackId = Date.now();
          console.warn('Retrying createBill with fallback PK_BillId:', fallbackId);
          billMasterPayload.PK_BillId = fallbackId;
          const retryResp = await createBill(billMasterPayload).unwrap();
          console.log('Retry create success:', retryResp);
          const masterId = retryResp.PK_BillId || retryResp.id || retryResp._id || (retryResp.data && (retryResp.data.PK_BillId || retryResp.data.id));
          if (masterId && Array.isArray(tableRows) && tableRows.length > 0) {
            const details = tableRows.map((r) => {
              const res = calculateNetFromAmount(r);
              const rate = Number(r.RateGeneral) || Number(r.Rate) || 0;
              const qty = Number(r.Qty) || 1;
              return {
                FK_BillId: String(masterId),
                FK_ServiceId: String(r.FK_ServiceId || ""),
                Rate: rate,
                Unit: qty,
                Amount: rate * qty,
                Discount: Number(res.discountAmount) || 0,
                ServiceCharges: Number(res.serviceChargeAmount) || 0,
                NetAmt: Number(res.netAmount) || 0,
                FK_PackageId: r.FK_PackageId || "",
                IsPerformed: Boolean(r.IsPerformed) || false,
                Remarks: r.Remarks || "",
                Received: Boolean(r.Received) || false,
                FK_BillableServiceTranID: r.FK_BillableServiceTranID || "",
                FK_DoctorID: billDetails.FK_DoctorId ? String(billDetails.FK_DoctorId) : (selectedPatient?.doctorId ? String(selectedPatient.doctorId) : ""),
              };
            });
            try {
              for (const d of details) {
                console.log('Retry posting detail:', d);
                await createBillDetails(d).unwrap();
              }
            } catch (dErr) {
              console.error('Retry details failed:', dErr);
            }
          }
          setSelectedPatient(null);
          alert('✅ Bill created successfully (with fallback PK_BillId)');
          return;
        } catch (err2) {
          console.error('Retry failed:', err2);
        }
      }
      if (err && err.data) console.error("Server error data:", err.data);
      alert("❌ Error creating bill. Check console for details.");
    }
  };
  // useEffect(() => {
  //   createRatelist();   // 🔥 API will run here
  // }, []);
  const handleInputChange = (index, field, value) => {
    setTableRows(prev =>
      prev.map((row, i) => {
        if (i === index) {
          // Create a new mutable object from the row
          const newRow = { ...row };

          // For textual fields keep the string, otherwise parse number
          if (field === "ServiceName" || field === "Remarks" || field === "FK_ServiceId") {
            newRow[field] = value;
          } else {
            newRow[field] = Number(value) || 0;
          }

          // Reset related fields based on which field was changed
          if (field === "Discount" && Number(value) > 0) {
            newRow.Discountpercent = 0; // Reset % when amount is entered
          } else if (field === "Discountpercent" && Number(value) > 0) {
            newRow.Discount = 0; // Reset amount when % is entered
          }

          if (field === "ServiceCharge" && Number(value) > 0) {
            newRow.SCPercent = 0; // Reset % when amount is entered
          } else if (field === "SCPercent" && Number(value) > 0) {
            newRow.ServiceCharge = 0; // Reset amount when % is entered
          }

          return newRow;
        }
        return row;
      })
    );
  };

  useEffect(() => {
    const now = new Date();
    // Format: 2025-01-20T15:30
    const formatted = now.toISOString().slice(0, 16);
    setBillDate(formatted);
  }, []);
  // If user cancels (No)
  const handleConfirmNo = () => {
    setOpenDialog(false);
    setSelectedPatient(null); // Go back to patient list
  };
  // Extract patients safely
  const patients = Array.isArray(patientsResp)
    ? patientsResp
    : patientsResp && Array.isArray(patientsResp.data)
      ? patientsResp.data
      : [];
  const paginatedPatients = filteredPatients.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Initialize with all data when API loads
  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  // 🧠 Auto-search on typing or option change
  useEffect(() => {
    let filtered = [...patients];
    if (firstName.trim() !== "") {
      filtered = filtered.filter((p) => {
        const name = (p.firstName || "").toLowerCase();
        const search = firstName.toLowerCase();
        if (containsOption === "Equals") return name === search;
        if (containsOption === "Starts With") return name.startsWith(search);
        return name.includes(search);
      });
    }
    setFilteredPatients(filtered);
  }, [firstName, containsOption, patients]);

  // 🩺 Handle patient row click
  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
  };

  // 🧾 Go back to patient table
  const handleBack = () => {
    setSelectedPatient(null);
  };

  // 🧾 Submit handler
  const handleSubmit = () => {
    setOpenDialog(true);
    setOpenDialog(true);
  };
  const handleDeleteRow = (index) => {
    setTableRows((prev) => prev.filter((_, i) => i !== index));
  };

  const [rows, setRows] = useState([]);

  // Billing details state (bound to inputs and submitted)
  const [billDetails, setBillDetails] = useState({
    PK_BillId: "",
    FK_BillingCompanyId: "",
    FK_FinYearId: "",
    FK_BranchId: "",
    FK_BillTypeId: "",
    FK_CategoryId: "",
    FK_BillSerieseId: "",
    BillNo: "",
    BillDate: "",
    BillTime: "",
    FK_RegId: "",
    FK_IPDId: "",
    FK_DoctorId: "",
    FK_DrDeptID: "",
    FK_ReferredById: "",
    FK_PartyId: "",
    IsMLC: false,
    IsAcademic: false,
    AgeYear: "",
    AgeMonth: "",
    AgeDays: "",
    TotalAmt: "",
    ServiceChargeAmt: "",
    DiscountAmt: 0,
    NetBillAmt: "",
    RateType: "",
    Remarks: "",
    Iscancel: false,
    FK_CreatedById: "",
    FK_CancelledById: "",
    CancelledDateTime: "",
    PrintCount: 0,
    FreeReason: "",
    IsActive: true,
    PK_SynchId: "",
    OLDBillID: "",
    OLDBillNo: "",
    OLDRegID: "",
    ReportDeliveryDateTime: "",
    FK_OrganizerId: "",
    Tokenno: "",
    Cancelreason: "",
    HospitalDiscount: 0,
    MOUDiscount: 0,
    FK_PaytypeID: "",
    BillRefID: "",
    Diagnosis: "",
  });
  console.log("Billing", billDetails);
  return (
    <Box
      sx={{
        background: "#fff",
        color: "#000",
        p: 2,
        mt: 8,
        minHeight: "100vh",
        ml: { xs: 0, md: 5},
      }}
    >
      {/* =================== PATIENT SEARCH TABLE =================== */}
      {!selectedPatient ? (
        <>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Loader />
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Search For FirstName
              </Typography>

              <SearchBar
                sx={{ mb: "5px" }}
                patients={patients}
                onFilter={setFilteredPatients}
              />
            </>
          )}

          {/* Patient Table */}
          <TableContainer component={Paper} sx={{ mt: 5 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#578EE5" }}>
                  {[
                    "PatientID",
                    "Date",
                    "FirstName",
                    "LastName",
                    "Age",
                    "MobileNo",
                    "DOB",
                    "Address",
                    "OLD MRNO",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : paginatedPatients.length > 0 ? (
                  paginatedPatients.map((p, i) => (
                    <TableRow
                      key={i}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(p)}
                    >
                      <TableCell>{p.patientId}</TableCell>
                      <TableCell>{p.dateTime}</TableCell>
                      <TableCell>{p.firstName}</TableCell>
                      <TableCell>{p.lastName}</TableCell>
                      <TableCell>{p.ageYMD}</TableCell>
                      <TableCell>{p.permanentAddress?.mobileNo}</TableCell>
                      <TableCell>{p.dateOfBirth}</TableCell>
                      <TableCell>{p.permanentAddress?.addressLine}</TableCell>
                      <TableCell>{p.oldNo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        /* =================== BILLING FORM SECTION =================== */
        <Box
          sx={{
            p: 3,
            backgroundColor: "#f8f8f8",
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fdfdfd",
              fontFamily: "Arial",
            }}
          >
            {/* ===== HEADER ===== */}
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "#578EE5",
                fontWeight: "bold",
                p: 1,
                borderRadius: 1,
                color: "#fff",
              }}
            >
              Patient Information
            </Typography>

            {/* ===== PATIENT INFO ===== */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Patient ID"
                  value={selectedPatient?.patientId || ""}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Admission ID"
                  value={selectedPatient?.admissionId || ""}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Patient Name"
                  value={`${selectedPatient?.firstName || ""} ${selectedPatient?.lastName || ""
                    }`}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Age/Sex"
                  value={`${selectedPatient?.ageYMD || ""} / ${selectedPatient?.sex || ""
                    }`}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={12}
                display="flex"
                alignItems="center"
                flexWrap="wrap"
              >
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={
                      selectedPatient?.isWalkIn
                        ? "Walk-In"
                        : selectedPatient?.isAppointment
                          ? "With Appointment"
                          : "Walk-In"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedPatient((prev) => ({
                        ...prev,
                        isWalkIn: value === "Walk-In",
                        isAppointment: value === "With Appointment",
                      }));
                    }}
                  >
                    <FormControlLabel
                      value="Walk-In"
                      control={<Radio />}
                      label="Walk-In"
                    />
                    <FormControlLabel
                      value="With Appointment"
                      control={<Radio />}
                      label="With Appointment"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/* ===== BILLING INFO ===== */}
            <Box mt={3}>
              <Typography
                variant="subtitle1"
                sx={{
                  backgroundColor: "#578EE5",
                  fontWeight: "bold",
                  p: 1,
                  borderRadius: 1,
                  color: "#fff",
                }}
              >
                Billing Information
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Invoice/Bill No"
                    value={billDetails.BillNo || ""}
                    onChange={(e) => setBillDetails((prev) => ({ ...prev, BillNo: e.target.value }))}
                    size="small"
                    disabled={isViewMode}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Bill Date/Time"
                    type="datetime-local"
                    size="small"
                    fullWidth
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    disabled={isViewMode}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Branch"
                    value={billDetails.FK_BranchId || ""}
                    onChange={(e) => setBillDetails((prev) => ({ ...prev, FK_BranchId: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) }))}
                    size="small"
                    fullWidth
                    disabled={isViewMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Fin/Year"
                    value={billDetails.FK_FinYearId || ""}
                    onChange={(e) => setBillDetails((prev) => ({ ...prev, FK_FinYearId: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) }))}
                    size="small"
                    fullWidth
                    disabled={isViewMode}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                ></Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Bill Series"
                    value={billDetails.FK_BillSerieseId || ""}
                    onChange={(e) => setBillDetails((prev) => ({ ...prev, FK_BillSerieseId: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) }))}
                    disabled={isViewMode}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Bill Type entry"
                    value={billDetails.FK_BillTypeId || ""}
                    onChange={(e) => setBillDetails((prev) => ({ ...prev, FK_BillTypeId: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) }))}
                    disabled={isViewMode}
                    sx={{ width: "230px", height: "10px" }}
                  >
                    <MenuItem value="">Bill Type entry</MenuItem>

                    {billTypeList.map((bill) => (
                      <MenuItem key={bill.id} value={bill.id}>
                        {bill.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Select Category"
                    value={billDetails.FK_CategoryId || ""}
                    onChange={(e) => setBillDetails((prev) => ({ ...prev, FK_CategoryId: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) }))}
                    disabled={isViewMode}
                    sx={{ width: "230px", height: "10px" }}
                  >
                    <MenuItem value="">-- Select Category --</MenuItem>

                    {categoryList.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.CategoryName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Select Doctor"
                    value={billDetails.FK_DoctorId || ""}
                    onChange={(e) => setBillDetails((prev) => ({ ...prev, FK_DoctorId: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) }))}
                    disabled={isViewMode}
                    sx={{ width: "230px", height: "10px" }}
                  >
                    <MenuItem value="">-- Select Doctor --</MenuItem>

                    {doctorList.map((doc) => (
                      <MenuItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                ></Grid>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Reffered By"
                      value={billDetails.FK_ReferredById || ""}
                      size="small"
                      fullWidth
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Party"
                      value={billDetails.FK_PartyId || ""}
                      size="small"
                      fullWidth
                      disabled={isViewMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Free discount Reason"
                      // value={`${selectedPatient?.firstName || ""} ${
                      //   selectedPatient?.lastName || ""
                      // }`}
                      size="small"
                      disabled={isViewMode}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                  <TextField
                  select
                  fullWidth
                  label="Rate Type"
                  name="rateListId"              // ✅ REQUIRED for form submit
                  value={selectedRateListId}
                  sx={{ width: "230px" }}

                  onClick={() => {
                    if (selectedRateListId) {
                      setOpenPopup(true);
                    }
                  }}

                  // onChange={(e) => {
                  //   const value = e.target.value;
                  //   console.log("valuepawan",value);
                  //   setSelectedRateListId(value);
                  //        setBillDetails(prev => ({
                  //         ...prev,
                  //         RateType: value
                  //       }));
                  //   setSelectedServices([]);

                  //   if (value) {
                  //     setOpenPopup(true);
                  //   }
                  // }}
                >
                  {GetRatelistResponse?.data?.map((item) => (
                    <MenuItem key={item._id} value={item.rateListId}>
                      {item.RateListName}
                    </MenuItem>
                  ))}
                </TextField>

                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={12}
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                  ></Grid>
                </Grid>
              </Grid>
            </Box>

            {/* ===== SERVICE TABLE ===== */}
            <Box mt={3}>
              <TableContainer component={Paper}>
                <Table size="small">
                  {/* Table Header */}
                  <TableHead sx={{ backgroundColor: "#578EE5" }}>
                    <TableRow>
                      {/* Service ID is intentionally hidden from the UI; FK_ServiceId is kept in row data */}
                      <TableCell sx={{ color: "#fff" }}>Service Name</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Rate</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Qty</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Dis(%)</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Discount</TableCell>
                      <TableCell sx={{ color: "#fff" }}>S.C.(%)</TableCell>
                      <TableCell sx={{ color: "#fff" }}>S.Charge</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Net Amt</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Remarks</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  {/* Table Body */}
                  <TableBody>
                    {/* SHOW ADDED ROWS */}
                    {tableRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                          <Typography>No services added yet.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {tableRows.length > 0 &&
                      tableRows.map((row, index) => {
                        const result = calculateNetFromAmount(row);
                        return (
                          <TableRow key={index}>
                            {/* FK_ServiceId is stored on the row but not shown in the table */}
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.ServiceName !== undefined && row.ServiceName !== null ? row.ServiceName : row.FK_ServiceId || ""}
                                onChange={(e) => handleInputChange(index, "ServiceName", e.target.value)}
                                onClick={() => { if (!isViewMode) { setEditingRowIndex(index); setOpenPopup(true); } }}
                                sx={{ width: 100, cursor: isViewMode ? 'default' : 'pointer' }}
                                disabled={isViewMode}
                              />
                              {/* Service selection is handled via the popup — inline dropdown removed */}
                            </TableCell>
                            {/* ✅ RATE */}
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.RateGeneral || ""}
                                onChange={(e) =>
                                  handleInputChange(index, "RateGeneral", e.target.value)
                                }
                                sx={{ width: 100 }}
                                disabled={isViewMode}
                              />
                            </TableCell>

                            {/* ✅ QTY */}
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.Qty || 1}
                                onChange={(e) =>
                                  handleInputChange(index, "Qty", e.target.value)
                                }
                                disabled={isViewMode}
                              />
                            </TableCell>

                            {/* ✅ DISCOUNT % (EDITABLE) */}
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.Discountpercent !== undefined && row.Discountpercent > 0 ? row.Discountpercent : result.discountPercent}
                                onChange={(e) =>
                                  handleInputChange(index, "Discountpercent", e.target.value)
                                }
                                disabled={isViewMode}
                              />
                            </TableCell>

                            {/* ✅ DISCOUNT AMOUNT (EDITABLE) */}
                            <TableCell>
                              <TextField
                                size="small"
                                value={row.Discount !== undefined && row.Discount > 0 ? row.Discount : result.discountAmount}
                                onChange={(e) =>
                                  handleInputChange(index, "Discount", e.target.value)
                                }
                                disabled={isViewMode}
                              />
                            </TableCell>

                            {/* ✅ SERVICE CHARGE % (EDITABLE) */}
                            <TableCell>
                              <TextField
                                sx={{ width: "80px" }}
                                size="small"
                                value={row.SCPercent !== undefined && row.SCPercent > 0 ? row.SCPercent : result.serviceChargePercent}
                                onChange={(e) =>
                                  handleInputChange(index, "SCPercent", e.target.value)
                                }
                                disabled={isViewMode}
                              />
                            </TableCell>

                            {/* ✅ SERVICE CHARGE AMOUNT (EDITABLE) */}
                            <TableCell>
                              <TextField
                                sx={{ width: "80px" }}
                                size="small"
                                value={row.ServiceCharge !== undefined && row.ServiceCharge > 0 ? row.ServiceCharge : result.serviceChargeAmount}
                                onChange={(e) =>
                                  handleInputChange(index, "ServiceCharge", e.target.value)
                                }
                                disabled={isViewMode}
                              />
                            </TableCell>

                            {/* ✅ NET AMOUNT (AUTO) */}
                            <TableCell>
                              <TextField
                                sx={{ width: "80px" }}
                                size="small"
                                value={result.netAmount}
                                disabled
                              />
                            </TableCell>

                            <TableCell>
                              <TextField
                                size="small"
                                value={row.Remarks || ""}
                                onChange={(e) => handleInputChange(index, "Remarks", e.target.value)}
                                disabled={isViewMode}
                              />
                            </TableCell>

                            {/* ✅ DELETE BUTTON */}
                            <TableCell>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteRow(index)}
                                disabled={isViewMode}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: "8px",
                                  boxShadow: "none",
                                }}
                              >
                                Delete
                              </Button>
                              <TableCell> </TableCell>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>

                </Table>

                {/* Popup */}
                <Dialog open={openPopup} onClose={() => { setOpenPopup(false); setEditingRowIndex(null); }} fullWidth maxWidth="md">
                  <DialogTitle>{editingRowIndex !== null ? 'Choose service to update row' : 'Select Services'}</DialogTitle>
                  <DialogContent>
                    {result?.length ? (
                      console.log("result",result),
                      // Deduplicate by FK_ServiceId so duplicate SRV codes are not shown repeatedly
                      Array.from(new Map((result || []).map(i => [(i.serviceName || i._id || i.id), i])).values()).map((item, idx) => (
                        <div
                          key={item.FK_ServiceId || item._id || item.id || idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '40px 1fr 150px',
                            padding: '8px 0',
                            borderBottom: '1px solid #ddd',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            // toggle checkbox when clicking the row (but not checkbox itself)
                            if (e.target.type !== 'checkbox') {
                              setSelectedServices((prev) => {
                                const isAlreadySelected = prev.some(
                                  (service) => service.FK_ServiceId === item.FK_ServiceId
                                );
                                if (isAlreadySelected) {
                                  return prev.filter(
                                    (service) => service.FK_ServiceId !== item.FK_ServiceId
                                  );
                                } else {
                                  return [...prev, item];
                                }
                              });
                            }
                          }}
                        >
                          <Checkbox
                            checked={selectedServices.some(
                              (service) => service.FK_ServiceId === item.FK_ServiceId
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              setSelectedServices((prev) => {
                                const isAlreadySelected = prev.some(
                                  (service) => service.FK_ServiceId === item.FK_ServiceId
                                );
                                if (isAlreadySelected) {
                                  return prev.filter(
                                    (service) => service.FK_ServiceId !== item.FK_ServiceId
                                  );
                                } else {
                                  return [...prev, item];
                                }
                              });
                            }}
                          />
                          <span>
                            {item.ServiceName || item.serviceName || item.Service || item.name || item.FK_ServiceId}
                            {item.FK_ServiceId && (item.ServiceName || item.serviceName) ? ` (${item.FK_ServiceId})` : ''}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p>No Services Found</p>
                    )}
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={() => { setOpenPopup(false); setSelectedServices([]); setEditingRowIndex(null); }}>Cancel</Button>
                    <Button
                      variant="contained"
                      disabled={selectedServices.length === 0}
                      onClick={() => {
                        if (editingRowIndex !== null) {
                          // apply first selected to the editing row, add remaining as new rows
                          const [first, ...rest] = selectedServices;
                          if (first) applyServiceToRow(first, editingRowIndex);
                          rest.forEach((item) => handleAddRow(item));
                          setSelectedServices([]);
                          setEditingRowIndex(null);
                          setOpenPopup(false);
                        } else {
                          selectedServices.forEach((item) => handleAddRow(item));
                          setSelectedServices([]);
                          setOpenPopup(false);
                        }
                      }}
                    >
                      Apply
                    </Button>
                  </DialogActions>
                </Dialog>
              </TableContainer>
            </Box>
            {/* ===== PARTY & TOTAL ===== */}
            <Grid container spacing={2} mt={3}>
              <TextField
                select
                fullWidth
                label="Party Name"
                onChange={(e) => {
                  const v = e.target.value;
                  setPartyName(v);
                  setBillDetails((prev) => ({ ...prev, FK_PartyId: isNaN(Number(v)) ? v : Number(v) }));
                }}
                sx={{ width: "230px", height: "10px" }}
              >
                {partyNameData?.data?.map((item) => (
                  <MenuItem key={item.FK_CityId} value={item.partyId}>
                    {item.PartyName}
                  </MenuItem>
                ))}
              </TextField>

            </Grid>

            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box sx={{ flex: 1, minWidth: "150px" }}>
                <TextField
                  sx={{ width: 230 }}
                  label="Amount"
                  size="small"
                  fullWidth
                  value={(() => {
                    const totals = calculateBillTotals();
                    const amount = Number(totals.totalNetAmount);
                    if (amount === 100) return 'One Hundred';
                    if (amount === 200) return 'Two Hundred';
                    return amount.toString();
                  })()}
                  disabled
                />
              </Box>
              <Box sx={{ fontSize: 14 }}>
                {(() => {
                  const totals = calculateBillTotals();
                  return (
                    <>
                      <Typography><strong>Total Amount:</strong> {totals.totalGross}</Typography>
                      <Typography><strong>Service Charge:</strong> {totals.totalServiceCharge}</Typography>
                      <Typography><strong>Less Discount:</strong> {totals.totalDiscount}</Typography>
                      <Typography><strong>Net Bill Amount:</strong> {totals.totalNetAmount}</Typography>
                      <Typography><strong>Current Payable:</strong> {totals.totalNetAmount}</Typography>
                    </>
                  );
                })()}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ===== BILLING REMARKS ===== */}
            <TextField label="Billing Remarks" fullWidth size="small" value={billingRemarks} onChange={(e) => setBillingRemarks(e.target.value)} disabled={isViewMode} />

            {/* ===== ACTION BUTTONS ===== */}
            <Box
              mt={3}
              display="flex"
              justifyContent="flex-end"
              gap={2}
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
                sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isViewMode}
                sx={{
                  backgroundColor: "#578EE5",
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
      {/* ✅ CONFIRMATION DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this billing information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo} color="secondary">
            No
          </Button>
          <Button
            onClick={handleConfirmYes}
            color="primary"
            variant="contained"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {/* // pagination */}
      <Box sx={{ display:'flex', justifyContent:'center', mt:2 }}>
        <Pagination
          count = {Math.ceil(filteredPatients.length / rowsPerPage)}
          page = {page}
          onChange={(e,value) => setPage(value)}
          color = 'primary'
        />

      </Box>

    </Box>
  );
};

export default BillingInformation;
