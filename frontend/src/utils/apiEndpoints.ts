const BASE_URL = "http://localhost:8000"; // Replace with your actual backend URL

const API_ENDPOINTS = {
  // Dashboard
  getStocks: (company: string, period: string) =>
    `${BASE_URL}/stocks/${company}?period=${period}`,
  getTransactions: (company: string, timePeriod: string) =>
    `${BASE_URL}/transactions/${company}?time_period=${timePeriod}`,

  // Account
  getUserDetails: `${BASE_URL}/auth/me`,
  updateUserProfile: `${BASE_URL}/auth/me/update`,

  // Features
  fetchFeatureData: `${BASE_URL}/features`,

  // Authentication
  login: `${BASE_URL}/auth/login`,
  signUp: `${BASE_URL}/auth/signup`,

  // Other  APIs
  postNewData: `${BASE_URL}/data`,
};

export default API_ENDPOINTS;
