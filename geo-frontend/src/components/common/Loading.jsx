import React from 'react';

export function Spinner({ size = 20 }) {
  return (
    <div
      style={{
        width: size, height: size,
        border: `2px solid rgba(0,212,255,0.15)`,
        borderTopColor: '#00d4ff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
      aria-label="Loading"
    />
  );
}

export function LoadingOverlay({ text = 'Loading...' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(10,10,26,0.8)',
      backdropFilter: 'blur(4px)',
      zIndex: 50, gap: 16,
    }}>
      <Spinner size={32} />
      <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
        {text}
      </span>
    </div>
  );
}

export function SkeletonBlock({ width = '100%', height = 20, rounded = 4, style = {} }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: rounded, ...style }} />
  );
}

export function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 20,
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        fontSize: 28, fontFamily: 'var(--font-display)',
        color: 'var(--accent-primary)', letterSpacing: 3,
        fontWeight: 700,
      }}>
        GEOTENSION
      </div>
      <Spinner size={40} />
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 2 }}>
        INITIALIZING INTELLIGENCE FEED...
      </div>
    </div>
  );
}

export default Spinner;
