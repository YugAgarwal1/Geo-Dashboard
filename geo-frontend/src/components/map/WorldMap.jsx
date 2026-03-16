import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getTensionColor } from '../../utils/tensionColors';
import { TensionLegend } from './TensionLegend';
import { Spinner } from '../common/Loading';

// Country centroids for displaying markers
const COUNTRY_CENTROIDS = {
  'Russia': [61.5, 105.3], 'Ukraine': [48.4, 31.2], 'Israel': [31.0, 35.0],
  'Iran': [32.4, 53.7], 'North Korea': [40.3, 127.5], 'China': [35.9, 104.2],
  'Taiwan': [23.7, 121.0], 'Pakistan': [30.4, 69.3], 'Syria': [34.8, 38.9],
  'Yemen': [15.6, 48.5], 'Sudan': [12.9, 30.2], 'Myanmar': [19.2, 96.7],
  'Venezuela': [6.4, -66.6], 'Ethiopia': [9.1, 40.5], 'Turkey': [38.9, 35.2],
  'India': [20.6, 78.9], 'United States': [37.1, -95.7], 'Saudi Arabia': [23.9, 45.1],
  'Nigeria': [9.1, 8.7], 'Libya': [26.3, 17.2],
  // Additional countries from backend
  'US': [37.1, -95.7], 'U.S.': [37.1, -95.7], 'the United States': [37.1, -95.7],
  'The United States\'': [37.1, -95.7], 'WASHINGTON': [38.9, -77.0], 'Washington': [38.9, -77.0],
  'UK': [55.4, -3.4], 'Britain': [55.4, -3.4], 'London': [51.5, -0.1],
  'Dubai': [25.3, 55.5], 'the United Arab Emirates': [24.0, 54.0], 'UAE': [24.0, 54.0],
  'Qatar': [25.4, 51.2], 'Fujairah': [25.1, 56.3], 'Oman': [21.5, 55.9],
  'Tehran': [35.7, 51.4], 'Lebanon': [33.9, 35.5], 'Iraq': [33.2, 44.4],
  'Afghanistan': [33.9, 67.7], 'Pakistan': [30.4, 69.3], 'Islamabad': [33.7, 73.0],
  'Saudi Arabia': [23.9, 45.1], 'Canada': [56.1, -106.3], 'Mexico': [23.6, -102.5],
  'Germany': [51.2, 10.4], 'France': [46.2, 2.2], 'Spain': [40.5, -3.7],
  'Japan': [36.2, 138.3], 'South Korea': [35.9, 127.8], 'Australia': [-25.3, 133.8],
  'Argentina': [-38.4, -63.6], 'Brazil': [-14.2, -51.9], 'South Africa': [-30.6, 22.9],
  'Egypt': [26.8, 30.8], 'Jordan': [30.6, 36.2], 'Greece': [39.1, 21.8],
  'Italy': [41.9, 12.6], 'Poland': [51.9, 19.1], 'Netherlands': [52.1, 5.3],
  'Belgium': [50.5, 4.5], 'Norway': [60.5, 8.5], 'Sweden': [60.1, 18.6],
  'Finland': [61.9, 25.7], 'Denmark': [56.3, 9.5], 'Austria': [47.5, 14.6],
  'Switzerland': [46.8, 8.2], 'Ireland': [53.4, -8.2], 'Portugal': [39.4, -8.2],
  'New Zealand': [-40.9, 174.9], 'Singapore': [1.3, 103.8], 'Malaysia': [4.2, 101.9],
  'Thailand': [15.9, 100.9], 'Vietnam': [14.1, 108.3], 'Philippines': [12.9, 121.8],
  'Indonesia': [-0.8, 113.9], 'Bangladesh': [23.7, 90.4], 'Sri Lanka': [7.9, 80.7],
  'Nepal': [28.4, 84.1], 'Bhutan': [27.5, 90.4], 'Myanmar': [19.2, 96.7],
  'Cambodia': [12.6, 104.9], 'Laos': [19.9, 102.6], 'Mongolia': [46.9, 103.9],
  'Kazakhstan': [48.0, 66.9], 'Uzbekistan': [41.4, 64.6], 'Turkmenistan': [38.9, 59.6],
  'Kyrgyzstan': [41.2, 74.6], 'Tajikistan': [38.5, 71.2], 'Armenia': [40.1, 45.0],
  'Georgia': [42.3, 43.4], 'Azerbaijan': [40.1, 47.6], 'Belarus': [53.7, 27.9],
  'Ukraine': [48.4, 31.2], 'Moldova': [47.0, 28.9], 'Romania': [45.9, 25.0],
  'Bulgaria': [42.7, 25.5], 'Serbia': [44.8, 20.5], 'Hungary': [47.2, 19.5],
  'Czech Republic': [49.8, 15.5], 'Slovakia': [48.7, 19.7], 'Lithuania': [55.2, 23.9],
  'Latvia': [56.9, 24.6], 'Estonia': [58.7, 25.0], 'Croatia': [45.2, 15.5],
  'Slovenia': [46.1, 14.5], 'Bosnia': [43.9, 17.7], 'Montenegro': [42.7, 19.4],
  'Albania': [41.1, 20.0], 'Macedonia': [41.6, 21.7], 'Greece': [39.1, 21.8],
  'Turkey': [38.9, 35.2], 'Cyprus': [35.0, 33.0], 'Malta': [35.9, 14.4],
  'Tunisia': [33.9, 9.5], 'Algeria': [28.0, 1.7], 'Morocco': [31.8, -7.1],
  'Libya': [26.3, 17.2], 'Egypt': [26.8, 30.8], 'Sudan': [12.9, 30.2],
  'Ethiopia': [9.1, 40.5], 'Eritrea': [15.3, 39.5], 'Djibouti': [11.8, 42.6],
  'Somalia': [5.2, 46.2], 'Kenya': [-0.0, 37.9], 'Uganda': [1.4, 32.4],
  'Tanzania': [-6.3, 34.9], 'Rwanda': [-1.9, 29.9], 'Burundi': [-3.4, 29.9],
  'Congo': [-4.0, 21.8], 'DR Congo': [-4.0, 21.8], 'Angola': [-11.2, 17.9],
  'Zambia': [-13.1, 27.8], 'Malawi': [-13.3, 34.3], 'Mozambique': [-18.7, 35.5],
  'Zimbabwe': [-19.0, 29.2], 'Botswana': [-22.3, 24.7], 'Namibia': [-22.6, 17.1],
  'South Africa': [-30.6, 22.9], 'Lesotho': [-29.6, 28.2], 'Eswatini': [-26.5, 31.5],
  'Madagascar': [-20.2, 46.9], 'Mauritius': [-20.3, 57.6], 'Comoros': [-11.9, 43.7],
  'Seychelles': [-4.7, 55.5], 'Cape Verde': [16.0, -24.0], 'Guinea-Bissau': [11.8, -15.2],
  'Guinea': [10.0, -10.3], 'Sierra Leone': [8.5, -11.8], 'Liberia': [6.4, -9.4],
  'Ivory Coast': [7.5, -5.5], 'Ghana': [7.9, -1.0], 'Togo': [8.6, 0.8],
  'Benin': [9.3, 2.3], 'Nigeria': [9.1, 8.7], 'Cameroon': [3.8, 11.5],
  'Chad': [15.3, 18.7], 'Niger': [17.6, 8.1], 'Mali': [17.6, -3.4],
  'Burkina Faso': [12.2, -1.6], 'Senegal': [14.5, -14.5], 'Gambia': [13.4, -15.3],
  'Guinea': [10.0, -10.3], 'Sierra Leone': [8.5, -11.8], 'Liberia': [6.4, -9.4],
  'Mexico': [23.6, -102.5], 'Guatemala': [15.8, -90.2], 'Belize': [17.2, -88.5],
  'Honduras': [14.8, -86.2], 'El Salvador': [13.8, -88.9], 'Nicaragua': [12.9, -85.2],
  'Costa Rica': [9.7, -83.8], 'Panama': [8.5, -80.8], 'Cuba': [21.5, -77.8],
  'Jamaica': [18.1, -77.3], 'Haiti': [18.9, -72.3], 'Dominican Republic': [18.7, -70.2],
  'Puerto Rico': [18.2, -66.6], 'Trinidad': [10.7, -61.5], 'Barbados': [13.2, -59.6],
  'Venezuela': [6.4, -66.6], 'Colombia': [4.6, -74.1], 'Ecuador': [-1.8, -78.2],
  'Peru': [-9.2, -75.0], 'Bolivia': [-16.3, -64.7], 'Chile': [-35.7, -71.5],
  'Argentina': [-38.4, -63.6], 'Uruguay': [-32.5, -55.8], 'Paraguay': [-23.4, -58.4],
  'Brazil': [-14.2, -51.9], 'Suriname': [3.9, -56.2], 'Guyana': [4.9, -58.9],
  'French Guiana': [3.9, -53.1], 'Falkland Islands': [-51.8, -59.0],
};

export function WorldMap({ countries = [], onCountryClick, selectedCountry }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [20, 10],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 8,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    setLoading(false);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initMap;
    if (window.L) { initMap(); return; }
    document.head.appendChild(script);
    return () => { script.onload = null; };
  }, [initMap]);

  // Add country markers when countries data arrives
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map || !countries.length) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    countries.forEach(country => {
      const coords = COUNTRY_CENTROIDS[country.name];
      if (!coords) return;

      const color = getTensionColor(country.tension_score);
      const isSelected = selectedCountry?.name === country.name;
      const r = isSelected ? 14 : 8 + (country.tension_score / 100) * 8;

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:${r * 2}px; height:${r * 2}px;
            border-radius:50%;
            background:${color}55;
            border:2px solid ${color};
            box-shadow:0 0 ${isSelected ? 20 : 10}px ${color}88;
            cursor:pointer;
            transition:all 0.3s;
            display:flex; align-items:center; justify-content:center;
            font-family:'JetBrains Mono',monospace;
            font-size:${r * 0.6}px;
            color:${color};
            font-weight:bold;
          ">
            ${country.tension_score > 70 ? '!' : ''}
          </div>
        `,
        iconSize: [r * 2, r * 2],
        iconAnchor: [r, r],
      });

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .bindTooltip(`
          <div style="font-family:'Inter',sans-serif;">
            <div style="font-weight:600;color:#e8e8f0;margin-bottom:4px;">${country.name}</div>
            <div style="color:${color};font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;">
              ${country.tension_score.toFixed(1)}
            </div>
            <div style="color:#888;font-size:11px;margin-top:2px;">Tension Score</div>
          </div>
        `, { permanent: false, sticky: true, offset: [10, 0] })
        .on('click', () => onCountryClick?.(country));

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    };
  }, [countries, selectedCountry, onCountryClick]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12,
        }}>
          <Spinner size={28} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            Loading map...
          </span>
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend overlay */}
      <div style={{ position: 'absolute', bottom: 20, right: 10, zIndex: 500 }}>
        <TensionLegend compact />
      </div>

      {/* Live indicator */}
      <div style={{
        position: 'absolute', top: 10, left: 10, zIndex: 500,
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(10,10,26,0.85)',
        border: '1px solid var(--border)',
        borderRadius: 6, padding: '4px 10px',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#4ecdc4',
          boxShadow: '0 0 8px #4ecdc4',
          animation: 'pulse-glow 2s infinite',
        }} />
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          LIVE — {countries.length} ZONES
        </span>
      </div>
    </div>
  );
}

export default WorldMap;
