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
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', background: '#fee2e2', color: '#991b1b', minHeight: '100vh'}}>
          <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>React Error Boundary</h1>
          <pre style={{whiteSpace: 'pre-wrap', marginTop: '10px'}}>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{whiteSpace: 'pre-wrap', marginTop: '10px', fontSize: '12px'}}>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
