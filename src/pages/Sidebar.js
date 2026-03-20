import React, { useState, useEffect } from "react";
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
import { Link, useLocation } from "react-router-dom";
import {
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  ArrowRight as ArrowRightIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useGetMenuQuery } from "../features/api/authApi";
import {
  Home as HomeIcon,
  AppRegistration,
  PersonAddAlt
} from "@mui/icons-material";
const Sidebar = () => {
  const [menuData, setMenuData] = useState([]);
  const [openMenu, setOpenMenu] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data } = useGetMenuQuery();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const getMenuIcon = (menuName) => {
    switch (menuName) {
      case "Dashboard":
        return <HomeIcon />;
      case "Registration":
        return <AppRegistration />;
      case "Master":
        return <PersonAddAlt />;

    }
  };
  // 🔥 Build Menu Tree
  const buildMenuTree = (data) => {
    return [
      // Dashboard
      data.find((d) => d.MenuGroup === "1"),

      // Registration
      {
        title: "Registration",
        children: data.filter(
          (d) => d.MenuGroup === "2" && d.MenuName !== "Registration"
        ),
      },

      // Master Section
      {
        title: "Master",
        children: [
          {
            title: "User Master",
            children: data.filter(
              (d) => d.MenuGroup === "3" && d.MenuName !== "Master"
            ),
          },
          {
            title: "Location",
            children: data.filter(
              (d) => d.MenuGroup === "4" && d.MenuName !== "Location"
            ),
          },
          {
            title: "Billing",
            children: data.filter(
              (d) => d.MenuGroup === "6" && d.MenuName !== "Billing"
            ),
          },
          {
            title: "Schedule",
            children: data.filter(
              (d) => d.MenuGroup === "7" && d.MenuName !== "Schedule"
            ),
          },
        ],
      },
    ];
  };

  // 🔥 Load API Data
  useEffect(() => {
    if (data?.data) {
      const structuredMenu = buildMenuTree(data.data);
      setMenuData(structuredMenu);
    }
  }, [data]);

  // 🔥 Reset open menu on route change
  useEffect(() => {
    setOpenMenu({});
  }, [location]);

  const handleToggle = (menu) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleMenuClick = () => {
    if (isMobile) setMobileOpen(false);
  };

  // 🔥 Render Menu Recursively
  const renderMenu = (menus, level = 0) => {
    return menus.map((menu, index) => {
      if (!menu) return null;

      return (
        <React.Fragment key={index}>
          <ListItemButton
            sx={{
              pl: isSidebarOpen ? 2 + level * 2 : 1,
              justifyContent: isSidebarOpen ? "initial" : "center",

              // ✅ Transparent so sidebar color visible
              backgroundColor: "transparent",
              color: "#fff",

              // ✅ Hover effect
              "&:hover": {
                backgroundColor: "#3f6fd1", // darker blue
              },
            }}
            component={menu.MenuLink ? Link : "div"}
            to={menu.MenuLink ? `/layout${menu.MenuLink}` : undefined}
            onClick={
              menu.children
                ? () => handleToggle(menu.title)
                : handleMenuClick
            }
          >
            {/* ICON */}
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarOpen ? 2 : "auto",
                justifyContent: "center",
                color: "#fff", // white icons
              }}
            >
              {getMenuIcon(menu.title || menu.MenuName)}
            </ListItemIcon>

            {/* TEXT */}
            {isSidebarOpen && (
              <ListItemText
                primary={menu.title || menu.MenuName}
                sx={{ color: "#fff" }}
              />
            )}

            {/* EXPAND ICON */}
            {menu.children && isSidebarOpen && (
              openMenu[menu.title] ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>

          {/* Children */}
          {menu.children && isSidebarOpen && (
            <Collapse
              in={openMenu[menu.title]}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {renderMenu(menu.children, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const drawerContent = (
    <Box sx={{ mt: 7 }}>
      <List>{renderMenu(menuData)}</List>
    </Box>
  );

  return (
    <>
      {/* Mobile Button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
          }}
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
          sx={{ backgroundColor: "#578EE5" }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: isSidebarOpen ? 260 : 70,
              transition: "0.3s",
              overflowX: "hidden",
              backgroundColor: isSidebarOpen ? "#578EE5" : "#578EE5",
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