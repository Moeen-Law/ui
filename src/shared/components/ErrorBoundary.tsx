import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import ErrorFallback from "./ErrorFallback";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  /**
   * Optional custom message to show when an error occurs
   */
  message?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A generic Error Boundary component to catch JavaScript errors anywhere in 
 * their child component tree, log those errors, and display a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  /**
   * Update state so the next render will show the fallback UI.
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Catch errors in any components below and log them.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group("🔴 App Error Boundary Caught an Error");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.groupEnd();
    
    // You could also log the error to an error reporting service here
  }

  /**
   * Handles resetting the error state. If a custom onReset prop is provided, 
   * it executes it. Otherwise, it reloads the entire page.
   */
  private handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      // Hard reload to clear any corrupted state
      window.location.reload();
    }
    
    // Clear error state
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided via props, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, use our premium ErrorFallback component
      return (
        <ErrorFallback 
          error={this.state.error || undefined}
          message={this.props.message || this.state.error?.message || "حدث خطأ غير متوقع في التطبيق. تم تسجيل الخطأ ويرجى المحاولة مرة أخرى."}
          onRetry={this.handleReset}
          showBackButton={true}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
