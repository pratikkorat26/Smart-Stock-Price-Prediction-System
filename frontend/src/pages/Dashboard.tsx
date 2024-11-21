import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Switch,
  FormControlLabel,
  Button,
  ButtonGroup,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import ChartContainer from '../components/ChartContainer';
import SearchBar from '../components/SearchBar';
import CompanyList from '../components/CompanyList';
import InsiderTradingChats from '../components/InsiderTradingChats';
import { fetchData } from '../utils/fetchData';
import API_ENDPOINTS from '../utils/apiEndpoints';

const TIME_PERIODS = {
  ONE_MONTH: '1m',
  THREE_MONTHS: '3m',
  SIX_MONTHS: '6m',
  ALL: '1y',
};

const COMPANIES = ['AAPL', 'META', 'NVDA'];

// Color palette matching theme and landing
const COLORS = {
  primary: '#00D09C',
  secondary: '#1A1A1A',
  accent: '#73C2A0',
  background: {
    main: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))',
    paper: 'rgba(115, 194, 160, 0.1)',
    card: 'linear-gradient(135deg, rgba(115, 194, 160, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.8)',
    muted: 'rgba(255, 255, 255, 0.7)',
  },
  chart: {
    price: '#73C2A0',
    volume: '#A8E6CF',
  },
};

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>(COMPANIES);
  const [showCompanyList, setShowCompanyList] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(TIME_PERIODS.SIX_MONTHS);
  const [stockData, setStockData] = useState<any[]>([]);
  const [tradeData, setTradeData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLogScaleShares, setIsLogScaleShares] = useState(false);
  const [isLogScalePrice, setIsLogScalePrice] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setFilteredCompanies(
      COMPANIES.filter((company) =>
        company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setShowCompanyList(searchTerm.length > 0);
  }, [searchTerm]);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setSearchTerm('');
    setShowCompanyList(false);
  };

  const handleTimePeriodChange = (period: string) => {
    setSelectedTimePeriod(period);
  };

  const fetchStockData = async () => {
    if (!selectedCompany || !token) return;
    try {
      const url = API_ENDPOINTS.getStocks(selectedCompany, selectedTimePeriod);
      const data = await fetchData(url, token);

      const formattedData = data.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString(),
        open: item.open,
        close: item.close,
        high: item.high,
        low: item.low,
      }));
      setStockData(formattedData);
    } catch (error: any) {
      if (error.message.includes('401')) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };

  const fetchTradeData = async () => {
    if (!selectedCompany || !token) return;
    try {
      const url = API_ENDPOINTS.getTransactions(selectedCompany, selectedTimePeriod);
      const data = await fetchData(url, token);

      const formattedTrades = data.map((trade: any) => ({
        date: new Date(trade.transaction_date).toLocaleDateString(),
        shares: Number(trade.shares),
        transaction_code: trade.transaction_code,
        price_per_share: trade.price_per_share,
      }));
      setTradeData(formattedTrades);
    } catch (error) {
      console.error('Error fetching insider trade data:', error);
    }
  };

  useEffect(() => {
    if (token && selectedCompany) {
      fetchStockData();
      fetchTradeData();
    }
  }, [selectedCompany, selectedTimePeriod, token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: COLORS.background.main,
        color: COLORS.text.primary,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(115, 194, 160, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Helmet>
        <title>Dashboard | SnoopTrade</title>
      </Helmet>

      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
        <Typography
          variant="h1"
          align="center"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 800,
            color: COLORS.text.primary,
            mb: 3,
            '& span': {
              background: 'linear-gradient(45deg, #73C2A0 30%, #A8E6CF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
          }}
        >
          Insider Trading <span>Dashboard</span>
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: COLORS.text.secondary,
            mb: 8,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          Analyze market trends and insider trading activities with real-time data and insights.
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
          />
          {showCompanyList && filteredCompanies.length > 0 && (
            <CompanyList
              companies={filteredCompanies}
              onSelectCompany={handleCompanySelect}
            />
          )}
          {showCompanyList && filteredCompanies.length === 0 && (
            <Typography variant="body1" sx={{ color: COLORS.text.muted, mt: 2 }}>
              No companies found.
            </Typography>
          )}
          
          {/* Time period selector moved here and only shown when a company is selected */}
          {selectedCompany && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <ButtonGroup>
                {Object.entries(TIME_PERIODS).map(([key, value]) => (
                  <Button
                    key={key}
                    onClick={() => handleTimePeriodChange(value)}
                    sx={{
                      backgroundColor: selectedTimePeriod === value ? COLORS.accent : 'transparent',
                      color: selectedTimePeriod === value ? COLORS.secondary : COLORS.text.primary,
                      border: `1px solid ${COLORS.accent}`,
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      '&:hover': {
                        backgroundColor: COLORS.accent,
                        color: COLORS.secondary,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  >
                    {key.replace('_', ' ')}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          )}
        </Box>

        {selectedCompany && (
          <>
            <Typography
              variant="h5"
              align="center"
              sx={{
                mt: 6,
                mb: 4,
                color: COLORS.text.primary,
                fontWeight: 600,
              }}
            >
              Data for {selectedCompany}
            </Typography>

            <Box sx={{ 
              mb: 6, 
              background: COLORS.background.card,
              p: 4,
              borderRadius: '16px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <ChartContainer
                title="Stock Price Trends"
                data={stockData}
                dataKey="close"
                lineColor={COLORS.chart.price}
                isLogScale={isLogScalePrice}
              />
            </Box>

            <Box sx={{ 
              mb: 6,
              background: COLORS.background.card,
              p: 4,
              borderRadius: '16px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <ChartContainer
                title="Volume of Shares Traded"
                data={tradeData}
                dataKey="shares"
                lineColor={COLORS.chart.volume}
                isLogScale={isLogScaleShares}
              />
            </Box>

            <Box sx={{ 
              mb: 6,
              background: COLORS.background.card,
              p: 4,
              borderRadius: '16px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <InsiderTradingChats tradeData={tradeData} />
            </Box>

            <Box mt={6}>
              <Typography 
                variant="h5" 
                align="center" 
                gutterBottom
                sx={{ color: COLORS.text.primary }}
              >
                Transaction Details
              </Typography>
              <Box sx={{ 
                background: COLORS.background.card,
                p: 4,
                borderRadius: '16px',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}>
                <DataTable
                  tradeData={tradeData}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  handleChangePage={(e, newPage) => setPage(newPage)}
                  handleChangeRowsPerPage={(e) =>
                    setRowsPerPage(parseInt(e.target.value, 10))
                  }
                />
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;