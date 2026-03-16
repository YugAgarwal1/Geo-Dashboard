import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PageLoader } from './components/common/Loading';
import './styles/globals.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const News = lazy(() => import('./pages/News'));
const Country = lazy(() => import('./pages/Country'));
const Analytics = lazy(() => import('./pages/Analytics'));

function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Scan line effect */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.06), transparent)',
          animation: 'scan-line 8s linear infinite',
        }} />
      </div>

      <Header />
      <main style={{ flex: 1, position: 'relative' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-secondary)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          GEOTENSION MONITOR v1.0
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Data updates every 5 minutes · For research purposes only
        </span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ErrorBoundary>
          <AppLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/news" element={<News />} />
                <Route path="/country/:name" element={<Country />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={
                  <div style={{
                    padding: '80px 24px', textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}>
                    <div style={{ fontSize: 64, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 16 }}>404</div>
                    <div style={{ fontSize: 16, marginBottom: 24 }}>Page not found</div>
                    <a href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: 13, border: '1px solid rgba(0,212,255,0.3)', padding: '8px 20px', borderRadius: 8 }}>
                      Back to Dashboard
                    </a>
                  </div>
                } />
              </Routes>
            </Suspense>
          </AppLayout>
        </ErrorBoundary>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
