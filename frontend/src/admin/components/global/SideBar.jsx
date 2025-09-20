import { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Sidebar as ProSidebar, Menu, MenuItem, sidebarClasses, menuClasses } from "react-pro-sidebar";
import { useLocation } from "react-router-dom";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useContext } from "react";

import { AdminContext, ThemeContext } from "../../state/GlobalContext";
import { tokens } from "../../theme";
import Item from "../sidebar/Item";

function SideBar() {
  const theme = useTheme();
  const { admin } = useContext(AdminContext);
  const location = useLocation();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <ProSidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: colors.primary[400],
        },
        [`.${menuClasses.icon}`]: {
          backgroundColor: "transparent !important",
        },
        [`.${menuClasses.button}`]: {
          padding: "5px 35px 5px 20px !important",
          color: colors.grey[100],
          backgroundColor: "transparent !important",
          "&:hover": {
            color: "#868dfb !important",
          },
          "&.ps-active": {
            color: "#6870fa !important",
          },
        },
      }}
      collapsed={isCollapsed}
    >
      <Menu iconShape="square">
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.grey[100],
          }}
        >
          {!isCollapsed && (
            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
              <Typography variant="h3" color={colors.grey[100]}>
                ADMINIS
              </Typography>
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                <MenuOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>
        {!isCollapsed && (
          <Box mb="25px">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                alt="profile-user"
                width="100px"
                height="100px"
                src={admin.profile}
                style={{ cursor: "pointer", borderRadius: "50%" }}
              />
            </Box>
            <Box textAlign="center">
              <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                {admin.name}
              </Typography>
              <Typography variant="h5" color={colors.greenAccent[500]}>
                {admin.email}
              </Typography>
            </Box>
          </Box>
        )}
        <Box paddingLeft={isCollapsed ? undefined : "10%"}>
          <Item
            title="Dashboard"
            to="/admin"
            icon={<HomeOutlinedIcon />}
            currentPath={location.pathname}
            exact={true}
          />
          <Item
            title="Categories"
            to="/admin/categories"
            icon={<CategoryIcon />}
            currentPath={location.pathname}
          />
          <Item
            title="products"
            to="/admin/products"
            icon={<InventoryIcon />}
            currentPath={location.pathname}
          />
          <Item
            title="orders"
            to="/admin/orders"
            icon={<FactCheckIcon />}
            currentPath={location.pathname}
          />
        </Box>
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
