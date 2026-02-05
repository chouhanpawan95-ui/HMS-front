import "./App.css";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import BillTest from "./pages/BillTest";
import Dashboard from "./pages/Dashboard";
import CountryMaster from "./Master/Location/CountryMaster";
import StateMaster from "./Master/Location/StateMaster";
import DoctorList from "./Comman/DoctorList";
import BillType from "./Comman/BillType";
import CategoryList from "./Comman/CategoryList";
import BillingInformation from "./pages/Billinginformation";
import Layout from "./pages/Layout";
import DistrictMaster from "./Master/Location/DistrictMaster";
import AddUsermaster from "./Master/UserManagement/AddUsermaster";
import UserMaster from "./Master/UserManagement/UserMaster";
import UpdateUser from "./Master/UserManagement/UpdateUser";
import ServiceMaster from "./Master/BillingMaster/ServiceMaster";
import CityMaster from "./Master/Location/CityMaster";
import ServiceCatMaster from "./Master/BillingMaster/ServiceCatMaster";
import ServiceDepartmentMaster from "./Master/BillingMaster/ServiceDepartmentMaster";
import RateListMaster from "./Master/BillingMaster/RateListMaster";
import PartyMaster from "./Master/BillingMaster/PartyMaster";
import PackageMaster from "./Master/BillingMaster/PackageMaster";
import OPDSchedule from "./Master/ScheduleMaster/OPDSchedule";
import AppointmentManager from "./Master/ScheduleMaster/AppointmentManager";
import OPDappointment from "./Master/ScheduleMaster/OPDappointment";
import BillReceipt from "./pages/BillReceipt";
import BlockAppointment from "./Master/ScheduleMaster/BlockAppointment";
import AppointmentSchedule from "./Master/ScheduleMaster/AppointmentSchedule";
import DoctorSchedule from "./Master/ScheduleMaster/DoctorSchedule";
import IPDRegistration from "./pages/IPDRegistration";
import Login from "./pages/Login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Registration" element={<Registration />} />
          <Route path="BillTest" element={<BillTest />} />
          <Route path="CountryMaster" element={<CountryMaster />} />
          <Route path="StateMaster" element={<StateMaster />} />
          <Route path="DistrictMaster" element={<DistrictMaster />} />
          <Route path="AddUsermaster" element={<AddUsermaster />} />
          <Route path="UserMaster" element={<UserMaster />} />
          <Route path="UpdateUser/:id" element={<UpdateUser />} />
          <Route path="ServiceMaster" element={<ServiceMaster />} />
          <Route path="CityMaster" element={<CityMaster />} />
          <Route path="ServiceCatMaster" element={<ServiceCatMaster />} />
          <Route path="ServiceDepartmentMaster" element={<ServiceDepartmentMaster />} />
          <Route path="RateListMaster" element={<RateListMaster />} />
          <Route path="RateListMaster/:id" element={<RateListMaster />} />
          <Route path="PartyMaster" element={<PartyMaster />} />
          <Route path="PackageMaster" element={<PackageMaster />} />
          <Route path="PackageMaster/:id" element={<PackageMaster />} />
          <Route path="OPDSchedule" element={<OPDSchedule/>}/>
          <Route path="AppointmentManager" element={<AppointmentManager/>} />
          <Route path="OPDappointment" element={<OPDappointment/>}/>
          <Route path="BlockAppointment" element={<BlockAppointment/>}/>
          <Route path="AppointmentSchedule" element={<AppointmentSchedule/>}/>
          <Route path="DoctorSchedule" element={<DoctorSchedule/>}/>
          <Route path="Billinginformation" element={<BillingInformation doctorList={DoctorList} billTypeList={BillType} categoryList={CategoryList} />} />
          <Route path="BillReceipt" element={<BillReceipt />} />
          <Route path="IPDRegistration/:patientId" element={<IPDRegistration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
