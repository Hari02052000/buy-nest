import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/global/Header";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductList() {

  const navigate = useNavigate();
  let [productUrl, setProductUrl] = useState("/product");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allCategories, setAllCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categoryData, categoryError] = useFetchData("/category");
  const [productData, productError] = useFetchData(productUrl);
  const categories = categoryData?.categories || [];
  const products = productData?.products || [];
  useEffect(() => {
    if (categories.length > 0) {
      const flat = flattenCategoriesByLevel(categories);
      setAllCategories(flat);
      const level0 = flat.filter((cat) => cat.level === 0);
      setLevels([level0]);
    }
  }, [categories]);
  const flattenCategoriesByLevel = (categories, level = 0, path = []) => {
    return categories.flatMap((cat) => {
      const currentPath = [...path, { id: cat.id, name: cat.name }];
      const flattened = [{ ...cat, level, path: currentPath }];
      if (cat.children && cat.children.length > 0) {
        return [...flattened, ...flattenCategoriesByLevel(cat.children, level + 1, currentPath)];
      }
      return flattened;
    });
  };
  const handleAddProduct = ()=>{
   navigate(`/admin/add-product`);

  }
  const handleEditProduct = (productId)=>{
    navigate(`/admin/edit-product/${productId}`)
  }
  const handleToggleListStatus = (product)=>{
    console.log(product.isListed);
    
  }
  const handleCategoryChange = (levelIndex, selectedId) => {
    const chosedCategory = levels[levelIndex].find((cat) => cat.id === selectedId);
    if (!chosedCategory) {
      setLevels([allCategories.filter((cat) => cat.level === 0)]);
      setSelectedCategory([]);
      setProductUrl("/product");
      return;
    }
    const newLevels = [...levels.slice(0, levelIndex + 1)];
    const nextLevelOptions = allCategories.filter(
      (cat) => cat.level === levelIndex + 1 && cat.path[levelIndex]?.id === selectedId,
    );
    if (nextLevelOptions.length > 0) {
      newLevels.push(nextLevelOptions);
    }
    setLevels(newLevels);
    const newSelected = [...selectedCategory.slice(0, levelIndex), chosedCategory];
    setSelectedCategory(newSelected);
    setProductUrl(`/product?category=${chosedCategory.id}`);
  };

  return (
    <Box
      sx={{
        padding: 2,
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Products" subtitle="List of products" />
        <Button variant="contained" color="secondary" sx={{ height: "40px" }} onClick={handleAddProduct}>
          Add Product
        </Button>

      </Box>

      {/* Search input */}
      {/* <TextField
        label="Search products"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2, maxWidth: 400 }}
        value={searchText}
        // onchange
      /> */}

      {/* Cascading Category Filters */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", margin: 3 }}>
        {levels.length > 0 &&
          levels.map(
            (levelOptions, idx) =>
              levelOptions.length > 0 && (
                <FormControl sx={{ marginBottom: "20px" }} key={idx} variant="outlined">
                  <InputLabel
                    sx={{
                      color: colors.grey[100],
                      "&.Mui-focused": {
                        color: colors.greenAccent[400],
                      },
                    }}
                  >{`Category Level ${idx + 1}`}</InputLabel>
                  <Select
                    value={selectedCategory[idx]?.id || ""}
                    label={idx === 0 ? "Category" : `Subcategory Level ${idx}`}
                    onChange={(e) => handleCategoryChange(idx, e.target.value)}
                    sx={{
                      color: colors.grey[100],
                      backgroundColor: colors.primary[500],
                      "& .MuiSelect-icon": {
                        color: colors.grey[100],
                      },
                      "& fieldset": {
                        borderColor: colors.grey[300],
                      },
                      "&:hover fieldset": {
                        borderColor: colors.greenAccent[400],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[400],
                      },
                    }}
                  >
                    <MenuItem
                      value=""
                      sx={{
                        color: colors.grey[100],
                        backgroundColor: colors.primary[400],
                      }}
                    >
                      All
                    </MenuItem>
                    {levelOptions.map((cat) => (
                      <MenuItem
                        key={cat.id}
                        value={cat.id}
                        sx={{
                          color: colors.grey[100],
                          backgroundColor: colors.primary[400],
                          "&:hover": {
                            backgroundColor: colors.greenAccent[700],
                          },
                        }}
                      >
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ),
          )}
      </Box>

      {/* Products Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((prod) => {
            const cat = categories.find((c) => c.id === prod.categoryId);
            return (
              <TableRow key={prod.id}>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.category.name}</TableCell>
                <TableCell>{prod.price}</TableCell>
                <TableCell>{prod.stock}</TableCell>
                <TableCell>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, color: colors.grey[100], borderColor: colors.grey[100] }}
              onClick={() => handleEditProduct(prod.id)}
            >
              Edit
            </Button>
            {/* <Button
              variant="contained"
              size="small"
              color={prod.isListed ? "success" : "warning"}
              onClick={() => handleToggleListStatus(prod)}
            >
              {prod.isListed ? "Unlist" : "List"}
            </Button> */}

                </TableCell>
              </TableRow>
            );
          })}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* <TablePagination
        component="div"
      /> */}
    </Box>
  );
}
