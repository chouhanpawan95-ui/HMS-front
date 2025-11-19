import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  ExpandLess,
  ExpandMore,
  TableChart as TableIcon,
  BarChart as ChartIcon,
  FormatListBulleted as FormIcon,
  Dashboard as DashboardIcon,
  Widgets as UiIcon,
  ArrowRight as ArrowRightIcon,
  Menu as MenuIcon,
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
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#578ee5",
        color: "#fff",
      }}
    >
      <Divider />

      {/* Menu Section */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List component="nav" sx={{ px: 1, mt: 8 }}>
          {/* Dashboard */}
          <ListItemButton component={Link} to="/Dashboard" onClick={handleMenuClick}>
            <ListItemIcon>
              <HomeIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* Registration */}
          <ListItemButton>
            <ListItemIcon>
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
          </ListItemButton>

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
          <ListItemButton component={Link} to="/Billing" onClick={handleMenuClick}>
            <ListItemIcon>
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
          </ListItemButton>

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
          <ListItemButton onClick={() => handleToggle("forms")}>
            <ListItemIcon>
              <FormIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="User Master" />
            {openMenu.forms ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenu.forms} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 6 }} onClick={handleMenuClick}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Form Elements"
                  primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Appointment */}
          <ListItemButton onClick={() => handleToggle("charts")}>
            <ListItemIcon>
              <ChartIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Appointment" />
            {openMenu.charts ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
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
          <ListItemButton onClick={() => handleToggle("tables")}>
            <ListItemIcon>
              <TableIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Report" />
            {openMenu.tables ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
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
              width: drawerWidth,
              backgroundColor: "#fff",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#fff",
              borderRight: "1px solid #e0e0e0",
              position: "fixed",
              height: "100vh",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
