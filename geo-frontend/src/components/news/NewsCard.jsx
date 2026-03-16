import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { getTensionColor, getTensionLabel } from '../../utils/tensionColors';
import { timeAgo, truncate } from '../../utils/formatters';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/constants';

export function NewsCard({ article, onClick, compact = false }) {
  if (!article) return null;
  const color = getTensionColor(article.tension_score);
  const catColor = CATEGORY_COLORS[article.category] || '#00d4ff';
  const icon = CATEGORY_ICONS[article.category] || '🌐';
  
  // Special handling for GDELT articles
  const isGdelt = article.provider === 'gdelt';
  const displayColor = isGdelt ? '#ff6348' : catColor;
  const displayIcon = isGdelt ? '🛰️' : icon;

  return (
    <div
      onClick={() => onClick?.(article)}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: compact ? '12px 14px' : '16px 18px',
        cursor: 'pointer', transition: 'all 0.2s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${displayColor}40`;
        e.currentTarget.style.background = `${displayColor}06`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--bg-card)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: displayColor, borderRadius: '10px 0 0 10px', opacity: 0.7 }} />
      <div style={{ paddingLeft: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${displayColor}20`, color: displayColor, fontFamily: 'var(--font-mono)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500 }}>
            {displayIcon} {isGdelt ? 'GDELT' : article.category}
          </span>
          {article.tension_score && (
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${color}20`, color: color, fontFamily: 'var(--font-mono)', fontWeight: 600, border: `1px solid ${color}30` }}>
              {article.tension_score?.toFixed(1)} • {getTensionLabel(article.tension_score)}
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={10} color="var(--text-muted)" />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(article.published_at)}</span>
          </div>
        </div>
        <div style={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: compact ? 6 : 8, fontFamily: 'var(--font-display)' }}>
          {article.title}
        </div>
        {!compact && (
          <>
            {article.context && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                {truncate(article.context, 200)}
              </div>
            )}
            {article.countries && article.countries.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {article.countries.slice(0, 5).map((country, idx) => (
                  <span key={idx} style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 4, padding: '2px 6px', fontSize: 10,
                    fontFamily: 'var(--font-mono)', color: 'var(--text-primary)'
                  }}>
                    🌍 {country}
                  </span>
                ))}
                {article.countries.length > 5 && (
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    +{article.countries.length - 5} more
                  </span>
                )}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Source: {article.source}
              </span>
              {isGdelt && (
                <span style={{ fontSize: 10, color: '#ff6348', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  Intelligence Feed
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default NewsCard;
