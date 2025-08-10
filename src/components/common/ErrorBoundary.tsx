import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export type ErrorBoundaryFallbackProps = {
  error: Error | null;
  reset: () => void;
};

export type ErrorBoundaryProps = {
  /**
   * Provide either:
   *  - a React.ReactNode fallback component (rendered as-is), or
   *  - a render function that receives {error, reset}
   */
  fallback?: React.ReactNode | ((props: ErrorBoundaryFallbackProps) => React.ReactNode);

  /**
   * Called when an error is caught. Useful to forward error to logging services.
   */
  onError?: (error: Error, info: { componentStack: string }) => void;

  /**
   * When `resetKey` changes, the boundary will automatically reset.
   * Useful to reset when navigation route changes, user logs in/out, etc.
   */
  resetKey?: unknown;

  children: React.ReactNode;
};

type State = {
  error: Error | null;
  info: { componentStack: string } | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  state: State = { error: null, info: null };

  // Expose reset method for parent refs
  reset = () => this.setState({ error: null, info: null });

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render shows the fallback UI.
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const { onError } = this.props;
    const componentStack = info?.componentStack ?? '';

    this.setState({ error, info: { componentStack } });

    // Make best-effort: call logger if provided; otherwise console.error
    try {
      if (onError) onError(error, { componentStack });
      else console.error('ErrorBoundary caught an error:', error, componentStack);
    } catch (e) {
      // Swallow logging errors to avoid infinite loops

      console.error('Error in ErrorBoundary.onError handler', e);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset the boundary automatically when resetKey changes
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.reset();
    }
  }

  renderFallback() {
    const { fallback } = this.props;
    const { error } = this.state;

    const reset = this.reset;

    if (!fallback) {
      // Default fallback UI
      return (
        <View style={styles.defaultContainer}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            An unexpected error occurred. Try restarting the app or contact support.
          </Text>
          <Button title="Try again" onPress={reset} />
        </View>
      );
    }

    if (typeof fallback === 'function') {
      return fallback({ error, reset });
    }

    return fallback;
  }

  render() {
    if (this.state.error) {
      return this.renderFallback();
    }

    return <>{this.props.children}</>;
  }
}

const styles = StyleSheet.create({
  defaultContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default ErrorBoundary;
