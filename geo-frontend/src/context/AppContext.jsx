import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { REFRESH_INTERVAL } from '../utils/constants';

const AppContext = createContext(null);

const initialState = {
  dashboard: null,
  allNews: null,
  loading: true,
  error: null,
  lastUpdated: null,
  selectedCountry: null,
  theme: 'dark',
  filters: {
    category: 'all',
    region: 'all',
    tensionMin: 0,
    tensionMax: 100,
    search: '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DASHBOARD':
      return { ...state, dashboard: action.payload, loading: false, error: null, lastUpdated: new Date() };
    case 'SET_ALL_NEWS':
      return { ...state, allNews: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SELECTED_COUNTRY':
      return { ...state, selectedCountry: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchDashboard = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🔄 Fetching dashboard data from backend...');
      const data = await apiService.getDashboard();
      console.log('✅ Dashboard data received:', data);
      dispatch({ type: 'SET_DASHBOARD', payload: data });
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const fetchAllNews = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🔄 Fetching news data from backend...');
      const data = await apiService.getNews();
      console.log('✅ News data received:', data);
      dispatch({ type: 'SET_ALL_NEWS', payload: data.articles || [] });
    } catch (err) {
      console.error('❌ News fetch error:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const setSelectedCountry = useCallback((country) => {
    dispatch({ type: 'SET_SELECTED_COUNTRY', payload: country });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const value = {
    ...state,
    fetchDashboard,
    fetchAllNews,
    setSelectedCountry,
    setFilter,
    resetFilters,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
