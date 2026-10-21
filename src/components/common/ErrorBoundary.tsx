import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
            <p className="text-lg font-semibold text-foreground">
              Something went wrong
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Refresh the page or try again later.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 text-sm text-primary underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
