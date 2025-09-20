import { Box, Button, TextField, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../components/global/Header";
import { loginFormSubmit } from "../services/auth.service";
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});
const loginInitialValues = {
  email: "",
  password: "",
};

function LoginPage() {
  return (
    <Box
      m="20px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      flexDirection="column"
    >
      <Header title="Login" subtitle="Enter your admin password and mail" />
      <Formik onSubmit={loginFormSubmit} initialValues={loginInitialValues} validationSchema={loginSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, status }) => (
          <form onSubmit={handleSubmit}>
            {status && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {status}
              </Alert>
            )}

            <TextField
              fullWidth
              variant="filled"
              type="email"
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={!!touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="password"
              label="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={!!touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              sx={{ marginBottom: "40px" }}
            />
            <Button type="submit" color="secondary" variant="contained" fullWidth>
              Login
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default LoginPage;
