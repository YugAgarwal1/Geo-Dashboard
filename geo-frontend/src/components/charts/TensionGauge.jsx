import React, { useEffect, useRef } from 'react';
import { getTensionColor, getTensionLabel } from '../../utils/tensionColors';

export function TensionGauge({ score = 0, size = 180, label = 'Tension Index', animated = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const s = size * dpr;
    canvas.width = s;
    canvas.height = s * 0.65;
    canvas.style.width = size + 'px';
    canvas.style.height = (size * 0.65) + 'px';

    const cx = s / 2;
    const cy = s * 0.58;
    const r = (s / 2) * 0.82;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    let currentScore = 0;
    const targetScore = score;
    const duration = animated ? 1200 : 0;
    const startTime = performance.now();

    function draw(ts) {
      const elapsed = ts - startTime;
      const progress = animated ? Math.min(elapsed / duration, 1) : 1;
      const eased = 1 - Math.pow(1 - progress, 3);
      currentScore = eased * targetScore;

      ctx.clearRect(0, 0, s, s);

      // Background arc segments
      const segments = [
        { from: 0, to: 20, color: '#1e3a8a' },
        { from: 20, to: 40, color: '#3b82f6' },
        { from: 40, to: 60, color: '#eab308' },
        { from: 60, to: 80, color: '#f97316' },
        { from: 80, to: 100, color: '#dc2626' },
      ];

      segments.forEach(seg => {
        const sa = startAngle + (seg.from / 100) * Math.PI;
        const ea = startAngle + (seg.to / 100) * Math.PI;
        ctx.beginPath();
        ctx.arc(cx, cy, r, sa, ea);
        ctx.lineWidth = s * 0.042;
        ctx.strokeStyle = seg.color + '44';
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // Filled arc
      const fillEnd = startAngle + (currentScore / 100) * Math.PI;
      const color = getTensionColor(currentScore);
      const gradient = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
      gradient.addColorStop(0, '#1e3a8a');
      gradient.addColorStop(0.4, '#3b82f6');
      gradient.addColorStop(0.65, '#eab308');
      gradient.addColorStop(0.85, '#f97316');
      gradient.addColorStop(1, color);

      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, fillEnd);
      ctx.lineWidth = s * 0.042;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = s * 0.04;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Needle
      const needleAngle = startAngle + (currentScore / 100) * Math.PI;
      const needleLen = r * 0.72;
      const nx = cx + Math.cos(needleAngle) * needleLen;
      const ny = cy + Math.sin(needleAngle) * needleLen;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = '#e8e8f0';
      ctx.lineWidth = s * 0.012;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = s * 0.02;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.022, 0, 2 * Math.PI);
      ctx.fillStyle = '#e8e8f0';
      ctx.fill();

      // Score text
      ctx.font = `bold ${s * 0.13}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(currentScore).toString(), cx, cy * 0.55);

      // Tick marks
      for (let i = 0; i <= 10; i++) {
        const angle = startAngle + (i / 10) * Math.PI;
        const inner = r * (i % 5 === 0 ? 0.82 : 0.9);
        const outer = r * 1.02;
        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner;
        const x2 = cx + Math.cos(angle) * outer;
        const y2 = cy + Math.sin(angle) * outer;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = i % 5 === 0 ? 2 : 1;
        ctx.stroke();
      }

      if (progress < 1 && animated) requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, [score, size, animated]);

  const color = getTensionColor(score);
  const tensionLabel = getTensionLabel(score);

  return (
    <div style={{ textAlign: 'center', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <canvas ref={canvasRef} />
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)', color: color,
        letterSpacing: 2, textTransform: 'uppercase', marginTop: -8,
      }}>
        {tensionLabel}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

export default TensionGauge;
