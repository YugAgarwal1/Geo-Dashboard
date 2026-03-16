import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, Globe, TrendingUp } from 'lucide-react';
import { getTensionColor, getTensionLabel, getTensionBg } from '../../utils/tensionColors';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/constants';
import { formatDateTime, capitalize } from '../../utils/formatters';

export function ArticleModal({ article, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!article) return null;
  const color = getTensionColor(article.tension_score);
  const catColor = CATEGORY_COLORS[article.category] || '#00d4ff';

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        width: '100%', maxWidth: 640,
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        animation: 'fade-in 0.2s ease',
        margin: '0 16px',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: `linear-gradient(135deg, ${catColor}08, transparent)`,
        }}>
          <div style={{ flex: 1, paddingRight: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 11, padding: '3px 9px', borderRadius: 4,
                background: `${catColor}22`, color: catColor,
                fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
              }}>
                {CATEGORY_ICONS[article.category]} {capitalize(article.category)}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{article.source}</span>
            </div>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: 'var(--text-primary)',
              lineHeight: 1.4, fontFamily: 'var(--font-display)',
            }}>
              {article.title}
            </h2>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 6, flexShrink: 0,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }} className="custom-scroll">
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {formatDateTime(article.published_at)}
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: getTensionBg(article.tension_score),
              border: `1px solid ${color}44`, borderRadius: 6,
              padding: '4px 10px',
            }}>
              <TrendingUp size={12} color={color} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: color, fontSize: 14 }}>
                {article.tension_score}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {getTensionLabel(article.tension_score)}
              </span>
            </div>
          </div>

          {/* Content */}
          <p style={{
            fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
            marginBottom: 20,
          }}>
            {article.content}
          </p>

          {/* Countries involved */}
          {article.countries?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                COUNTRIES INVOLVED
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {article.countries.map(c => (
                  <span key={c} style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 12,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <Globe size={11} color="var(--text-muted)" /> {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External link */}
          {article.url && article.url !== '#' && (
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)',
              color: 'var(--accent-primary)', fontSize: 13, textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              <ExternalLink size={13} /> Read Full Article
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleModal;
