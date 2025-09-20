import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeContext } from "../../state/GlobalContext";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { axiosInstance } from "../../utills/axios.instance";
import { axiosDeleteAdminFunction } from "../../utills/axios.delete.admin";

async function logout() {
  try {
    await axiosInstance.get("/admin/logout");
    axiosDeleteAdminFunction();
  } catch (error) {
    axiosDeleteAdminFunction();
  }
}

function TopBar() {
  const theme = useTheme();
  const colorMode = useContext(ThemeContext);

  return (
    <Box display={"flex"} justifyContent={"space-between"} p={2}>
      {/* logo */}
      <Box>
        <Typography
          variant="h3"
          component={"div"}
          sx={{
            color: "primery.main",
            textTransform: "uppercase",
            letterSpacing: 2,
            cursor: "pointer",
          }}
        >
          E Commerce
        </Typography>
      </Box>
      {/* links */}
      <Box display={"flex"}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TopBar;
