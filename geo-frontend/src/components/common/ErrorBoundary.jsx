import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 40, textAlign: 'center',
          color: 'var(--text-secondary)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 16,
        }}>
          <AlertTriangle size={40} color="var(--danger)" />
          <div style={{ color: 'var(--text-primary)', fontSize: 16, fontFamily: 'var(--font-display)' }}>
            Something went wrong
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {this.state.error?.message}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 8, padding: '8px 20px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-active)',
              borderRadius: 6, color: 'var(--accent-primary)',
              cursor: 'pointer', fontSize: 13,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      padding: '20px', borderRadius: 8,
      border: '1px solid rgba(255,99,72,0.3)',
      background: 'rgba(255,99,72,0.05)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <AlertTriangle size={18} color="var(--danger)" />
      <span style={{ color: 'var(--text-secondary)', flex: 1, fontSize: 13 }}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: '4px 12px', borderRadius: 4,
          background: 'rgba(255,99,72,0.1)',
          border: '1px solid rgba(255,99,72,0.3)',
          color: 'var(--danger)', cursor: 'pointer', fontSize: 12,
        }}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorBoundary;
