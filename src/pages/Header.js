import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
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
import { useGetUserMasterQuery } from "../features/api/usermasterApi";
export default function Header() {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: users, isLoading, error } = useGetUserMasterQuery();
  const loginName = users?.[0]?.LoginName || "U";
  const firstLetter = loginName.charAt(0).toUpperCase();
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
    sessionStorage.clear();
    try {
      // dispatch logout to clear auth token from redux
      const { logout } = require('../features/auth/authSlice');
      dispatch(logout());
    } catch (e) {
      // fallback if import fails at runtime
    }
    handleProfileMenuClose();

    // Make sure the dashboard is not in the browser history after logout
    // so the back button doesn't return to a protected route.
    navigate('/', { replace: true });
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
          backgroundColor: "#578ee5", color: "#fff",
          height: "65px",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          {/* LEFT SECTION */}
          <Box display="flex" alignItems="center" gap={1}>

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

            <Tooltip title="Profile">
              <IconButton onClick={(e) => setAnchorElProfile(e.currentTarget)}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#fff",
                    color: "#578ee5",
                    fontWeight: "bold",
                  }}
                >
                  {firstLetter}
                </Avatar>
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
