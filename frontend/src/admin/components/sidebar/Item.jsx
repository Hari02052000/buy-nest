import { Link } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import { MenuItem } from "react-pro-sidebar";
import { tokens } from "../../theme";

const Item = ({ title, to, icon, currentPath, exact = false }) => {
  const theme = useTheme();
  const isActive = exact ? currentPath === to : currentPath.startsWith(to);

  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={isActive}
      style={{
        color: colors.grey[100],
      }}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

export default Item;
