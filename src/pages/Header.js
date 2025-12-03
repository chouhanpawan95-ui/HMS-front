import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Divider,
  Tooltip,
  Drawer
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  // PowerSettingsNew as PowerIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  Cached as CachedIcon,
  Logout as LogoutIcon,
  // Dashboard as DashboardIcon,
} from "@mui/icons-material";

export default function Header() {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElMessages, setAnchorElMessages] = useState(null);
  // const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // const openProfile = Boolean(anchorElProfile);
  // const openMessages = Boolean(anchorElMessages);
  // const openNotifications = Boolean(anchorElNotifications);

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
            <IconButton
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
            </IconButton>

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

      {/* MOBILE DRAWER */}
      {/* <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          // "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          '& .MuiDrawer-paper': {
            width: 'auto',     // or any value you want
          },
        }}
      >
        {drawer}
      </Drawer> */}
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
      {/*}

     
      <Menu
        anchorEl={anchorElProfile}
        open={openProfile}
        onClose={() => setAnchorElProfile(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <CachedIcon fontSize="small" sx={{ mr: 1 }} />
          Activity Log
        </MenuItem>
        <Divider />
        <MenuItem>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Sign Out
        </MenuItem>
      </Menu>

      
      <Menu
        anchorEl={anchorElMessages}
        open={openMessages}
        onClose={() => setAnchorElMessages(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Messages
        </Typography>
        <Divider />
        {["face4.jpg", "face2.jpg", "face3.jpg"].map((face, i) => (
          <MenuItem key={i}>
            <Avatar
              src={`/dist/assets/images/faces/${face}`}
              sx={{ width: 35, height: 35, mr: 2 }}
            />
            <Box>
              <Typography variant="body2">New message received</Typography>
              <Typography variant="caption" color="text.secondary">
                {i * 5 + 1} mins ago
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      
      <Menu
        anchorEl={anchorElNotifications}
        open={openNotifications}
        onClose={() => setAnchorElNotifications(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Notifications
        </Typography>
        <Divider />
        <MenuItem>
          <NotificationsIcon color="success" sx={{ mr: 2 }} />
          Event Today
        </MenuItem>
        <MenuItem>
          <SettingsIcon color="warning" sx={{ mr: 2 }} />
          Settings Updated
        </MenuItem>
        <MenuItem>
          <MenuIcon color="info" sx={{ mr: 2 }} />
          Launch Admin
        </MenuItem>
      </Menu> */}
    </>
  );
}
