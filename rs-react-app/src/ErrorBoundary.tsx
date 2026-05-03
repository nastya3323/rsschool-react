import { Component, type ErrorInfo, type ReactNode } from 'react';
import Button from './components/Button/Button';

const CLASSES = {
  FALLBACK_UI: 'fallback-ui',
  FALLBACK_UI_TITLE: 'fallback-ui__title',
  FALLBACK_UI_DESCRIPTION: 'fallback-ui__description',
  FALLBACK_UI_BUTTON: 'fallback-ui__button',
};

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
        <div className={CLASSES.FALLBACK_UI}>
          <h2 className={CLASSES.FALLBACK_UI_TITLE}>Fallback UI</h2>
          <p className={CLASSES.FALLBACK_UI_DESCRIPTION}>
            <span>Message error</span>: {this.state.errorMessage}
          </p>
          <Button className={CLASSES.FALLBACK_UI_BUTTON} onClick={this.handleButtonClick}>
            Back
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
