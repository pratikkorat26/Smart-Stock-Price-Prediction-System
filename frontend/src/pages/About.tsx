import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import Navbar from '../components/Navbar'; // Adjust the import path as needed.

const aboutContent = [
  {
    title: 'Our Project',
    description:
      'Our project leverages data from the SEC EDGAR database to provide deep insights into insider trading activities. Using advanced data processing and analytics, we aim to empower investors with actionable intelligence for better decision-making in the financial markets.',
  },
  {
    title: 'How It Works',
    description:
      'We process SEC EDGAR filings to extract insider trading activities and analyze the data to identify trends, patterns, and correlations. Our platform offers real-time insights and analytics that allow users to stay ahead of the market.',
  },
];

const teamMembers = [
  { name: 'Nevil Padariya', role: 'Frontend Engineer' },
  { name: 'Pratik Korat', role: 'Team Lead & Backend Engineer' },
  { name: 'Nagaraj GK', role: 'Data Analyst & Researcher' },
];

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 2,
            }}
          >
            About Our Project
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 8,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Learn more about the vision, technology, and team behind our insider trading analysis platform.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {aboutContent.map((section, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(115, 194, 160, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
                    borderRadius: '16px',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {section.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 4,
            }}
          >
            Meet the Team
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(115, 194, 160, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
                    borderRadius: '16px',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
