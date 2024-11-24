import React from 'react';
import { Box, Container, Grid, Typography, Avatar, Link, Card, CardContent } from '@mui/material';
import Navbar from '../components/Navbar'; // Adjust the import path as needed.

const aboutContent = [
  {
    title: 'Our Project',
    description: (
      <ul>
        <li>Leverages data from the SEC EDGAR database.</li>
        <li>Provides deep insights into insider trading activities.</li>
        <li>Empowers investors with actionable intelligence.</li>
        <li>Facilitates better decision-making in financial markets.</li>
      </ul>
    ),
  },
  {
    title: 'How It Works',
    description: (
      <ul>
        <li>Processes SEC EDGAR filings to extract insider trading activities.</li>
        <li>Analyzes data to identify trends, patterns, and correlations.</li>
        <li>Offers real-time insights and analytics.</li>
        <li>Allows users to stay ahead of the market.</li>
      </ul>
    ),
  },
];

const machineLearningContent = {
  title: 'Machine Learning with Prophet',
  description: (
    <ul>
      <li><strong>Prophet Model</strong>: Utilizes the Prophet model developed by Facebook for reliable 30-day forecasts.</li>
      <li><strong>Dynamic Capacity Calculations</strong>: Enhances the model with dynamic capacity calculations based on historical volatility and trend.</li>
      <li><strong>Additional Metrics</strong>: Includes additional metrics such as momentum and acceleration for more accurate predictions.</li>
      <li><strong>Feature Engineering</strong>: Prepares training data with feature engineering techniques, including:
        <ul>
          <li>Volatility</li>
          <li>Returns</li>
          <li>Rolling Mean</li>
          <li>Exponential Moving Average (EMA)</li>
          <li>Relative Strength Index (RSI)</li>
        </ul>
      </li>
      <li><strong>Lagged Features</strong>: Incorporates lagged features to improve model accuracy.</li>
      <li><strong>No Seasonality</strong>: Uses an enhanced Prophet model without seasonality for better trend analysis.</li>
      <li><strong>Confidence Intervals</strong>: Adjusts interval width for more confident prediction intervals.</li>
    </ul>
  ),
};

const teamMembers = [
  {
    name: 'Nevil Padariya',
    role: 'Frontend Engineer',
    photo: '/utils/nevil.jpg',
    email: 'nevil@example.com',
    contact: '+1234567890',
    linkedIn: 'https://www.linkedin.com/in/nevil-padariya/',
    description: 'Nevil is a skilled frontend engineer with a passion for creating intuitive and responsive user interfaces.',
    skills: [
      'React',
      'JavaScript',
      'CSS',
      'HTML',
      'Responsive Design'
    ]
  },
  {
    name: 'Pratik Korat',
    role: 'Team Lead & Backend Engineer',
    photo: '/utils/Pratik.jpg', // Ensure this path is correct
    email: 'pratik@example.com',
    contact: '+0987654321',
    linkedIn: 'https://www.linkedin.com/in/pratik-korat',
    description: 'Pratik is the team lead and backend engineer, also specializing as a machine learning engineer. He ensures the seamless integration of backend services and machine learning models.',
    skills: [
      'Python',
      'FastAPI',
      'Machine Learning',
      'Data Analysis',
      'Project Management'
    ]
  },
  {
    name: 'Nagaraj GK',
    role: 'Data Analyst & Researcher',
    photo: '/utils/nagaraj.jpg',
    email: 'nagaraj@example.com',
    contact: '+1122334455',
    linkedIn: 'https://www.linkedin.com/in/nagsgk/',
    description: 'Nagaraj is a dedicated data analyst and researcher, responsible for extracting valuable insights from complex datasets.',
    skills: [
      'Data Analysis',
      'Python',
      'SQL',
      'Research',
      'Data Visualization'
    ]
  },
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

          <Box
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, rgba(115, 194, 160, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
              borderRadius: '16px',
              mb: 8,
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
              {machineLearningContent.title}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.6,
              }}
            >
              {machineLearningContent.description}
            </Typography>
          </Box>

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
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(115, 194, 160, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
                    borderRadius: '16px',
                    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.3)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      alt={member.name}
                      src={"/src/utils/Pratik.jpg"}
                      sx={{ width: 100, height: 100, mb: 2, mx: 'auto' }}
                    />
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
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                        mt: 1,
                        textAlign: 'left',
                      }}
                    >
                      {member.description}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                        mt: 1,
                        textAlign: 'left',
                      }}
                    >
                      <strong>Email:</strong> {member.email}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                        mt: 1,
                        textAlign: 'left',
                      }}
                    >
                      <strong>Contact:</strong> {member.contact}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                        mt: 1,
                        textAlign: 'left',
                      }}
                    >
                      <strong>LinkedIn:</strong> <Link href={member.linkedIn} target="_blank" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{member.linkedIn}</Link>
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                        mt: 1,
                        textAlign: 'left',
                      }}
                    >
                      <strong>Skills:</strong>
                      <ul>
                        {member.skills.map((skill, skillIndex) => (
                          <li key={skillIndex}>{skill}</li>
                        ))}
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;