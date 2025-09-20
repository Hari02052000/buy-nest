import React from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Header from "./Header";
import Footer from "./Footer";

const faqs = [
  {
    q: "How can I track my order?",
    a: "You can track your order by logging into your account and visiting the “My Orders” section.",
  },
  {
    q: "What’s your return policy?",
    a: "We offer a 15-day return policy for most items. Please check the product page for specific details.",
  },
  {
    q: "Do you ship internationally?",
    a: "We also ship to most countries. Shipping costs and delivery times vary by location.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can reach our customer support team via email, phone, or through the contact form above.",
  },
];

const Contact = () => {
  return (
    <>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 5 }}>
          Have questions? We’d love to hear from you. Send us a message and we’ll respond as soon as possible.
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
              Send us a Message
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="First Name" fullWidth size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Last Name" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Subject" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Message" fullWidth multiline rows={4} size="small" />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" fullWidth sx={{ py: 1.2, fontWeight: 600 }}>
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* Contact Info & Map */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
              Get in Touch
            </Typography>
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="+1 (234) 567-890" secondary="+1 (234) 567-891" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="info@buynest.com" secondary="support@buynest.com" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="123 Shopping Street" secondary="New York, NY 10001, United States" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mon-Fri: 9:00 AM - 6:00 PM"
                    secondary="Sat: 10:00 AM - 4:00 PM, Sun: Closed"
                  />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Our Location
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 120,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  borderRadius: 1,
                }}
              >
                Map will be displayed here
              </Box>
            </Box>
          </Grid>
        </Grid>
        {/* FAQ Section */}
        <Box sx={{ mt: 8, maxWidth: "900px", mx: "auto" }}>
          <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {faqs.map((faq, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {faq.q}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {faq.a}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Contact;
