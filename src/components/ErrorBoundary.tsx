// ErrorBoundary: uses a class component (required by React for error boundaries)
// We use a wrapper pattern to avoid TypeScript class field issues with this tsconfig
import React from 'react';

type EBState = {
  hasError: boolean;
  error: Error | null;
  stack: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createErrorBoundaryClass(): any {
  return class EB extends React.Component<{ children: React.ReactNode }, EBState> {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      (this as any).state = { hasError: false, error: null, stack: null } as EBState;
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error, stack: null };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      console.error('[ErrorBoundary]', error);
      (this as any).setState({ stack: info.componentStack });
    }

    render() {
      const state = (this as any).state as EBState;
      if (state.hasError) {
        return (
          <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ maxWidth: '560px', width: '100%', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '24px', padding: '2rem', fontFamily: 'sans-serif' }}>
              <h1 style={{ color: '#b91c1c', fontWeight: 900, marginBottom: '0.5rem' }}>🚨 Runtime Error</h1>
              <p style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                {state.error?.message || 'Unknown error'}
              </p>
              <pre style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem', fontSize: '11px', color: '#7f1d1d', overflowX: 'auto', maxHeight: '200px', whiteSpace: 'pre-wrap' }}>
                {state.stack || state.error?.stack}
              </pre>
              <button
                onClick={() => (this as any).setState({ hasError: false, error: null, stack: null })}
                style={{ marginTop: '1rem', background: '#000', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '12px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Try to Recover
              </button>
            </div>
          </div>
        );
      }
      return (this as any).props.children;
    }
  };
}

export const ErrorBoundary = createErrorBoundaryClass() as React.ComponentType<{ children: React.ReactNode }>;
