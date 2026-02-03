import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme,useMediaQuery } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

const SIDEBAR_COLLAPSED = 40; 

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
          transition: "margin-left 0.20s ease",
          ml: isMobile ? 0 : `${SIDEBAR_COLLAPSED}px`,
        }}
      >
        {/* <Toolbar/> */}
        <Box sx={{p:{xs:1.5,sm:2,md:3}}}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
