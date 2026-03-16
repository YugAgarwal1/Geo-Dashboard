import { useState, useMemo } from 'react';

export function useFilters(items = []) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tensionRange, setTensionRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('tension');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    let result = [...items];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.countries?.some(c => c.toLowerCase().includes(q))
      );
    }

    if (category !== 'all') {
      result = result.filter(item => item.category === category);
    }

    result = result.filter(item => {
      const score = item.tension_score ?? 0;
      return score >= tensionRange[0] && score <= tensionRange[1];
    });

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'tension') { aVal = a.tension_score; bVal = b.tension_score; }
      else if (sortBy === 'date') { aVal = new Date(a.published_at); bVal = new Date(b.published_at); }
      else if (sortBy === 'name') { aVal = a.name || a.title; bVal = b.name || b.title; }
      else { aVal = 0; bVal = 0; }
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [items, search, category, tensionRange, sortBy, sortDir]);

  return {
    filtered, search, setSearch, category, setCategory,
    tensionRange, setTensionRange, sortBy, setSortBy,
    sortDir, setSortDir,
  };
}

export default useFilters;
