import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getTensionColor } from '../../utils/tensionColors';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export function TrendChart({ data = [], color = null, height = 200, label = 'Tension' }) {
  if (!data.length) return null;

  const avgScore = data.reduce((s, d) => s + d.score, 0) / data.length;
  const chartColor = color || getTensionColor(avgScore);

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label,
      data: data.map(d => d.score),
      borderColor: chartColor,
      backgroundColor: `${chartColor}18`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: chartColor,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(20,20,40,0.95)',
        borderColor: 'rgba(0,212,255,0.3)',
        borderWidth: 1,
        titleColor: '#a8a8aa',
        bodyColor: '#e8e8f0',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 13 },
        padding: 10,
        callbacks: {
          title: (items) => items[0]?.label || '',
          label: (item) => ` ${label}: ${item.raw.toFixed(1)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
        ticks: {
          color: '#555570', font: { family: 'JetBrains Mono', size: 10 },
          maxTicksLimit: 6,
          callback: (val, idx) => {
            const label = data[idx]?.date;
            if (!label) return '';
            const d = new Date(label);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          },
        },
        border: { display: false },
      },
      y: {
        min: 0, max: 100,
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: '#555570', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 5 },
        border: { display: false },
      },
    },
    animation: { duration: 800, easing: 'easeOutQuart' },
  };

  return (
    <div style={{ height, position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TrendChart;
