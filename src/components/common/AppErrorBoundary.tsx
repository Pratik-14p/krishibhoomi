import React from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

/** Keeps a rendering failure in a visible, recoverable screen. */
export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || error?.name || 'Unknown render error' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Log the actual exception and component stack so local development failures can be diagnosed.
    console.error('[Krishibhoomi] A page failed to render:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <main role="alert" className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-6">
          <section className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-[#37474F]">This page could not be displayed</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your page encountered an unexpected problem. Reload to try again. Any information already saved to your account is unchanged.
            </p>
            {import.meta.env.DEV && this.state.errorMessage && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-semibold text-red-700">Technical details (development)</summary>
                <pre className="mt-2 whitespace-pre-wrap break-words rounded bg-gray-50 p-3 text-xs text-red-800">{this.state.errorMessage}</pre>
              </details>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#2E7D32] px-5 py-3 text-sm font-bold text-white"
            >
              Reload page
            </button>
          </section>
        </main>
      );
    }
    return (this as React.Component<Props, State>).props.children;
  }
}
