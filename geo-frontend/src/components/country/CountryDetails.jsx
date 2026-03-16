import React from 'react';
import { Globe, Users, TrendingUp } from 'lucide-react';
import { getTensionColor, getTensionLabel } from '../../utils/tensionColors';
import { countryToFlag } from '../../utils/formatters';

export function CountryDetails({ country }) {
  if (!country) return null;
  const color = getTensionColor(country.tension_score);
  const flag = countryToFlag(country.name);

  return (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid ${color}33`,
      borderRadius: 12, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${color}12, transparent)`,
        padding: '20px 22px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 40 }}>{flag}</span>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 2 }}>
            {country.name}
          </h3>
          <div style={{ fontSize: 11, color, fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {getTensionLabel(country.tension_score)} Risk
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 700, color, lineHeight: 1 }}>
            {country.tension_score?.toFixed(1)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>TENSION INDEX</div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ padding: '16px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {country.region && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={14} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Region</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{country.region}</div>
            </div>
          </div>
        )}
        {country.population && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={14} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Population</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                {(country.population / 1e6).toFixed(0)}M
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CountryDetails;
