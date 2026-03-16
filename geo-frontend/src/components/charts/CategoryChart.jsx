import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
  RadialLinearScale, PointElement, LineElement, Filler,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { CATEGORY_COLORS } from '../../utils/constants';
import { capitalize } from '../../utils/formatters';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Tooltip,
  RadialLinearScale, PointElement, LineElement, Filler
);

export function CategoryBarChart({ categories = {}, height = 200 }) {
  const labels = Object.keys(categories).map(capitalize);
  const values = Object.values(categories);
  const colors = Object.keys(categories).map(k => CATEGORY_COLORS[k] || '#00d4ff');

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors.map(c => `${c}55`),
      borderColor: colors,
      borderWidth: 1.5,
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(20,20,40,0.95)',
        borderColor: 'rgba(0,212,255,0.2)',
        borderWidth: 1,
        titleColor: '#a8a8aa',
        bodyColor: '#e8e8f0',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 13 },
        padding: 10,
        callbacks: { label: item => ` Score: ${item.raw}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#888', font: { family: 'Inter', size: 11 } },
        border: { display: false },
      },
      y: {
        min: 0, max: 100,
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: '#555570', font: { size: 10 }, maxTicksLimit: 5 },
        border: { display: false },
      },
    },
    animation: { duration: 800 },
  };

  return (
    <div style={{ height, position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export function CategoryRadarChart({ categories = {}, height = 260 }) {
  const labels = Object.keys(categories).map(capitalize);
  const values = Object.values(categories);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: 'rgba(0,212,255,0.08)',
      borderColor: '#00d4ff',
      borderWidth: 2,
      pointBackgroundColor: '#00d4ff',
      pointBorderColor: '#fff',
      pointBorderWidth: 1.5,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: 'rgba(20,20,40,0.95)',
      borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1,
      titleColor: '#a8a8aa', bodyColor: '#e8e8f0',
      titleFont: { family: 'JetBrains Mono', size: 11 },
      bodyFont: { family: 'JetBrains Mono', size: 13 },
    }},
    scales: {
      r: {
        min: 0, max: 100,
        grid: { color: 'rgba(255,255,255,0.06)' },
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        ticks: { display: false, stepSize: 25 },
        pointLabels: {
          color: '#888', font: { family: 'Inter', size: 11 },
        },
      },
    },
    animation: { duration: 800 },
  };

  return (
    <div style={{ height, position: 'relative' }}>
      <Radar data={data} options={options} />
    </div>
  );
}

export default CategoryBarChart;
