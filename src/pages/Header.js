import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Avatar,
  Badge,
  Tooltip,
  Drawer
} from "@mui/material";
import {
  Search as SearchIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
} from "@mui/icons-material";

export default function Header() {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElMessages, setAnchorElMessages] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar Drawer for Mobile
  const drawer = (
    <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
     </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#578ee5", color: "#fff"
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          {/* LEFT SECTION */}
          <Box display="flex" alignItems="center" gap={1}>
           {/* MENU ICON FOR MOBILE */}
           {/* <IconButton color="inherit" edge='start' sx={{display:{xs:'flex', lg:'none'}}}>
            <MenuIcon/>
           </IconButton> */}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#ecebf5ff",
                display: { xs: "none", sm: "block" },
              }}
            >
              BUILDICON
            </Typography>
          </Box>

          {/* SEARCH FIELD */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              px: 1.5,
              width: "40%",
              maxWidth: 400,
            }}
          >
            <SearchIcon color="action" />
            <InputBase
              placeholder="Search projects..."
              sx={{ ml: 1, flex: 1 }}
            />
          </Box>

          {/* RIGHT SECTION */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* <IconButton
              color="inherit"
            >
              <Badge color="warning" variant="dot">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
            >
              <Badge color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton color="inherit" sx={{ display: { xs: "none", sm: "flex" } }}>
              <FullscreenIcon />
            </IconButton>

            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton> */}

            <Tooltip title="Profile">
              <IconButton onClick={(e) => setAnchorElProfile(e.currentTarget)}>
                <Avatar
                  src="/dist/assets/images/faces/face1.jpg"
                  alt="Profile"
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

       <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "auto !important",   // FORCE override
            maxWidth: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
     
    </>
  );
}
