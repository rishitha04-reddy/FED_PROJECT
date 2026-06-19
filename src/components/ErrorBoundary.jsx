// React Error Boundary component mapping to CO4: Error Boundaries in React & CO2: JS Error Boundaries
// Catches crashes in the rendering pipeline of child components.

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '3rem 2rem',
          maxWidth: '550px',
          margin: '4rem auto',
          textAlign: 'center',
          border: '1.5px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(239, 68, 68, 0.03)'
        }} className="glass-card animate-fade-in">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={36} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Something went wrong
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                The application encountered an unexpected rendering error. This could be due to a network interruption or minor code anomaly.
              </p>
            </div>

            {this.state.error && (
              <pre style={{
                width: '100%',
                overflowX: 'auto',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--danger)',
                fontSize: '0.8rem',
                textAlign: 'left',
                border: '1px solid var(--border-color)',
                fontFamily: 'monospace'
              }}>
                {this.state.error.toString()}
              </pre>
            )}

            <button 
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                fontSize: '0.95rem'
              }}
            >
              <RefreshCw size={16} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
