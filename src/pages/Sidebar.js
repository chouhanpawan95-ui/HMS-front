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
  PersonAddAlt
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";



const Sidebar = ({ drawerWidth = 260 }) => {
  const location = useLocation();

  useEffect(() => {
    setOpenMenu({
      ui: false,
      icons: false,
      froms: false,
      charts: false,
      tables: false,
    });
  }, [location]);

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
    <Box>

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
                sx={{ ml: 1, color: "#fff" }}
              >
                {openMenu.ui ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItemButton>
          </div>

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

          {/* User Master */}
          <div className="menu-item">
            <ListItemIcon className="menu-icon">
              <PersonAddAlt className="mt-icon-1" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemButton className="menu-text" onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggle("um");
            }}>
              <ListItemText primary="Master" />
              <IconButton
                edge="end"
                size="small"
                sx={{ ml: 1, color: "#fff" }}
              >
                {openMenu.um ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItemButton>
          </div>

          <Collapse in={openMenu.um} timeout="auto" unmountOnExit>
            <List component='div' disablePadding>

              <ListItemButton sx={{ pl: 6 }} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleToggle('ms');
              }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>

                <ListItemText primary='User Master' sx={{ fontSize: 18, color: "#fff" }} />
                <IconButton edge='end' size="small" sx={{ ml: 1, color: "#fff" }}>
                  {openMenu.ms ? <ExpandLess /> : <ExpandMore />}
                </IconButton>

              </ListItemButton>

              <Collapse in={openMenu.ms} timeout='auto' unmountOnExit>
                <List component="div" disablePadding sx={{ fontSize: 18, color: "#fff" }}>
                  <ListItemButton sx={{ pl: 6 }} component={Link} to="/UserMaster" onClick={handleMenuClick}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                    </ListItemIcon>
                    <ListItemText
                      primary="User Master"
                      primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                    />
                  </ListItemButton>

                </List>
              </Collapse>
            </List>
          </Collapse>

          {/* location */}
          <Collapse in={openMenu.um} timeout="auto" unmountOnExit>
            <List component='div' disablePadding>

              <ListItemButton sx={{ pl: 6 }} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleToggle('loc');
              }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ArrowRightIcon sx={{ fontSize: 18, color: "#fff" }} />
                </ListItemIcon>

                <ListItemText primary='Location' sx={{ fontSize: 18, color: "#fff" }} />
                <IconButton edge='end' size="small" sx={{ ml: 1, color: "#fff" }}>
                  {openMenu.loc ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItemButton>

              <Collapse in={openMenu.loc} timeout='auto' unmountOnExit>
                <List component="div" disablePadding>

                  <ListItemButton sx={{ pl: 6 }} component={Link} to="/CountryMaster" onClick={handleMenuClick}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                    </ListItemIcon>
                    <ListItemText
                      primary="Country Master"
                      primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 6 }} component={Link} to="/StateMaster" onClick={handleMenuClick}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                    </ListItemIcon>
                    <ListItemText
                      primary="State Master"
                      primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 6 }} component={Link} to="/DistrictMaster" onClick={handleMenuClick}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                    </ListItemIcon>
                    <ListItemText
                      primary="District Master"
                      primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 6 }} component={Link} to="/CityMaster" onClick={handleMenuClick}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                    </ListItemIcon>
                    <ListItemText
                      primary="City Master"
                      primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Collapse>
          
          {/* Billing */}
          <Collapse in={openMenu.um} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItemButton sx={{pl:6}} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleToggle('bm');
              }}>
                <ListItemIcon sx={{minWidth:30}}>
                  <ArrowRightIcon sx={{fontSize:18, color:'#fff'}}/>
                </ListItemIcon>

                <ListItemText primary='Billing' sx={{ fontSize: 18, color: "#fff" }}/>
                <IconButton edge='end' size="small" sx={{ ml: 1, color: "#fff" }}>
                  {openMenu.bm ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItemButton>

              <Collapse in={openMenu.bm} timeout='auto' unmountOnExit >
              <List component='div' disablePadding>

                <ListItemButton sx={{ pl: 6 }} component={Link} to="/ServiceDeptMaster" onClick={handleMenuClick}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                    </ListItemIcon>
                    <ListItemText
                      primary="Service Dept. Master"
                      primaryTypographyProps={{ fontSize: "0.9rem", color: "#fff" }}
                    />
                  </ListItemButton>

              </List>
              </Collapse>
            </List>
          </Collapse>

        </List>


        {/* Appointment */}
        {/* <div className="menu-item">
        <ListItemIcon className="menu-icon">
          <EventAvailable className="mt-icon-1" sx={{ color: "#fff" }} />
        </ListItemIcon>
        <ListItemButton className="menu-text" onClick={() => handleToggle("charts")}>
          <ListItemText primary="Appointment" />
          {openMenu.charts ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </div> */}

        {/* <Collapse in={openMenu.charts} timeout="auto" unmountOnExit>
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
      </Collapse> */}

        {/* Report */}
        {/* <div className="menu-item">
        <ListItemIcon className="menu-icon">
          <Report className="mt-icon-1" sx={{ color: "#fff" }} />
        </ListItemIcon>
        <ListItemButton className="menu-text" onClick={() => handleToggle("tables")}>
          <ListItemText primary="Report" />
          {openMenu.tables ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </div> */}


        {/* <Collapse in={openMenu.tables} timeout="auto" unmountOnExit>
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
      </Collapse> */}

      </Box >
    </Box >
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
