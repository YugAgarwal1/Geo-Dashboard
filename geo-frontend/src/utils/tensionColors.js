export function getTensionColor(score) {
  if (score <= 20) return '#1e3a8a';
  if (score <= 40) return '#3b82f6';
  if (score <= 60) return '#eab308';
  if (score <= 80) return '#f97316';
  return '#dc2626';
}

export function getTensionLabel(score) {
  if (score <= 20) return 'Low';
  if (score <= 40) return 'Below Average';
  if (score <= 60) return 'Moderate';
  if (score <= 80) return 'High';
  return 'Critical';
}

export function getTensionBg(score) {
  if (score <= 20) return 'rgba(30,58,138,0.15)';
  if (score <= 40) return 'rgba(59,130,246,0.15)';
  if (score <= 60) return 'rgba(234,179,8,0.15)';
  if (score <= 80) return 'rgba(249,115,22,0.15)';
  return 'rgba(220,38,38,0.15)';
}

export function getTensionGradient(score) {
  const color = getTensionColor(score);
  return `linear-gradient(135deg, ${color}33, ${color}11)`;
}

export function interpolateColor(score) {
  // More granular interpolation for maps
  const stops = [
    { at: 0, r: 30, g: 58, b: 138 },
    { at: 25, r: 59, g: 130, b: 246 },
    { at: 50, r: 234, g: 179, b: 8 },
    { at: 75, r: 249, g: 115, b: 22 },
    { at: 100, r: 220, g: 38, b: 38 },
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    if (score >= stops[i].at && score <= stops[i + 1].at) {
      const t = (score - stops[i].at) / (stops[i + 1].at - stops[i].at);
      const r = Math.round(stops[i].r + t * (stops[i + 1].r - stops[i].r));
      const g = Math.round(stops[i].g + t * (stops[i + 1].g - stops[i].g));
      const b = Math.round(stops[i].b + t * (stops[i + 1].b - stops[i].b));
      return `rgb(${r},${g},${b})`;
    }
  }
  return '#dc2626';
}
