import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/Header';
import Sidebar from './pages/Sidebar';
import Registration from './pages/Registration';
import BillTest from './pages/BillTest';
import Dashboard from './pages/Dashboard';
import Billinginformation from './pages/Billinginformation';


function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar />

        {/* Main content area where Routes render */}
        <Box component="main" sx={{ flexGrow: 1 }} className='css-1du1ywb'>
          <Routes>
             {/* <Route path="/" element={<Login />} /> */}
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/BillTest" element={<BillTest />} />
            <Route path="/Billinginformation" element={<Billinginformation />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
