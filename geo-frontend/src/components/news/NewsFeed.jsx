import React, { useState } from 'react';
import { NewsCard } from './NewsCard';
import { ArticleModal } from './ArticleModal';
import { CATEGORIES } from '../../utils/constants';
import { capitalize } from '../../utils/formatters';

const ALL_CATS = ['all', ...CATEGORIES];

export function NewsFeed({ articles = [], showFilter = false, maxItems = null }) {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = articles.filter(a =>
    activeCategory === 'all' || a.category === activeCategory
  );
  const displayed = maxItems ? filtered.slice(0, maxItems) : filtered;

  return (
    <div>
      {showFilter && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {ALL_CATS.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12,
              cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500,
              background: activeCategory === cat ? 'rgba(0,212,255,0.12)' : 'var(--bg-elevated)',
              border: activeCategory === cat ? '1px solid rgba(0,212,255,0.35)' : '1px solid var(--border)',
              color: activeCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}>
              {capitalize(cat)}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displayed.map(article => (
          <NewsCard key={article.id} article={article} onClick={setSelected} />
        ))}
        {displayed.length === 0 && (
          <div style={{
            padding: '32px', textAlign: 'center',
            color: 'var(--text-muted)', fontSize: 13,
          }}>
            No articles found
          </div>
        )}
      </div>

      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default NewsFeed;
