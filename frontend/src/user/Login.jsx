import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, clearError } from "../store/slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(formData));    
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          width: { xs: "100%", sm: 700, md: 900 },
          maxWidth: "95vw",
          display: "flex",
          minHeight: 500,
        }}
      >
        {/* Left Side - Image & Tagline */}
        <Box
          sx={{
            flex: 1,
            background:
              "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80) center/cover",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 4,
            minWidth: 350,
          }}
        >
          <Typography variant="h6" color="white" sx={{ mb: 4, fontWeight: 400, textAlign: "center" }}>
            Capturing Moments,
            <br />
            Creating Memories
          </Typography>
        </Box>
        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            background: "#232526",
            color: "white",
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Log in
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ color: "#b39ddb", textDecoration: "underline" }}>
              Sign up
            </Link>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{ style: { background: "#2c2f34", color: "white" } }}
                  InputLabelProps={{ style: { color: "#bdbdbd" } }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Enter your password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{ style: { background: "#2c2f34", color: "white" } }}
                  InputLabelProps={{ style: { color: "#bdbdbd" } }}
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mb: 2, fontWeight: 600, borderRadius: 2, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Log in"}
            </Button>
          </form>

          <Divider sx={{ my: 2, background: "#444" }}>Or log in with</Divider>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{ color: "white", borderColor: "#b39ddb", borderRadius: 2, textTransform: "none" }}
                onClick={()=>window.location.href = "http://localhost:5000/api/v1/auth/google-login"}
              >
                Google
              </Button>
            </Grid>
            {/* <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AppleIcon />}
                sx={{ color: "white", borderColor: "#b39ddb", borderRadius: 2, textTransform: "none" }}
              >
                Apple
              </Button>
            </Grid> */}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
