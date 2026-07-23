import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
          <div className="max-w-md w-full bg-white border-4 border-black rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-extrabold text-black mb-4">⚠️ The experiment could not be completed</h1>
            <p className="text-black mb-4">
              Something went wrong in the laboratory. Please reset the laboratory by refreshing the page.
            </p>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-white rounded border border-black text-xs">
                <summary className="cursor-pointer font-bold mb-2">Error Details (Dev Only)</summary>
                <pre className="overflow-auto text-black">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="overflow-auto text-black mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="w-full px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-black transition"
            >
              Reset Laboratory & Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
