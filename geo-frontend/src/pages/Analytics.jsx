import React, { useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { TrendChart } from '../components/charts/TrendChart';
import { SkeletonBlock } from '../components/common/Loading';
import { getTensionColor } from '../utils/tensionColors';
import { CATEGORY_COLORS } from '../utils/constants';
import { capitalize } from '../utils/formatters';
import { TrendingUp, TrendingDown, AlertTriangle, Globe, BarChart2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

function StatPill({ label, value, color, icon: Icon, trend }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: `${color}18`, border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontFamily: 'var(--font-mono)', fontWeight: 700, color, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
      </div>
      {trend !== undefined && (
        <div style={{ marginLeft: 'auto' }}>
          {trend > 0
            ? <TrendingUp size={16} color="#dc2626" />
            : <TrendingDown size={16} color="#4ecdc4" />
          }
        </div>
      )}
    </div>
  );
}

export function Analytics() {
  const { data, loading } = useApi(() => apiService.getDashboard());
  const [activeCategory, setActiveCategory] = useState('war');

  if (loading) {
    return (
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SkeletonBlock height={40} width={200} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {Array(4).fill(0).map((_, i) => <SkeletonBlock key={i} height={80} rounded={10} />)}
        </div>
        <SkeletonBlock height={300} rounded={12} />
        <SkeletonBlock height={260} rounded={12} />
      </div>
    );
  }

  if (!data) return null;

  const { tension, top_countries } = data;
  
  // Extract country data for analysis
  const countryTensions = tension?.by_country || {};
  const topCountriesData = top_countries || [];
  
  // Calculate statistics
  const countries = Object.entries(countryTensions);
  const avgGlobalTension = countries.length > 0 
    ? (countries.reduce((sum, [, score]) => sum + score, 0) / countries.length).toFixed(1)
    : 0;
  const criticalZones = countries.filter(([, score]) => score >= 80).length;
  const highTensionZones = countries.filter(([, score]) => score >= 60 && score < 80).length;
  
  // Prepare top countries for bar chart
  const topCountriesForChart = countries
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  
  // Regional bar chart data
  const regionalData = {
    labels: topCountriesForChart.map(([country]) => country),
    datasets: [{
      data: topCountriesForChart.map(([, score]) => score),
      backgroundColor: topCountriesForChart.map(([, score]) => `${getTensionColor(score)}66`),
      borderColor: topCountriesForChart.map(([, score]) => getTensionColor(score)),
      borderWidth: 1.5,
      borderRadius: 5,
    }],
  };

  // Category analysis for top countries
  const categoryData = {
    labels: ['War', 'Geopolitics', 'Oil & Energy', 'Economic', 'Cyber'],
    datasets: topCountriesData.slice(0, 8).map((country, index) => {
      const categories = country.categories || {};
      return {
        label: country.country,
        data: [
          categories.war || 0,
          categories.geopolitics || 0,
          categories.oil_energy || 0,
          categories.economic || 0,
          categories.cyber || 0
        ],
        backgroundColor: `hsl(${index * 45}, 70%, 50%)`,
        borderColor: `hsl(${index * 45}, 70%, 40%)`,
        borderWidth: 1,
        borderRadius: 3,
      };
    }),
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true, 
        position: 'top',
        labels: { color: '#888', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 }
      }, 
      tooltip: {
        backgroundColor: 'rgba(20,20,40,0.95)',
        borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1,
        titleColor: '#a8a8aa', bodyColor: '#e8e8f0',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        callbacks: { label: item => ` Tension: ${item.raw}` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#888', font: { family: 'Inter', size: 12 } }, border: { display: false } },
      y: { min: 0, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555570', maxTicksLimit: 5 }, border: { display: false } },
    },
    animation: { duration: 800 },
  };

  const categoryOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: { color: '#888', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 }
      },
      tooltip: {
        backgroundColor: 'rgba(20,20,40,0.95)',
        borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1,
        titleColor: '#a8a8aa', bodyColor: '#e8e8f0',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#888', font: { family: 'Inter', size: 12 } }, border: { display: false } },
      y: { min: 0, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555570', maxTicksLimit: 5 }, border: { display: false } },
    },
    animation: { duration: 800 },
  };

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          Geopolitical Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Real-time analysis of global tensions and country-specific threat assessments
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatPill icon={BarChart2} label="Avg Global Tension" value={avgGlobalTension} color="#f97316" />
        <StatPill icon={AlertTriangle} label="Critical Zones" value={criticalZones} color="#dc2626" trend={1} />
        <StatPill icon={Globe} label="High Tension Zones" value={highTensionZones} color="#f97316" />
        <StatPill icon={TrendingUp} label="Total Countries" value={countries.length} color="#3b82f6" />
      </div>

      {/* Top Countries by Tension */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '18px', marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
          TOP 10 COUNTRIES BY TENSION LEVEL
        </div>
        <div style={{ height: 280 }}>
          <Bar data={regionalData} options={barOptions} />
        </div>
      </div>

      {/* Category Breakdown for Top Countries */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '18px', marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
          CATEGORY BREAKDOWN FOR TOP 8 COUNTRIES
        </div>
        <div style={{ height: 320 }}>
          <Bar data={categoryData} options={categoryOptions} />
        </div>
      </div>

      {/* Detailed Country Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top Countries Details */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, fontFamily: 'var(--font-mono)' }}>
            TOP COUNTRIES DETAILED ANALYSIS
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 320 }} className="custom-scroll">
            {topCountriesData.slice(0, 10).map((country, i) => {
              const tension = country.total_tension || 0;
              const color = getTensionColor(tension);
              return (
                <div key={country.country} style={{
                  padding: '12px 18px', borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        #{i + 1}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {country.country}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700, color: color,
                      fontSize: 14, flexShrink: 0,
                    }}>
                      {tension}
                    </span>
                  </div>
                  
                  {/* Category bars */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {Object.entries(country.categories || {}).map(([cat, score]) => {
                      const catColor = CATEGORY_COLORS[cat] || '#888';
                      return (
                        <div key={cat} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '2px 6px', borderRadius: 4, background: `${catColor}15`,
                          border: `1px solid ${catColor}33`
                        }}>
                          <span style={{ fontSize: 9, color: catColor, textTransform: 'capitalize' }}>
                            {cat}
                          </span>
                          <span style={{ fontSize: 9, color: catColor, fontFamily: 'var(--font-mono)' }}>
                            {score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tension Distribution */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '18px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
            TENSION DISTRIBUTION
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { range: 'Critical (80-100)', count: criticalZones, color: '#dc2626' },
              { range: 'High (60-79)', count: highTensionZones, color: '#f97316' },
              { range: 'Medium (40-59)', count: countries.filter(([, score]) => score >= 40 && score < 60).length, color: '#eab308' },
              { range: 'Low (20-39)', count: countries.filter(([, score]) => score >= 20 && score < 40).length, color: '#22c55e' },
              { range: 'Minimal (0-19)', count: countries.filter(([, score]) => score < 20).length, color: '#3b82f6' },
            ].map(({ range, count, color }) => {
              const percentage = countries.length > 0 ? (count / countries.length * 100).toFixed(1) : 0;
              return (
                <div key={range} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 120 }}>{range}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: color, 
                      borderRadius: 4,
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: color, fontFamily: 'var(--font-mono)', width: 30, textAlign: 'right' }}>
                    {count}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', width: 35, textAlign: 'right' }}>
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
