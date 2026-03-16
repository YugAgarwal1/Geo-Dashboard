import React from 'react';
import { TENSION_LEVELS } from '../../utils/constants';

export function TensionLegend({ compact = false }) {
  return (
    <div style={{
      background: 'rgba(10,10,26,0.9)',
      border: '1px solid var(--border)',
      borderRadius: 8, padding: compact ? '8px 12px' : '12px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      {!compact && (
        <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 2, fontFamily: 'var(--font-mono)' }}>
          TENSION SCALE
        </div>
      )}
      {TENSION_LEVELS.map(level => (
        <div key={level.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 12, height: 12, borderRadius: 2,
            background: level.color, flexShrink: 0,
            boxShadow: `0 0 6px ${level.color}66`,
          }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {compact ? '' : `${level.min}–${level.max} `}
            <span style={{ color: level.color }}>{level.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default TensionLegend;
