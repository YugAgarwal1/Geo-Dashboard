import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Search, RefreshCw, Activity, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTensionColor, getTensionLabel } from '../../utils/tensionColors';
import { formatDateTime } from '../../utils/formatters';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/news', label: 'News' },
  { to: '/analytics', label: 'Analytics' },
];

export function Header() {
  const { globalTension, lastUpdated, refresh, loading } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/country/${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const tensionColor = getTensionColor(globalTension || 0);
  const tensionLabel = getTensionLabel(globalTension || 0);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,26,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 60,
      display: 'flex', alignItems: 'center', gap: 20,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        textDecoration: 'none', flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #00d4ff22, #00d4ff44)',
          border: '1px solid rgba(0,212,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Globe size={16} color="#00d4ff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 16, color: 'var(--text-primary)', letterSpacing: 1,
        }}>
          GEO<span style={{ color: 'var(--accent-primary)' }}>TENSION</span>
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 4, flex: 1 }} className="desktop-nav">
        {NAV_LINKS.map(link => (
          <Link key={link.to} to={link.to} style={{
            padding: '6px 14px', borderRadius: 6, textDecoration: 'none',
            fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
            color: location.pathname === link.to ? 'var(--accent-primary)' : 'var(--text-secondary)',
            background: location.pathname === link.to ? 'rgba(0,212,255,0.08)' : 'transparent',
            border: location.pathname === link.to ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
          }}>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Global Tension Index */}
      {globalTension != null && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', borderRadius: 6,
          background: `${tensionColor}15`,
          border: `1px solid ${tensionColor}40`,
          flexShrink: 0,
        }}>
          <Activity size={12} color={tensionColor} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: tensionColor, fontWeight: 500 }}>
            {globalTension.toFixed(1)}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tensionLabel}</span>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} style={{ position: 'relative', flexShrink: 0 }}>
        <Search size={14} color="var(--text-muted)" style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
        }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search country..."
          style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '6px 12px 6px 30px',
            color: 'var(--text-primary)', fontSize: 12, width: 160,
            outline: 'none', transition: 'border 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </form>

      {/* Last Updated + Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {lastUpdated && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {formatDateTime(lastUpdated)}
          </span>
        )}
        <button onClick={refresh} disabled={loading} style={{
          width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)', transition: 'all 0.2s',
          opacity: loading ? 0.5 : 1,
        }}>
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none', width: 32, height: 32, borderRadius: 6,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)',
        }}
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 60, left: 0, right: 0,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 99,
        }}>
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{
              padding: '10px 14px', borderRadius: 6, textDecoration: 'none',
              fontSize: 14, color: location.pathname === link.to ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

export default Header;
