import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Avatar,
  Button,
  Divider,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";

const ProfilePage = () => {
  const { user, wishlist } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSection, setEditSection] = useState("");
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [profileImage, setProfileImage] = useState(user?.profile || "");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // If no user is logged in, show login prompt
  if (!user) {
    return (
      <>
        <Box
          sx={{
            background: "#f4f6fa",
            minHeight: "100vh",
            py: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Please log in to view your account
            </Typography>
            <Button variant="contained" href="/login">
              Go to Login
            </Button>
          </Card>
        </Box>
        <Footer />
      </>
    );
  }

  // Generate avatar with first letter of name
  const generateAvatarFromName = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Get avatar background color based on name
  const getAvatarColor = (name) => {
    if (!name) return "#1976d2";
    const colors = [
      "#1976d2",
      "#388e3c",
      "#f57c00",
      "#d32f2f",
      "#7b1fa2",
      "#303f9f",
      "#0288d1",
      "#00796b",
      "#689f38",
      "#fbc02d",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSnackbar({ open: true, message: "Please select a valid image file", severity: "error" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({ open: true, message: "Image size should be less than 5MB", severity: "error" });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload image
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await apiService.uploadProfileImage(formData);
      if (response.success) {
        setProfileImage(response.data.imageUrl);
        setSnackbar({ open: true, message: "Profile image updated successfully!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Failed to upload image", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error uploading image", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const removeProfileImage = async () => {
    setLoading(true);
    try {
      const response = await apiService.removeProfileImage();
      if (response.success) {
        setProfileImage("");
        setImagePreview(null);
        setSnackbar({ open: true, message: "Profile image removed successfully!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Failed to remove image", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error removing image", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (section, currentData) => {
    setEditSection(section);
    setEditData(currentData);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const response = await apiService.updateUserProfile(editData);
      if (response.success) {
        setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Failed to update profile", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error updating profile", severity: "error" });
    } finally {
      setLoading(false);
      setEditDialogOpen(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const renderEditDialog = () => {
    const getDialogContent = () => {
      switch (editSection) {
        case "account":
          return (
            <>
              <TextField
                fullWidth
                label="Name"
                value={editData.userName || ""}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={editData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                margin="normal"
                disabled
              />
            </>
          );
        case "address":
          return (
            <>
              <TextField
                fullWidth
                label="Address"
                value={editData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="City"
                value={editData.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Country"
                value={editData.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="State"
                value={editData.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Zip Code"
                value={editData.zip || ""}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                margin="normal"
              />
            </>
          );
        case "payment":
          return (
            <>
              <TextField
                fullWidth
                label="Card Holder Name"
                value={editData.cardHolder || ""}
                onChange={(e) => handleInputChange("cardHolder", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Card Number"
                value={editData.cardNumber || ""}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Expiry Date"
                value={editData.cardExpiry || ""}
                onChange={(e) => handleInputChange("cardExpiry", e.target.value)}
                margin="normal"
                placeholder="MM/YY"
              />
            </>
          );
        default:
          return null;
      }
    };

    return (
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit{" "}
          {editSection === "account"
            ? "Account Details"
            : editSection === "address"
              ? "Shipping Address"
              : "Payment Method"}
        </DialogTitle>
        <DialogContent>{getDialogContent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" startIcon={<SaveIcon />} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <Header />
      <Box sx={{ background: "#f4f6fa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
            Account
          </Typography>
          <Grid container spacing={4}>
            {/* Profile Card */}
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
                <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "primary.main",
                          color: "white",
                          "&:hover": { backgroundColor: "primary.dark" },
                          width: 32,
                          height: 32,
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                      >
                        <CameraAltIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    {imagePreview || profileImage ? (
                      <Avatar
                        src={imagePreview || profileImage}
                        alt={user.userName}
                        sx={{ width: 90, height: 90 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 90,
                          height: 90,
                          backgroundColor: getAvatarColor(user.userName),
                          fontSize: "2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {generateAvatarFromName(user.userName)}
                      </Avatar>
                    )}
                  </Badge>

                  {/* Remove image button */}
                  {(profileImage || imagePreview) && (
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "error.main",
                        color: "white",
                        "&:hover": { backgroundColor: "error.dark" },
                        width: 24,
                        height: 24,
                      }}
                      onClick={removeProfileImage}
                      disabled={loading}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                <Typography variant="h6" fontWeight={700}>
                  {user.userName}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, mb: 2, borderRadius: 8, fontWeight: 700 }}
                >
                  {user.isEmailVerified ? "Verified Account" : "Unverified Account"}
                </Button>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Card>
            </Grid>

            {/* Account Details, Shipping, Payment */}
            <Grid item xs={12} md={9}>
              <Grid container spacing={4}>
                {/* Account Details */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, boxShadow: 2, position: "relative" }}>
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 12, right: 12 }}
                      onClick={() =>
                        handleEditClick("account", { userName: user.userName, email: user.email })
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      Account Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Status
                    </Typography>
                    <Chip
                      label={user.isEmailVerified ? "Verified" : "Unverified"}
                      color={user.isEmailVerified ? "success" : "warning"}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Card>
                </Grid>

                {/* Shipping Address */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, boxShadow: 2, position: "relative" }}>
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 12, right: 12 }}
                      onClick={() =>
                        handleEditClick("address", { address: "", city: "", country: "", state: "", zip: "" })
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      Not set
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      City
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      Not set
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Country
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      Not set
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 2 }} fullWidth>
                      Add Address
                    </Button>
                  </Card>
                </Grid>

                {/* Payment Methods */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3, boxShadow: 2, position: "relative" }}>
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 12, right: 12 }}
                      onClick={() =>
                        handleEditClick("payment", { cardHolder: "", cardNumber: "", cardExpiry: "" })
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      Payment Methods
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No payment methods added
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 2 }} fullWidth>
                      Add Payment Method
                    </Button>
                  </Card>
                </Grid>
              </Grid>

              {/* Wish List */}
              <Card sx={{ mt: 4, p: 3, boxShadow: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Wish List ({wishlist?.itemCount || 0} items)
                  </Typography>
                  <Button size="small">View All</Button>
                </Box>
                {wishlist?.items?.length > 0 ? (
                  <Grid container spacing={2}>
                    {wishlist.items.slice(0, 4).map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow: 1,
                          }}
                        >
                          <img
                            src={item.product?.images?.[0]?.url || "https://via.placeholder.com/80"}
                            alt={item.product?.name || "Product"}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          />
                          <Typography variant="subtitle1" fontWeight={700} align="center">
                            {item.product?.name || "Product Name"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price: ${item.product?.price || 0}
                          </Typography>
                          <Chip label="In Wishlist" color="primary" size="small" sx={{ mt: 1 }} />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Your wishlist is empty. Start adding products you love!
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Edit Dialog */}
      {renderEditDialog()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfilePage;
