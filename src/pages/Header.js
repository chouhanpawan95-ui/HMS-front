import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
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
  Drawer,
  Menu,
  MenuItem
} from "@mui/material";
import {
  Search as SearchIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";

export default function Header() {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElMessages, setAnchorElMessages] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  const handleLogout = () => {
    // Clear local storage and update redux auth state
    localStorage.clear();
    try {
      // dispatch logout to clear auth token from redux
      const { logout } = require('../features/auth/authSlice');
      dispatch(logout());
    } catch (e) {
      // fallback if import fails at runtime
    }
    handleProfileMenuClose();
    navigate('/');
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

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchorElProfile}
              open={Boolean(anchorElProfile)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >            
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
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
