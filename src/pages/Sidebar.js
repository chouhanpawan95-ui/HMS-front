import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  ExpandLess,
  ExpandMore,
  AppRegistration,
  ArrowRight as ArrowRightIcon,
  Menu as MenuIcon,
  Payments,
  EventAvailable,
  Report,
  PersonAddAlt
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";


const Sidebar = ({ drawerWidth = 260 }) => {
  const [openMenu, setOpenMenu] = useState({
    ui: false,
    icons: false,
    forms: false,
    charts: false,
    tables: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggle = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleMenuClick = () => {
    if (isMobile) setMobileOpen(false); // Close sidebar on mobile
  };

  const drawerContent = (
    <Box
    // sx={{
    //   display: "flex",
    //   flexDirection: "column",
    //   height: "100%",
    //   backgroundColor: "#578ee5",
    //   color: "#fff",
    // }} id="sidebar-box"
    >
      {/* <Divider /> */}

      {/* Menu Section */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }} >
        <List component="nav" sx={{ px: 1, mt: 8 }} className="sidebar">

          {/* Dashboard */}
          <div className="menu-item">
            <ListItemIcon className="menu-icon">
              <HomeIcon className="mt-icon-1" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemButton className="menu-text" component={Link} to="/Dashboard" onClick={handleMenuClick}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </div>

          {/* Registration */}
          <div className="menu-item">
            <ListItemIcon className="menu-icon">
              <AppRegistration className="mt-icon-1" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemButton className="menu-text" onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggle("ui");
            }}>
              <ListItemText primary="Registration" />
              <IconButton
                edge="end"
                size="small"
                // onClick={(e) => {
                //   e.stopPropagation();
                //   e.preventDefault();
                //   handleToggle("ui");
                // }}
                sx={{ ml: 1, color: "#fff" }}
              >
                {openMenu.ui ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItemButton>
          </div>
          {/* <ListItemButton id="mt-toogle">
            <ListItemIcon id="mt-icon">
              <UiIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Registration" />
            <IconButton
              edge="end"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleToggle("ui");
              }}
              sx={{ ml: 1, color: "#fff" }}
            >
              {openMenu.ui ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItemButton> */}

          <Collapse in={openMenu.ui} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 6 }} component={Link} to="/Registration" onClick={handleMenuClick}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="New Patient"
                  primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                />
              </ListItemButton>

              <ListItemButton sx={{ pl: 6 }} component={Link} to="/Billinginformation" onClick={handleMenuClick}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Old Patient"
                  primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Billing */}
          <div className="menu-item">
            <ListItemIcon className="menu-icon">
              <Payments className="mt-icon-1" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemButton className="menu-text" component={Link} to="/Billing" onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleToggle("icons");
                }}>
              <ListItemText primary="Billing" />
              <IconButton
                edge="end"
                size="small"
                
                sx={{ ml: 1, color: "#fff" }}
              >
                {openMenu.icons ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItemButton>
          </div>
          {/* <ListItemButton id="mt-toogle" component={Link} to="/Billing" onClick={handleMenuClick}>
            <ListItemIcon id="mt-icon">
              <DashboardIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Billing" />
            <IconButton
              edge="end"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleToggle("icons");
              }}
              sx={{ ml: 1, color: "#fff" }}
            >
              {openMenu.icons ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItemButton> */}

          <Collapse in={openMenu.icons} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 6 }} component={Link} to="/" onClick={handleMenuClick}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Billing"
                  primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* User Master */}
          <div className="menu-item">
            <ListItemIcon className="menu-icon">
              <PersonAddAlt className="mt-icon-1" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemButton className="menu-text" onClick={() => handleToggle("forms")}>
              <ListItemText primary="User Master" />
              {openMenu.forms ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </div>
       
          <Collapse in={openMenu.forms} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 6 }} component={Link} to="/CountryMaster" onClick={handleMenuClick}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="CountryMaster"
                  primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Appointment */}
          <div className="menu-item">
            <ListItemIcon className="menu-icon">
              <EventAvailable className="mt-icon-1" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemButton className="menu-text" onClick={() => handleToggle("charts")}>
              <ListItemText primary="Appointment" />
              {openMenu.charts ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </div>

          {/* <ListItemButton id="mt-toogle" onClick={() => handleToggle("charts")}>
            <ListItemIcon id="mt-icon">
              <ChartIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Appointment" />
            {openMenu.charts ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton> */}
          <Collapse in={openMenu.charts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 6 }} onClick={handleMenuClick}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="ChartJs"
                  primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Report */}
          <div className="menu-item">
            <ListItemIcon className="menu-icon">
              <Report className="mt-icon-1" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemButton className="menu-text" onClick={() => handleToggle("tables")}>
              <ListItemText primary="Report" />
              {openMenu.tables ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </div>

          {/* <ListItemButton id="mt-toogle" onClick={() => handleToggle("tables")}>
            <ListItemIcon id="mt-icon">
              <TableIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Report" />
            {openMenu.tables ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton> */}
          <Collapse in={openMenu.tables} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 6 }} onClick={handleMenuClick}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Basic Table"
                  primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ m: 1, position: "fixed", top: 10, left: 10, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 'auto',
              backgroundColor: "#fff",
              boxSizing: "border-box",
            },
          }}
          PaperProps={{ sx: { boxShadow: 'none' } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 'auto',
              boxSizing: "border-box",
              backgroundColor: "#fff",
              borderRight: "1px solid #e0e0e0",
              position: "fixed",
              height: "100vh",
            },
          }}
          PaperProps={{ sx: { boxShadow: 'none', minWidth: 0 } }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
