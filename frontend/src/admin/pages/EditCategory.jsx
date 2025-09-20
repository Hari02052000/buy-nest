import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, Alert, FormControl, FormLabel, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

import Header from "../components/global/Header";
import {uploadCategoryImage,editCategoryFormService} from "../services/category.service";
import { useFetchData } from "../hooks/useFetchData";

function EditCategory() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [data, error] = useFetchData(`/category/${categoryId}`);
  useEffect(() => {
    if (data?.category) {
      setCategory(data.category);
    }
  }, [data]);

  const categorySchema = yup.object().shape({
    name: yup.string().required("required"),
    image: yup.mixed().nullable().test("fileType", "Only JPG/PNG files are allowed", (file) => {
      if (!file) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    }),
  });
  const categoryInitialValues = {
    name: category?.name || "",
    image: null,
  };
  const editCategoryFormSubmit = async (values, formikHelpers) => {
    const { image, ...categoryData } = values;
    console.log(categoryData);
    
    await editCategoryDetails(categoryData, formikHelpers);
  };
  const editCategoryDetails = async (values, { setStatus }) => {
    setStatus("")        
    if(values.name === category.name){
     setStatus({ type: "error", message : "no updation found" });
     return
    }
    if(!values.name || values.name.trim().length === 0){
      setStatus({ type: "error", message : "plesae provide a name" });
     return
    }
   const response =  await editCategoryFormService(values,categoryId,{setStatus})
   if(response.data?.category) {
    setStatus({ type: "success", message: "category updated" })
    setCategory(response.data.category)
   }
  };
  const uploadEditCategoryImage = async (values, { setStatus, setFieldValue }) => {
    const formData = new FormData();
    formData.append("image", values.image);
    console.log(values);
   const res = await uploadCategoryImage(formData,categoryId) 
   if(res.category) setCategory(res.category)   
  };

  return (
    <Box m="20px">
      <Header title="Edit Category" subtitle="update details" />
      {category && (
        <Formik
          onSubmit={editCategoryFormSubmit}
          initialValues={categoryInitialValues}
          validationSchema={categorySchema}
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
                label="category name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ marginBottom: "20px" }}
              />
              {category.image && (
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={category.image.url}
                    alt={`image of ${category.name}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              )}

              <FormControl fullWidth sx={{ marginBottom: "20px" }}>
                <FormLabel htmlFor="image">Upload Image</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFieldValue("image", file);
                  }}
                />
                {touched.image && errors.image && (
                  <Typography color="error" variant="body2">
                    {errors.image}
                  </Typography>
                )}
              </FormControl>
              {values.image && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected file: {values.image.name}
                </Typography>
              )}
              <Button
                variant="contained"
                component="div"
                color="info"
                onClick={() => uploadEditCategoryImage(values, { setStatus, setFieldValue })}
                sx={{ marginBottom: 1 }}
              >
                Upload Image
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

export default EditCategory;
