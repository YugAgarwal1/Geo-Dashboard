import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTensionColor, getTensionLabel, getTensionBg } from '../../utils/tensionColors';
import { CATEGORY_COLORS } from '../../utils/constants';
import { countryToFlag, capitalize } from '../../utils/formatters';
import { TensionGauge } from '../charts/TensionGauge';

export function CountryModal({ country, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!country) return null;
  const color = getTensionColor(country.tension_score);
  const flag = countryToFlag(country.name);
  const cats = country.categories || {};

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${color}33`,
        borderRadius: 14, width: '100%', maxWidth: 520,
        maxHeight: '85vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        animation: 'fade-in 0.2s ease',
        margin: '0 16px',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: `linear-gradient(135deg, ${color}0a, transparent)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>{flag}</span>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {country.name}
              </h2>
              <div style={{
                fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
                color, fontFamily: 'var(--font-mono)', marginTop: 2,
              }}>
                {getTensionLabel(country.tension_score)} Tension
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 6,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }} className="custom-scroll">
          {/* Gauge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <TensionGauge score={country.tension_score} size={180} label="Overall Tension" />
          </div>

          {/* Category Breakdown */}
          {Object.keys(cats).length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
                CATEGORY BREAKDOWN
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(cats).sort(([,a],[,b]) => b - a).map(([cat, val]) => {
                  const c = CATEGORY_COLORS[cat] || '#888';
                  return (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontSize: 12, color: c, width: 80, textTransform: 'capitalize', flexShrink: 0,
                      }}>{capitalize(cat)}</span>
                      <div style={{
                        flex: 1, height: 6, borderRadius: 3,
                        background: 'var(--bg-elevated)', overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${val}%`, height: '100%', borderRadius: 3,
                          background: c, boxShadow: `0 0 8px ${c}66`,
                          transition: 'width 1s ease',
                        }} />
                      </div>
                      <span style={{
                        fontSize: 12, fontFamily: 'var(--font-mono)',
                        color, width: 32, textAlign: 'right', fontWeight: 600,
                      }}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => {
              onClose();
              navigate(`/country/${encodeURIComponent(country.name)}`);
            }} style={{
              flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
              background: `${color}18`, border: `1px solid ${color}44`,
              color, fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            }}>
              Full Country Report
            </button>
            <button onClick={onClose} style={{
              padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 13,
            }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryModal;
