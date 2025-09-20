import React, { useState } from "react";
import { Box, TableRow, TableCell, IconButton, Button, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

function RenderRow({ data, level = 0 }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [openIds, setOpenIds] = useState(new Set());
  const toggleExpand = (id) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleAddSubcategory = (parentId,name) => {
    navigate(`/admin/add-category/${parentId}`,{
      state : {parentName:name}
    });
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-category/${id}`);
  };

  const handleToggleListStatus = (category) => {
    console.log(`${category.isListed ? "Unlisting" : "Listing"} category: ${category.name}`);
  };

  return data.map((category) => {
    const isOpen = openIds.has(category.id);
    const hasChildren = category.children?.length > 0;

    return (
      <React.Fragment key={category.id}>
        <TableRow
          sx={{
            backgroundColor: colors.primary[400],
          }}
        >
          <TableCell>
            <Box display="flex" alignItems="center" pl={level * 3} gap={1}>
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(category.id)}
                  sx={{ color: colors.greenAccent[500] }}
                >
                  {isOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </IconButton>
              )}
              <img
                src={category?.image?.url}
                alt={category?.name}
                style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
              />
              <Typography color={colors.grey[100]} ml={1}>
                {category.name}
              </Typography>
            </Box>
          </TableCell>
          <TableCell align="right">
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, color: colors.grey[100], borderColor: colors.grey[100] }}
              onClick={() => handleAddSubcategory(category.id,category.name)}
            >
              Add Sub
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, color: colors.grey[100], borderColor: colors.grey[100] }}
              onClick={() => handleEdit(category.id)}
            >
              Edit
            </Button>
            {/* <Button
              variant="contained"
              size="small"
              color={category.isListed ? "success" : "warning"}
              onClick={() => handleToggleListStatus(category)}
            >
              {category.isListed ? "Unlist" : "List"}
            </Button> */}
          </TableCell>
        </TableRow>
        {isOpen && hasChildren && <RenderRow data={category.children} level={level + 1} />}
      </React.Fragment>
    );
  });
}

export default RenderRow;
