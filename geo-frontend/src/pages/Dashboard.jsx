import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorldMap } from '../components/map/WorldMap';
import { CountryCard } from '../components/country/CountryCard';
import { CountryModal } from '../components/country/CountryModal';
import { NewsFeed } from '../components/news/NewsFeed';
import { TensionGauge } from '../components/charts/TensionGauge';
import { SkeletonBlock } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorBoundary';
import { Activity, Globe, Newspaper, TrendingUp, AlertTriangle, BarChart3, X } from 'lucide-react';
import { CATEGORY_COLORS } from '../utils/constants';

// Helper function to get category color
const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#888';
};

function StatCard({ icon: Icon, label, value, color = 'var(--accent-primary)', sub }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${color}18`, border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontFamily: 'var(--font-mono)', fontWeight: 700, color, lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', opacity: 0.7 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { dashboardData, loading, error, refresh } = useApp();
  const [modalCountry, setModalCountry] = useState(null);
  const [chartsModalOpen, setChartsModalOpen] = useState(false);

  // Extract data from backend response structure
  const tensionData = dashboardData?.tension || {};
  const countriesByTension = tensionData.by_country || {};
  const topCountries = dashboardData?.top_countries || [];
  const news = dashboardData?.news || [];
  
  // Convert tension data to array for map (sorted by tension for color mapping)
  const countries = Object.entries(countriesByTension)
    .map(([name, tension]) => ({
      name,
      tension_score: tension,
      // Add default categories for compatibility
      categories: { war: 0, geopolitics: 0, oil: 0, economic: 0, cyber: 0, markets: 0 }
    }))
    .sort((a, b) => b.tension_score - a.tension_score); // Sort high to low for color mapping
    
  const criticalCount = countries.filter(c => c.tension_score > 80).length;
  const highCount = countries.filter(c => c.tension_score > 60 && c.tension_score <= 80).length;

  if (error) return (
    <div style={{ padding: 24 }}>
      <ErrorMessage message={error} onRetry={refresh} />
    </div>
  );

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <StatCard icon={AlertTriangle} label="Critical Zones" value={loading ? '—' : criticalCount} color="#dc2626" sub="Score > 80" />
        <StatCard icon={TrendingUp} label="High Tension" value={loading ? '—' : highCount} color="#f97316" sub="Score 61–80" />
        <StatCard icon={Globe} label="Monitored Countries" value={loading ? '—' : countries.length} color="#00d4ff" />
        <StatCard icon={Newspaper} label="Active Alerts" value={loading ? '—' : news.length} color="#4ecdc4" />
        <StatCard icon={BarChart3} label="Top Tension Zones" value={loading ? '—' : topCountries.length} color="#a855f7" sub="Highest Risk" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
        {/* Map */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={15} color="var(--accent-primary)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                Global Tension Map
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Click a marker for details
            </span>
          </div>
          <div style={{ height: 440 }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SkeletonBlock width="100%" height="100%" rounded={0} />
              </div>
            ) : (
              <WorldMap
                countries={countries}
                onCountryClick={setModalCountry}
                selectedCountry={modalCountry}
              />
            )}
          </div>
        </div>

        {/* Right: Top Countries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Top Countries */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                🔥 Top Tension Zones
              </span>
            </div>
            <div style={{ maxHeight: 380, overflowY: 'auto' }} className="custom-scroll">
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {loading ? Array(8).fill(0).map((_, i) => (
                  <SkeletonBlock key={i} height={40} rounded={8} />
                )) : topCountries.map((c, i) => (
                  <CountryCard key={c.name} country={c} rank={i + 1} compact onClick={setModalCountry} />
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Button */}
          <button
            onClick={() => setChartsModalOpen(true)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.2s', fontFamily: 'var(--font-display)',
              fontWeight: 600, fontSize: 13, color: 'var(--text-primary)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#a855f744';
              e.currentTarget.style.background = 'var(--bg-elevated)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <BarChart3 size={16} color="#a855f7" />
            View Country Analytics
          </button>
        </div>
      </div>

      {/* Country Analytics Section */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BarChart3 size={16} color="#a855f7" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
              Country Tension Analytics
            </span>
          </div>
          <button
            onClick={() => setChartsModalOpen(true)}
            style={{
              background: '#a855f7', color: 'white', border: 'none',
              borderRadius: 6, padding: '6px 12px', fontSize: 11,
              cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 600,
            }}
          >
            EXPAND ANALYTICS
          </button>
        </div>
        <div style={{ padding: '20px' }}>
          {loading ? (
            <SkeletonBlock width="100%" height={200} rounded={8} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {topCountries.slice(0, 6).map((country, index) => (
                <div key={country.name} style={{
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{country.name}</span>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', fontWeight: 700, 
                      color: country.total_tension > 80 ? '#dc2626' : 
                             country.total_tension > 60 ? '#f97316' : '#22c55e'
                    }}>
                      {country.total_tension}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                    Categories Breakdown:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {Object.entries(country.categories || {}).map(([category, score]) => (
                      <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ 
                          width: 8, height: 8, borderRadius: '50%',
                          background: getCategoryColor(category)
                        }} />
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', flex: 1 }}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                          {score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* News Feed */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Newspaper size={15} color="var(--accent-primary)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
              Latest Intelligence
            </span>
          </div>
          <a href="/news" style={{ fontSize: 12, color: 'var(--accent-primary)', textDecoration: 'none' }}>
            View All →
          </a>
        </div>
        <div style={{ padding: '14px 18px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array(3).fill(0).map((_, i) => <SkeletonBlock key={i} height={80} rounded={10} />)}
            </div>
          ) : (
            <NewsFeed articles={news} maxItems={6} showFilter={false} />
          )}
        </div>
      </div>

      {modalCountry && (
        <CountryModal country={modalCountry} onClose={() => setModalCountry(null)} />
      )}

      {/* Charts Modal */}
      {chartsModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}>
          <div style={{
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            borderRadius: 16, maxWidth: '90vw', maxHeight: '90vh',
            width: '900px', height: '700px', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <BarChart3 size={20} color="#a855f7" />
                <div>
                  <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' }}>
                    Country Tension Analytics
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Detailed breakdown of tension by country and category
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChartsModalOpen(false)}
                style={{
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  borderRadius: 8, width: 32, height: 32, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {topCountries.map((country, index) => (
                  <div key={country.name} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '16px',
                  }}>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)'
                    }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                          #{index + 1} {country.name}
                        </h3>
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                          Total Tension Score
                        </p>
                      </div>
                      <div style={{
                        background: country.total_tension > 80 ? '#dc2626' : 
                                   country.total_tension > 60 ? '#f97316' : '#22c55e',
                        color: 'white', borderRadius: 8, padding: '8px 12px',
                        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18,
                      }}>
                        {country.total_tension}
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Category Breakdown
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {Object.entries(country.categories || {}).map(([category, score]) => (
                          <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ 
                              width: 10, height: 10, borderRadius: '50%',
                              background: getCategoryColor(category), flexShrink: 0
                            }} />
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>
                              {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{
                                width: 60, height: 4, background: 'var(--bg-tertiary)',
                                borderRadius: 2, overflow: 'hidden',
                              }}>
                                <div style={{
                                  width: `${Math.min((score / 100) * 60, 60)}px`, height: '100%',
                                  background: getCategoryColor(category),
                                }} />
                              </div>
                              <span style={{ 
                                fontSize: 11, fontFamily: 'var(--font-mono)', 
                                color: 'var(--text-primary)', minWidth: 25, textAlign: 'right'
                              }}>
                                {score}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', gap: 6, flexWrap: 'wrap',
                      paddingTop: 8, borderTop: '1px solid var(--border)'
                    }}>
                      {Object.entries(country.categories || {}).map(([category, score]) => (
                        <span key={category} style={{
                          background: `${getCategoryColor(category)}20`, 
                          color: getCategoryColor(category),
                          border: `1px solid ${getCategoryColor(category)}40`,
                          borderRadius: 4, padding: '2px 6px', fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {category}: {score}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
