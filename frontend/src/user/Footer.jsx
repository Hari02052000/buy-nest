import React from "react";
import { Box, Typography, Container, Grid, TextField, Button, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.primary.contrastText,
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      {/* Newsletter Subscription */}
      <Container maxWidth="md" sx={{ mb: 6 }}>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
          Stay Updated
        </Typography>
        <Typography variant="body1" align="center" color="inherit" paragraph>
          Subscribe to our newsletter for the latest products and exclusive offers.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            size="small"
            sx={{ width: 300, backgroundColor: "white", borderRadius: 1 }}
          />
          <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
            Subscribe
          </Button>
        </Box>
      </Container>
      {/* Footer Links */}
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Buy Nest
            </Typography>
            <Typography variant="body2" color="inherit" paragraph>
              Your trusted online shopping destination for quality products and exceptional service.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" underline="hover" display="block">
                Home
              </Link>
              <Link href="/products" color="inherit" underline="hover" display="block">
                Products
              </Link>
              <Link href="/about" color="inherit" underline="hover" display="block">
                About Us
              </Link>
              <Link href="/contact" color="inherit" underline="hover" display="block">
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Customer Service
            </Typography>
            <Box>
              <Link href="#" color="inherit" underline="hover" display="block">
                Shipping Info
              </Link>
              <Link href="#" color="inherit" underline="hover" display="block">
                Returns
              </Link>
              <Link href="#" color="inherit" underline="hover" display="block">
                FAQ
              </Link>
              <Link href="#" color="inherit" underline="hover" display="block">
                Support
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" color="inherit">
              123 Shopping Street
              <br />
              India
              <br />
              Phone: +91 1234567890
              <br />
              Email: info@buynest.com
            </Typography>
          </Grid>
        </Grid>
      </Container>
      {/* Copyright */}
      <Box sx={{ borderTop: 1, borderColor: "divider", mt: 6, pt: 2 }}>
        <Typography variant="body2" color="inherit" align="center">
          © {new Date().getFullYear()} Buy Nest. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
