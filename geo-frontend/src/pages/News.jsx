import React, { useState, useMemo } from 'react';
import { Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import { NewsCard } from '../components/news/NewsCard';
import { ArticleModal } from '../components/news/ArticleModal';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { CATEGORIES, CATEGORY_COLORS } from '../utils/constants';
import { SkeletonBlock } from '../components/common/Loading';
import { capitalize } from '../utils/formatters';

const ALL_CATS = ['all', ...CATEGORIES];

export function News() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [minTension, setMinTension] = useState(0);
  const [showGdeltOnly, setShowGdeltOnly] = useState(false);
  
  // Fetch category-specific news or all news
  const { data: articles, loading, refetch } = useApi(
    () => category === 'all' ? apiService.getNews() : apiService.getNews(category),
    [category]
  );

  const filtered = useMemo(() => {
    // Handle different response structures
    if (!articles) return [];
    
    // Get articles array based on response structure
    let res = [];
    if (articles.articles) {
      // From /news endpoint
      res = [...articles.articles];
    } else if (articles.results) {
      // From /news/{category} endpoint
      res = [...articles.results];
    }
    
    // Filter for GDELT only if enabled
    if (showGdeltOnly) {
      res = res.filter(a => a.provider === 'gdelt');
    }
    
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.source?.toLowerCase().includes(q) ||
        a.source_id?.toLowerCase().includes(q) ||
        a.countries?.some(c => c.toLowerCase().includes(q))
      );
    }
    
    // Remove category filtering since we're fetching by category
    // if (category !== 'all') res = res.filter(a => a.category === category);
    
    if (minTension > 0) res = res.filter(a => a.tension_score >= minTension);
    res.sort((a, b) => {
      let av, bv;
      if (sort === 'date') { av = new Date(a.published_at || a.published || a.pubDate); bv = new Date(b.published_at || b.published || b.pubDate); }
      else if (sort === 'tension') { av = a.tension_score; bv = b.tension_score; }
      else { av = a.title; bv = b.title; }
      return sortDir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
    });
    return res;
  }, [articles, search, sort, sortDir, minTension, showGdeltOnly]);

  return (
    <div style={{ padding: '20px 24px', maxWidth: 960, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          Intelligence Feed
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Real-time geopolitical news and event analysis
        </p>
      </div>

      {/* Controls */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '16px 18px', marginBottom: 20,
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search articles, countries..."
            style={{
              width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 12px 8px 32px', color: 'var(--text-primary)',
              fontSize: 13, outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sort:</span>
          {['date', 'tension'].map(s => (
            <button key={s} onClick={() => { if (sort === s) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else setSort(s); }}
              style={{
                padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                background: sort === s ? 'rgba(0,212,255,0.1)' : 'var(--bg-elevated)',
                border: sort === s ? '1px solid rgba(0,212,255,0.3)' : '1px solid var(--border)',
                color: sort === s ? 'var(--accent-primary)' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              {sort === s && (sortDir === 'desc' ? <SortDesc size={12} /> : <SortAsc size={12} />)}
              {capitalize(s)}
            </button>
          ))}
        </div>

        {/* Min tension */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <Filter size={13} />
          Min tension:
          <input type="range" min={0} max={100} value={minTension} onChange={e => setMinTension(+e.target.value)}
            style={{ width: 80, accentColor: 'var(--accent-primary)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', minWidth: 24 }}>{minTension}</span>
        </div>

        {/* GDELT Filter */}
        <button
          onClick={() => setShowGdeltOnly(!showGdeltOnly)}
          style={{
            padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
            background: showGdeltOnly ? '#ff634820' : 'var(--bg-elevated)',
            border: showGdeltOnly ? '1px solid #ff634840' : '1px solid var(--border)',
            color: showGdeltOnly ? '#ff6348' : 'var(--text-secondary)',
            fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          🛰️ GDELT Only
          {showGdeltOnly && <span style={{ fontSize: 10, background: '#ff6348', color: 'white', borderRadius: 10, padding: '1px 5px' }}>ON</span>}
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {ALL_CATS.map(cat => {
          const c = CATEGORY_COLORS[cat] || 'var(--accent-primary)';
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              fontWeight: 500, transition: 'all 0.2s',
              background: active ? `${c}18` : 'var(--bg-elevated)',
              border: active ? `1px solid ${c}44` : '1px solid var(--border)',
              color: active ? c : 'var(--text-secondary)',
            }}>
              {capitalize(cat)}
              {cat !== 'all' && articles && (
                <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>
                  {articles.articles ? articles.articles.length : articles.results ? articles.results.length : 0}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
        {loading ? 'Loading...' : `${filtered.length} articles`}
      </div>

      {/* Articles */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array(6).fill(0).map((_, i) => <SkeletonBlock key={i} height={110} rounded={10} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(article => (
            <NewsCard key={article.id} article={article} onClick={setSelected} />
          ))}
          {filtered.length === 0 && (
            <div style={{
              padding: '48px', textAlign: 'center',
              border: '1px dashed var(--border)', borderRadius: 12,
              color: 'var(--text-muted)', fontSize: 14,
            }}>
              No articles match your filters
            </div>
          )}
        </div>
      )}

      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default News;
