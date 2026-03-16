export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const TENSION_LEVELS = [
  { min: 0, max: 20, color: '#1e3a8a', label: 'Low', bg: 'rgba(30,58,138,0.2)' },
  { min: 21, max: 40, color: '#3b82f6', label: 'Below Average', bg: 'rgba(59,130,246,0.2)' },
  { min: 41, max: 60, color: '#eab308', label: 'Moderate', bg: 'rgba(234,179,8,0.2)' },
  { min: 61, max: 80, color: '#f97316', label: 'High', bg: 'rgba(249,115,22,0.2)' },
  { min: 81, max: 100, color: '#dc2626', label: 'Critical', bg: 'rgba(220,38,38,0.2)' },
];

export const CATEGORIES = ['war', 'geopolitics', 'oil', 'markets', 'cyber', 'economic'];

export const CATEGORY_COLORS = {
  war: '#ff6348',
  geopolitics: '#00d4ff',
  oil: '#f7b731',
  markets: '#4ecdc4',
  cyber: '#a855f7',
  economic: '#22c55e',
};

export const CATEGORY_ICONS = {
  war: '⚔️',
  geopolitics: '🌐',
  oil: '🛢️',
  markets: '📊',
  cyber: '💻',
  economic: '💰',
};

export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
