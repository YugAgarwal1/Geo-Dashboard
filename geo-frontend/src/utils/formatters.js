import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateStr) {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateStr || '—';
  }
}

export function formatDateTime(dateStr) {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(date, 'MMM d, yyyy HH:mm');
  } catch {
    return dateStr || '—';
  }
}

export function timeAgo(dateStr) {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '—';
  }
}

export function formatScore(score) {
  if (score === null || score === undefined) return '—';
  return Number(score).toFixed(1);
}

export function formatPercent(val) {
  return `${Math.round(val)}%`;
}

export function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function countryToFlag(countryName) {
  // Map common country names to flag emojis
  const flags = {
    'united states': '🇺🇸', 'usa': '🇺🇸', 'us': '🇺🇸',
    'russia': '🇷🇺', 'china': '🇨🇳', 'india': '🇮🇳',
    'ukraine': '🇺🇦', 'israel': '🇮🇱', 'iran': '🇮🇷',
    'north korea': '🇰🇵', 'taiwan': '🇹🇼', 'pakistan': '🇵🇰',
    'saudi arabia': '🇸🇦', 'turkey': '🇹🇷', 'brazil': '🇧🇷',
    'germany': '🇩🇪', 'france': '🇫🇷', 'uk': '🇬🇧',
    'united kingdom': '🇬🇧', 'japan': '🇯🇵', 'south korea': '🇰🇷',
    'syria': '🇸🇾', 'iraq': '🇮🇶', 'afghanistan': '🇦🇫',
    'myanmar': '🇲🇲', 'ethiopia': '🇪🇹', 'sudan': '🇸🇩',
    'venezuela': '🇻🇪', 'mexico': '🇲🇽', 'nigeria': '🇳🇬',
    'yemen': '🇾🇪', 'libya': '🇱🇾', 'somalia': '🇸🇴',
    'armenia': '🇦🇲', 'azerbaijan': '🇦🇿', 'georgia': '🇬🇪',
    'serbia': '🇷🇸', 'kosovo': '🇽🇰', 'cuba': '🇨🇺',
  };
  const key = countryName?.toLowerCase().trim();
  return flags[key] || '🌐';
}
