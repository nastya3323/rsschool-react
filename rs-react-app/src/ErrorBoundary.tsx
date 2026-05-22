import styles from './App.module.css';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import Button from './components/Button/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  handleButtonClick = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={styles.fallbackUi}>
          <h2>Fallback UI</h2>
          <p className={styles.fallbackUi__description}>
            <span>Message error</span>: {this.state.errorMessage}
          </p>
          <Button className={styles.fallbackUi__button} onClick={this.handleButtonClick}>
            Back
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
