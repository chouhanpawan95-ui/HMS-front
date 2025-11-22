import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/Header';
import Sidebar from './pages/Sidebar';
import Registration from './pages/Registration';
import BillTest from './pages/BillTest';
import Dashboard from './pages/Dashboard';
import DoctorList from './Comman/DoctorList';
import BillType from './Comman/BillType';
import CategoryList from './Comman/CategoryList';
import BillingInformation from './pages/BillingInformation';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/BillTest" element={<BillTest />} />

            {/* FIXED: Billinginformation route */}
            <Route
              path="/Billinginformation"
              element={
                <BillingInformation
                  doctorList={DoctorList}
                  billTypeList={BillType}
                  categoryList={CategoryList}
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
