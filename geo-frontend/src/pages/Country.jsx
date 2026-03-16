import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Globe } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { TensionGauge } from '../components/charts/TensionGauge';
import { TrendChart } from '../components/charts/TrendChart';
import { CategoryBarChart, CategoryRadarChart } from '../components/charts/CategoryChart';
import { NewsCard } from '../components/news/NewsCard';
import { CountryCard } from '../components/country/CountryCard';
import { SkeletonBlock } from '../components/common/Loading';
import { getTensionColor, getTensionLabel } from '../utils/tensionColors';
import { countryToFlag } from '../utils/formatters';
import { CATEGORY_COLORS } from '../utils/constants';

export function Country() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { data: country, loading } = useApi(() => apiService.getCountry(name), [name]);

  if (loading) {
    return (
      <div style={{ padding: '20px 24px' }}>
        <SkeletonBlock height={40} width={200} style={{ marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {Array(4).fill(0).map((_, i) => <SkeletonBlock key={i} height={200} rounded={12} />)}
        </div>
      </div>
    );
  }

  if (!country) return null;

  const color = getTensionColor(country.total_tension);
  const flag = countryToFlag(country.country);
  const cats = country.categories || {};
  const conflicts = country.conflicts || {};
  const articlesByCategory = country.articles_by_category || {};
  const recentArticles = country.recent_articles || [];

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
        background: 'none', border: 'none', color: 'var(--text-secondary)',
        cursor: 'pointer', fontSize: 13, padding: '4px 0',
      }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Country Header */}
      <div style={{
        background: `linear-gradient(135deg, ${color}12, var(--bg-card))`,
        border: `1px solid ${color}33`,
        borderRadius: 14, padding: '24px 28px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 52 }}>{flag}</span>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 32,
              fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1,
            }}>
              {country.country}
            </h1>
            <div style={{
              fontSize: 12, color, fontFamily: 'var(--font-mono)',
              letterSpacing: 2, marginTop: 4, textTransform: 'uppercase',
            }}>
              {getTensionLabel(country.total_tension)} — Risk Level
            </div>
            {country.region && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Globe size={11} /> {country.region}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <TensionGauge score={country.total_tension} size={160} label="Tension Index" />
          <button style={{
            padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Category Bar Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '18px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
            CATEGORY BREAKDOWN
          </div>
          <CategoryBarChart categories={cats} height={200} />

          {/* Category detail list */}
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(cats).sort(([,a],[,b]) => b-a).map(([cat, val]) => {
              const c = CATEGORY_COLORS[cat] || '#888';
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: c, width: 80, textTransform: 'capitalize', flexShrink: 0 }}>{cat}</span>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: c, borderRadius: 3, boxShadow: `0 0 8px ${c}55` }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: c, width: 28, textAlign: 'right', fontWeight: 600 }}>{val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conflicts */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '18px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
            BILATERAL TENSIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(conflicts).slice(0, 6).map(([pair, score]) => {
              const [country1, country2] = pair.split('-');
              const isCurrentCountry = pair.includes(country.country);
              return (
                <div key={pair} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: 6, background: isCurrentCountry ? `${color}15` : 'var(--bg-elevated)',
                  border: isCurrentCountry ? `1px solid ${color}33` : '1px solid var(--border)'
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {country1} — {country2}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: getTensionColor(score),
                    fontWeight: 600
                  }}>
                    {score}
                  </span>
                </div>
              );
            })}
            {Object.keys(conflicts).length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '20px' }}>
                No direct conflicts detected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles by Category */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
        {Object.entries(articlesByCategory).map(([category, articles]) => (
          <div key={category} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '18px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
              {category.toUpperCase()} ({articles.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {articles.slice(0, 3).map((article, idx) => (
                <div key={idx} style={{
                  padding: '8px', borderRadius: 6, background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)', fontSize: 11, lineHeight: 1.3
                }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {article.title.length > 80 ? article.title.substring(0, 80) + '...' : article.title}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                    {article.source}
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'center', padding: '20px' }}>
                  No articles in this category
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>
            Recent Intelligence ({recentArticles.length})
          </span>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentArticles.length > 0
            ? recentArticles.map((article, idx) => (
                <div key={idx} style={{
                  padding: '12px', borderRadius: 8, background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6, fontSize: 13 }}>
                    {article.title}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 4 }}>
                    {article.source} • {article.countries?.join(', ') || 'No countries'}
                  </div>
                  {article.context && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.4 }}>
                      {article.context.length > 150 ? article.context.substring(0, 150) + '...' : article.context}
                    </div>
                  )}
                </div>
              ))
            : <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No recent articles</div>
          }
        </div>
      </div>
    </div>
  );
}

export default Country;
