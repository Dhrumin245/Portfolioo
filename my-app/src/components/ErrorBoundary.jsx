import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            color: '#e2e8f0',
            backgroundColor: '#0b0f19',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f87171' }}>
            Something went wrong displaying this page.
          </h2>
          <p style={{ maxWidth: '500px', marginBottom: '1.5rem', color: '#94a3b8' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <a
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#00d4ff',
              color: '#0b0f19',
              borderRadius: '6px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Return to Home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
