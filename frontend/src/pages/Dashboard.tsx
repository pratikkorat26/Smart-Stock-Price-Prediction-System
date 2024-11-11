// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Helmet } from 'react-helmet';

// Sample data for the table and chart (replace with dynamic data if needed)
const allTransactions = [
  { notificationDate: "2024-11-05", transactionDate: "2024-11-01", transactionType: "Planned sale", insider: "Musk Kimbal", position: "Non-Executive Director", shares: "1,000", price: "253.78", value: "USD 29,185" },
  { notificationDate: "2024-11-05", transactionDate: "2024-06-01", transactionType: "Planned sale", insider: "Musk Kimbal", position: "Non-Executive Director", shares: "1,000", price: "253.02", value: "USD 1,041,173" },
  { notificationDate: "2024-11-05", transactionDate: "2024-01-01", transactionType: "Planned sale", insider: "Musk Kimbal", position: "Non-Executive Director", shares: "1,000", price: "252.26", value: "USD 3,965,953" },
];

const allChartData = [
  { name: 'Jan', uv: 400, pv: 2400 },
  { name: 'Feb', uv: 300, pv: 2210 },
  { name: 'Mar', uv: 200, pv: 2290 },
  { name: 'Apr', uv: 278, pv: 2000 },
  { name: 'May', uv: 189, pv: 2181 },
  { name: 'Jun', uv: 239, pv: 2500 },
  { name: 'Jul', uv: 349, pv: 2100 },
  { name: 'Aug', uv: 400, pv: 2100 },
  { name: 'Sep', uv: 250, pv: 1900 },
  { name: 'Oct', uv: 300, pv: 2200 },
  { name: 'Nov', uv: 450, pv: 2400 },
];

// Time filter constants
const TIME_PERIODS = {
  ONE_MONTH: "1 Month",
  SIX_MONTHS: "6 Months",
  YTD: "YTD",
  ALL: "All",
};

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(TIME_PERIODS.ALL);

  // Filter data based on selected time period
  const filteredChartData = allChartData.slice(
    selectedTimePeriod === TIME_PERIODS.ONE_MONTH ? -1 :
    selectedTimePeriod === TIME_PERIODS.SIX_MONTHS ? -6 :
    selectedTimePeriod === TIME_PERIODS.YTD ? -11 : 0
  );

  const filteredTransactions = allTransactions.filter((_, index) => {
    if (selectedTimePeriod === TIME_PERIODS.ONE_MONTH) return index === 0;
    if (selectedTimePeriod === TIME_PERIODS.SIX_MONTHS) return index < 2;
    if (selectedTimePeriod === TIME_PERIODS.YTD) return index < 3;
    return true;
  });

  return (
    
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#F3F6F8">
      {/* Search Bar */}
      <Helmet>
        <title>Dashboard | SnoopTrade</title>
      </Helmet>
      <Box display="flex" alignItems="center" p={2} width="100%" maxWidth="1200px">
        <TextField
          variant="outlined"
          placeholder="Search for a company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>

      {/* Filter Buttons */}
      <Box mt={2} display="flex" justifyContent="center" width="100%">
        <ButtonGroup variant="contained" color="primary">
          {Object.values(TIME_PERIODS).map((period) => (
            <Button
              key={period}
              onClick={() => setSelectedTimePeriod(period)}
              variant={selectedTimePeriod === period ? "contained" : "outlined"}
            >
              {period}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Chart */}
      <Paper elevation={3} style={{ padding: '1rem', width: '100%', maxWidth: '1200px', marginTop: '2rem' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Stock Price Trend
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#73C2A0" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="pv" stroke="#6D727B" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Transactions Table */}
      <Paper elevation={3} style={{ padding: '1rem', width: '100%', maxWidth: '1200px', marginTop: '2rem' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Insider Trading Transactions
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Notification Date</TableCell>
                <TableCell>Transaction Date</TableCell>
                <TableCell>Transaction Type</TableCell>
                <TableCell>Insider and Position</TableCell>
                <TableCell align="right">Number of Shares</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="center">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.notificationDate}</TableCell>
                  <TableCell>{row.transactionDate}</TableCell>
                  <TableCell>{row.transactionType}</TableCell>
                  <TableCell>
                    <Typography variant="body1">{row.insider}</Typography>
                    <Typography variant="body2" color="textSecondary">{row.position}</Typography>
                  </TableCell>
                  <TableCell align="right">{row.shares}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell align="center">
                    <Button variant="text" color="primary" onClick={() => alert("Detail view not implemented")}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
