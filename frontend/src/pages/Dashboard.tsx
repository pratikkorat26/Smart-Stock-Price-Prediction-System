import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Scatter } from 'recharts';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contex/AuthContext';

const TIME_PERIODS = {
  ONE_MONTH: "1m",
  THREE_MONTHS: "3m",
  SIX_MONTHS: "6m",
  ALL: "1y",
};

const COMPANIES = ["AAPL", "META", "NVDA"];

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>(COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(TIME_PERIODS.SIX_MONTHS);
  const [stockData, setStockData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!selectedCompany) return;

    const fetchStockData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8000/stocks/${selectedCompany}?period=${selectedTimePeriod}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            clearToken();
            navigate('/login');
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        }

        const data = await response.json();
        const formattedData = data
          .map((item: any) => ({
            date: new Date(item.date).toLocaleDateString(),
            open: item.open,
            close: item.close,
            high: item.high,
            low: item.low,
          }))
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setStockData(formattedData);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    const fetchTradeData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8000/transactions/${selectedCompany}?time_period=${selectedTimePeriod}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const formattedTrades = data.map((trade: any) => ({
          date: new Date(trade.transaction_date).toLocaleDateString(),
          shares: Number(trade.shares),
          ...trade,
        }));
        setTradeData(formattedTrades);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch insider trade data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    fetchTradeData();
  }, [selectedCompany, selectedTimePeriod, token, clearToken, navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setFilteredCompanies(COMPANIES.filter(company => company.startsWith(value)));
  };

  const handleCompanySelect = (company: string) => {
    setSearchTerm(company);
    setSelectedCompany(company);
    setSelectedTimePeriod(TIME_PERIODS.SIX_MONTHS);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = tradeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const trade = tradeData.find((t: any) => t.date === data.date);
      return (
        <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <Typography color="textPrimary">Date: {data.date}</Typography>
          <Typography color="green">Open: {data.open}</Typography>
          <Typography color="red">Close: {data.close}</Typography>
          <Typography color="orange">High: {data.high}</Typography>
          <Typography color="blue">Low: {data.low}</Typography>
        </Paper>
      );
    }
    return null;
  };

  const alignedTradeData = tradeData.filter((trade: any) =>
    stockData.some((stock: any) => stock.date === trade.date)
  );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#F3F6F8">
      <Helmet>
        <title>Dashboard | SnoopTrade</title>
      </Helmet>
      <Box display="flex" flexDirection="column" alignItems="center" p={2} width="100%" maxWidth="1200px">
        <TextField
          variant="outlined"
          placeholder="Search for a company"
          value={searchTerm}
          onChange={handleSearchChange}
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
        {searchTerm && filteredCompanies.length > 0 && (
          <List style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', marginTop: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            {filteredCompanies.map((company) => (
              <ListItem key={company} disablePadding>
                <ListItemButton onClick={() => handleCompanySelect(company)}>
                  <ListItemText primary={company} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Paper elevation={3} style={{ padding: '1rem', width: '100%', maxWidth: '1200px', marginTop: '2rem' }}>
        <Typography variant="h5" align="center" gutterBottom>
          {selectedCompany ? `Stock Price Trend for ${selectedCompany}` : 'Select a company to see the data'}
        </Typography>
        {selectedCompany ? (
          loading ? (
            <Typography align="center">Loading...</Typography>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : stockData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip content={customTooltip} />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#73C2A0"
                  activeDot={{ r: 8 }}
                />
                <Scatter data={alignedTradeData} dataKey="date" fill="red" />
                <Brush dataKey="date" height={30} stroke="#73C2A0" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography align="center">No data available for the selected company.</Typography>
          )
        ) : (
          <Typography align="center" color="textSecondary">
            Please select a company to see the data.
          </Typography>
        )}
      </Paper>
      <Paper elevation={3} style={{ padding: '1rem', width: '100%', maxWidth: '1200px', marginTop: '2rem' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Insider Trade Information
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Security Title</TableCell>
                <TableCell>Transaction Code</TableCell>
                <TableCell>Shares</TableCell>
                <TableCell>Price Per Share</TableCell>
                <TableCell>Ownership Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((trade: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{trade.date}</TableCell>
                  <TableCell>{trade.security_title}</TableCell>
                  <TableCell>{trade.transaction_code}</TableCell>
                  <TableCell>{trade.shares}</TableCell>
                  <TableCell>{trade.price_per_share}</TableCell>
                  <TableCell>{trade.ownership_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={tradeData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
