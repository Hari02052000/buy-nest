import { Box, Table, TableHead, Typography, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/global/Header";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../hooks/useFetchData";
import RenderRow from "../components/category/RenderRow";

function CategoryList() {
  const [data, error] = useFetchData("/category");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const categories = data?.categories || [];
  const handleAddCategory = () => {
    navigate(`/admin/add-category/`);
  };
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="CATEGORIES" subtitle="List of Categories" />
        <Button variant="contained" color="secondary" sx={{ height: "40px" }} onClick={handleAddCategory}>
          Add Category
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          overflow: "auto",
          "& table": {
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            width: "100%",
          },
          "& .MuiTableCell-root": {
            borderBottom: "none",
          },
          "& .MuiTableHead-root": {
            backgroundColor: colors.blueAccent[700],
            "& th": {
              color: colors.grey[100],
              fontWeight: "bold",
              fontSize: 14,
            },
          },
          "& .MuiTableBody-root": {
            backgroundColor: colors.primary[500],
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography color="textSecondary">No categories found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              <RenderRow data={categories} />
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export default CategoryList;
