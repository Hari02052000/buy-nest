import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { LoadingContext } from "../state/GlobalContext";

import { Box, Button, TextField, Alert, FormControl, FormLabel, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik } from "formik";
import * as yup from "yup";

import Header from "../components/global/Header";
import {
  deleteProductImage,
  editProductFormService,
  uploadImagesService,
} from "../services/product.form.service";
import { useFetchData } from "../hooks/useFetchData";

function EditProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [data, error] = useFetchData(`/product/${productId}`);
  const { startLoading, stopLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (data?.data) {
      setProduct(data.data);
    }
  }, [data]);

  const productSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
    price: yup.number("price only number").required("required"),
    brand: yup.string().required("required"),
    model: yup.string().required("required"),
    stock: yup.number().required("required"),
    images: yup
      .mixed()
      .test("fileType", "Only JPG/PNG files are allowed", (files) =>
        files ? files.every((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) : false,
      )
      .test("fileSize", "Image must be less than 5MB", (files) =>
        files ? files.every((file) => file.size <= 5 * 1024 * 1024) : false,
      ),
  });
  const productInitialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    brand: product?.brandName || "",
    model: product?.modelName || "",
    stock: product?.stock || "",
    images: [],
  };
  const deleteImage = async (index) => {
    const image = product.images[index];
    const response = await deleteProductImage(image, productId);
    if (response.data?.product) setProduct(response.data.product);
  };
  const editProductFormSubmit = async (values, formikHelpers) => {
    const { images, ...productData } = values;
    await editProductDetails(productData, formikHelpers);
  };
  const editProductDetails = async (values, { setStatus }) => {
    try {
      const response = await editProductFormService(productId, values);
      if (response.data?.product) {
        setProduct(response.data.product);
        setStatus({ type: "success", message: "updated details" });
      } else {
        setStatus({ type: "error", message: error.response.data.error || "not updated try again" });
      }
    } catch (error) {
      if (error?.response?.data?.error)
        setStatus({ type: "error", message: error.response.data.error || "not updated try again" });
    } finally {
      stopLoading();
    }
  };
  const uploadProductImages = async (values, { setStatus, setFieldValue }) => {
    const formData = new FormData();        
    values.images.forEach((file) => formData.append("images",file));
    try {
      startLoading();
      const response = await uploadImagesService(productId, formData);
      if (response.data?.product) {
        setProduct(response.data.product);
        setFieldValue("images", []);
        setStatus({ type: "success", message: "Images uploaded successfully" });
      }
    } catch (error) {
      setStatus({ type: "error", message: error.response.data.error || "Image upload failed" });
    } finally {
      stopLoading();
    }
  };

  return (
    <Box m="20px">
      <Header title="Edit Product" subtitle="Edit the product details" />
      {product && (
        <Formik
          onSubmit={editProductFormSubmit}
          initialValues={productInitialValues}
          validationSchema={productSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            setFieldValue,
            setStatus,
            handleSubmit,
            status,
          }) => (
            <form onSubmit={handleSubmit}>
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
              {/* image grid */}
              {product.images.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={2} sx={{ marginBottom: "20px" }}>
                  {product.images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => deleteImage(index)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          zIndex: 1,
                          "&:hover": { backgroundColor: "rgba(255,0,0,0.7)" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <img
                        src={image.url}
                        alt={`Preview ${index}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              <FormControl fullWidth sx={{ marginBottom: "20px" }}>
                <FormLabel htmlFor="images">Upload Images</FormLabel>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => {
                    const files = Array.from(event.target.files);
                    setFieldValue("images", files);
                  }}
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
                variant="contained"
                component="div"
                color="info"
                onClick={() => uploadProductImages(values, { setStatus, setFieldValue })}
                sx={{ marginBottom: 1 }}
              >
                Upload Images
              </Button>

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
      )}
    </Box>
  );
}

export default EditProduct;
