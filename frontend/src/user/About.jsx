import React from "react";
import { Container, Typography, Grid, Box, Paper, Avatar } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const team = [
  {
    name: "John Doe",
    title: "CEO & Founder",
    desc: "Passionate about creating exceptional shopping experiences.",
  },
  {
    name: "Jane Smith",
    title: "Head of Operations",
    desc: "Ensuring smooth operations and customer satisfaction.",
  },
  {
    name: "Mike Johnson",
    title: "Head of Technology",
    desc: "Driving innovation and technical excellence.",
  },
];

const About = () => (
  <>
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Title & Subtitle */}
      <Typography variant="h2" align="center" fontWeight={700} gutterBottom>
        About Buy Nest
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        We are passionate about providing the best shopping experience with quality products and exceptional
        customer service.
      </Typography>
      {/* Mission & Vision */}
      <Grid container spacing={4} direction="row" justifyContent="center" alignItems="stretch" sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} display="flex" justifyContent="center">
          <Box sx={{ textAlign: "center", width: 320 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To provide customers with a seamless online shopping experience, offering high-quality products
              at competitive prices while maintaining the highest standards of customer service and
              satisfaction.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" justifyContent="center">
          <Box sx={{ textAlign: "center", width: 320 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Our Vision
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To become the leading e-commerce platform, known for innovation, reliability, and
              customer-centric approach, making quality products accessible to everyone.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {/* Values */}
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Our Values
      </Typography>
      <Grid container spacing={4} justifyContent="center" direction="row" sx={{ mb: 6 }}>
        <Grid item xs={12} sm={4} md={4} display="flex" justifyContent="center">
          <Box sx={{ textAlign: "center", width: 220 }}>
            <VerifiedUserIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Trust
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Building long-term relationships with our customers through transparency and reliability.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4} display="flex" justifyContent="center">
          <Box sx={{ textAlign: "center", width: 220 }}>
            <StarIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Quality
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ensuring every product meets our high standards of quality and performance.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4} display="flex" justifyContent="center">
          <Box sx={{ textAlign: "center", width: 220 }}>
            <LightbulbIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Innovation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Continuously improving our platform and services to meet evolving customer needs.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {/* Numbers */}
      <Paper elevation={0} sx={{ p: 4, mb: 6, background: "#f7f7fa", textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Our Numbers
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              10K+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Happy Customers
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              500+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Products
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              50+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Brands
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              24/7
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Support
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      {/* Team */}
      <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Our Team
      </Typography>
      <Grid container spacing={4} direction="row" justifyContent="center">
        {team.map((member, idx) => (
          <Grid item xs={12} sm={4} key={idx} display="flex" justifyContent="center">
            <Box sx={{ textAlign: "center", width: 220 }}>
              <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                {member.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {member.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {member.desc}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </>
);

export default About;
