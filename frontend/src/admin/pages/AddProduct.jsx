import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Alert,
  FormControl,
  FormLabel,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../components/global/Header";
import { addProductFormSubmit } from "../services/product.form.service";
import { useFetchData } from "../hooks/useFetchData";

function AddProduct() {
  const [data, error] = useFetchData("/category");
  const categories = data?.categories || [];
  const [allCategories, setAllCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  useEffect(() => {
    if (categories.length > 0) {
      const flat = flattenCategoriesByLevel(categories);
      setAllCategories(flat);
      const level0 = flat.filter((cat) => cat.level === 0);
      setLevels([level0]);
    }
  }, [categories]);

  const productSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
    price: yup.number("price only number").required("required"),
    categoryPath: yup
      .array()
      .of(
        yup.object({
          id: yup.string().required(),
          name: yup.string().required(),
        }),
      )
      .min(1, "Category is required")
      .test("is-final-category", "Please select the most specific category", function (value) {
        if (!value || value.length === 0) return false;
        const lastSelected = value[value.length - 1];
        const hasChildren = allCategories.some(
          (cat) => cat.level === value.length && cat.path[value.length - 1]?.id === lastSelected.id,
        );
        return !hasChildren;
      }),

    brand: yup.string().required("required"),
    model: yup.string().required("required"),
    stock: yup.number().required("required"),
    images: yup
      .mixed()
      .required("required")
      .test("fileType", "Only JPG/PNG files are allowed", (files) =>
        files ? files.every((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) : false,
      )
      .test("fileSize", "Image must be less than 5MB", (files) =>
        files ? files.every((file) => file.size <= 5 * 1024 * 1024) : false,
      ),
  });
  const productInitialValues = {
    name: "",
    description: "",
    price: "",
    categoryPath: [],
    brand: "",
    model: "",
    stock: "",
    images: [],
  };

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

  const handleCategoryChange = (levelIndex, selectedId, setFieldValue, values) => {
    const newPath = [...values.categoryPath.slice(0, levelIndex)];

    const selectedCategory = levels[levelIndex].find((cat) => cat.id === selectedId);
    if (!selectedCategory) return;

    newPath.push({ id: selectedCategory.id, name: selectedCategory.name });
    setFieldValue("categoryPath", newPath);

    const newLevels = [...levels.slice(0, levelIndex + 1)];

    const nextLevelOptions = allCategories.filter(
      (cat) => cat.level === levelIndex + 1 && cat.path[levelIndex]?.id === selectedId,
    );

    if (nextLevelOptions.length > 0) {
      newLevels.push(nextLevelOptions);
    }

    setLevels(newLevels);
  };
  return (
    <Box m="20px">
      <Header title="Product" subtitle="Enter the product details" />
      <Formik
        onSubmit={addProductFormSubmit}
        initialValues={productInitialValues}
        validationSchema={productSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, status }) => (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {status && (
              <Alert severity={`${status.type == "success" ? "success" : "error"}`} sx={{ mb: 2 }}>
                {status.message}
              </Alert>
            )}
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              name="name"
              error={!!touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product model"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.model}
              name="model"
              error={!!touched.model && !!errors.model}
              helperText={touched.model && errors.model}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product brand"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.brand}
              name="brand"
              error={!!touched.brand && !!errors.brand}
              helperText={touched.brand && errors.brand}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="product description"
              multiline
              rows={5}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              name="description"
              error={!!touched.description && !!errors.description}
              helperText={touched.name && errors.name}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product price"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.price}
              name="price"
              error={!!touched.price && !!errors.price}
              helperText={touched.price && errors.price}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="stock"
              label="product stock"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.stock}
              name="stock"
              error={!!touched.stock && !!errors.stock}
              helperText={touched.stock && errors.stock}
              sx={{ marginBottom: "20px" }}
            />
            {/* category */}
            {levels.length > 0 &&
              levels.map(
                (levelOptions, idx) =>
                  levelOptions.length > 0 && (
                    <FormControl fullWidth sx={{ marginBottom: "20px" }} variant="filled" key={idx}>
                      <FormLabel>{`Category Level ${idx + 1}`}</FormLabel>
                      <Select
                        name={`category_level_${idx}`}
                        value={values.categoryPath[idx]?.id || ""}
                        onChange={(e) => handleCategoryChange(idx, e.target.value, setFieldValue, values)}
                      >
                        {levelOptions.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ),
              )}

            {touched.categoryPath && errors.categoryPath && (
              <Typography color="error" variant="body2">
                {typeof errors.categoryPath === "string" ? errors.categoryPath : errors.categoryPath[0]?.id}
              </Typography>
            )}
            {touched.category && errors.category && (
              <Typography color="error" variant="body2">
                {errors.category}
              </Typography>
            )}
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <FormLabel htmlFor="images">Upload Images</FormLabel>
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files);
                  setFieldValue("images", files);
                }}
                onBlur={handleBlur}
                style={{ marginTop: "8px" }}
              />
              {touched.images && errors.images && (
                <Typography color="error" variant="body2">
                  {errors.images}
                </Typography>
              )}
            </FormControl>
            {values.images && values.images.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Selected files:</Typography>
                <ul>
                  {values.images.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </Box>
            )}
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              fullWidth
              sx={{ marginBottom: "20px" }}
            >
              submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default AddProduct;
