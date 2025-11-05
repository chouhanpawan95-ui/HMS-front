import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Registration from "./Registration";
import BillTest from "./BillTest";
import Dashboard from "./Dashboard";

export default function Main() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div class="container-fluid page-body-wrapper">    
     <Sidebar />   
        <div class="main-panel">
          <div class="content-wrapper">
            <div class="page-header">
              <h3 class="page-title"> Form elements </h3>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a href="#">Forms</a></li>
                  <li class="breadcrumb-item active" aria-current="page">Form elements</li>
                </ol>
              </nav>
            </div>    
            <Dashboard/>       
            <Registration/>
            <BillTest/>
          </div>      
       
        </div>
   
      </div>
  );
}
