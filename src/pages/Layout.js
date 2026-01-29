import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* HEADER */}
      <Header  />

      {/* SIDEBAR */}
      <Sidebar/>

      {/* MAIN CONTENT AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "10px",
          width: "100%", // always full width
          transition: "all 0.3s ease",
          ml: '50px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
