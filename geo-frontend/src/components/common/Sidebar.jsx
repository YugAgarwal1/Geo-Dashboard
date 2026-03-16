import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Newspaper, BarChart3,
  Activity, TrendingUp, TrendingDown, Minus, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTensionColor, getTensionLevel } from '../../utils/tensionColors';
import { formatTensionScore } from '../../utils/formatters';
import clsx from 'clsx';

const NAV_LINKS = [
  { path: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tensions',  label: 'Tensions',  icon: Globe            },
  { path: '/news',      label: 'News',      icon: Newspaper        },
  { path: '/analytics', label: 'Analytics', icon: BarChart3        },
];

const TrendIcon = ({ score }) => {
  if (score > 60) return <TrendingUp size={12} className="text-red-400" />;
  if (score > 40) return <Minus size={12} className="text-yellow-400" />;
  return <TrendingDown size={12} className="text-green-400" />;
};

const Sidebar = ({ collapsed = false }) => {
  const { dashboard } = useApp();
  const topCountries = dashboard?.top_countries?.slice(0, 8) || [];
  const globalTension = dashboard?.tension?.global_tension_index ?? null;

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col shrink-0 h-full overflow-y-auto transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{ background: 'rgba(26,26,46,0.5)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Global Tension Index */}
      {!collapsed && globalTension !== null && (
        <div className="p-4 border-b border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Global Index</p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity size={14} style={{ color: getTensionColor(globalTension) }} className="animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Tension Level</span>
            </div>
            <span className="text-lg font-bold" style={{ color: getTensionColor(globalTension) }}>
              {formatTensionScore(globalTension)}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${globalTension}%`, background: getTensionColor(globalTension) }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{getTensionLevel(globalTension)}</p>
        </div>
      )}

      {/* Top Hotspots */}
      {!collapsed && topCountries.length > 0 && (
        <div className="p-4 flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium flex items-center gap-2">
            <TrendingUp size={12} />
            Top Hotspots
          </p>
          <div className="space-y-1">
            {topCountries.map((country, idx) => {
              const score = country.tension_score ?? country.total_tension ?? 0;
              const color = getTensionColor(score);
              return (
                <NavLink
                  key={country.country}
                  to={`/country/${encodeURIComponent(country.country)}`}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-xs font-mono text-gray-600 w-4 text-center">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                      {country.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon score={score} />
                    <span className="text-xs font-bold" style={{ color }}>{Math.round(score)}</span>
                  </div>
                  {/* Score bar */}
                  <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Collapsed icons only nav */}
      {collapsed && (
        <nav className="flex flex-col items-center gap-2 p-2 mt-4">
          {NAV_LINKS.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/'}
              title={label}
              className={({ isActive }) => clsx(
                'p-2.5 rounded-lg transition-colors',
                isActive ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'
              )}>
              <Icon size={18} />
            </NavLink>
          ))}
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
