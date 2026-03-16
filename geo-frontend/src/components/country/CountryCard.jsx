import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { getTensionColor, getTensionBg, getTensionLabel } from '../../utils/tensionColors';
import { CATEGORY_COLORS } from '../../utils/constants';
import { countryToFlag } from '../../utils/formatters';

export function CountryCard({ country, rank, onClick, compact = false }) {
  if (!country) return null;
  const navigate = useNavigate();
  
  // Handle both old and new data structures
  const tensionScore = country.tension_score || country.total_tension || 0;
  const color = getTensionColor(tensionScore);
  const countryName = country.name || country.country;
  const flag = countryToFlag(countryName);

  const handleClick = () => {
    if (onClick) onClick(country);
    else navigate(`/country/${encodeURIComponent(countryName)}`);
  };

  if (compact) {
    return (
      <div onClick={handleClick} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
        border: '1px solid var(--border)', background: 'var(--bg-card)',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${color}44`;
          e.currentTarget.style.background = 'var(--bg-elevated)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--bg-card)';
        }}
      >
        {rank && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: 18 }}>#{rank}</span>}
        <span style={{ fontSize: 18 }}>{flag}</span>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{countryName}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color, fontSize: 14 }}>
          {tensionScore.toFixed(1)}
        </span>
        <ChevronRight size={13} color="var(--text-muted)" />
      </div>
    );
  }

  const cats = country.categories || {};
  const topCats = Object.entries(cats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div onClick={handleClick} style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '14px 16px', cursor: 'pointer',
      transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}44`;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.background = 'var(--bg-elevated)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      {/* Glow background */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle, ${color}15, transparent 70%)`,
        borderRadius: '0 10px 0 0', pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {rank && (
            <span style={{
              fontSize: 11, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', minWidth: 22,
            }}>
              #{rank}
            </span>
          )}
          <span style={{ fontSize: 24 }}>{flag}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{countryName}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              {getTensionLabel(tensionScore)}
            </div>
          </div>
        </div>
        <div style={{
          background: getTensionBg(tensionScore),
          border: `1px solid ${color}44`,
          borderRadius: 8, padding: '6px 10px', textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color, fontSize: 20, lineHeight: 1 }}>
            {tensionScore.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, letterSpacing: 0.5 }}>INDEX</div>
        </div>
      </div>

      {/* Category bars */}
      {topCats.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {topCats.map(([cat, val]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 10, color: CATEGORY_COLORS[cat] || '#888',
                width: 60, textTransform: 'capitalize', flexShrink: 0,
              }}>{cat}</span>
              <div style={{
                flex: 1, height: 4, borderRadius: 2,
                background: 'var(--bg-elevated)', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${val}%`, height: '100%',
                  background: CATEGORY_COLORS[cat] || '#888',
                  borderRadius: 2,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)', width: 24, textAlign: 'right',
              }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CountryCard;
