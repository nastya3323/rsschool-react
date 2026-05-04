import { Component, type JSX } from 'react';
import Button from '../Button/Button';

const CLASS = 'test-error-button';
const TEXT_ERROR = 'Test Error';

interface TestErrorButtonState {
  shouldThrowError: boolean;
}

interface TestErrorButtonProps {
  isLoading: boolean;
}

export default class TestErrorButton extends Component<TestErrorButtonProps, TestErrorButtonState> {
  state = {
    shouldThrowError: false,
  };

  private handleErrorButtonClick = (): void => {
    this.setState({ shouldThrowError: true });
  };

  render(): JSX.Element {
    const { isLoading } = this.props;

    if (this.state.shouldThrowError) {
      throw new Error(TEXT_ERROR);
    }

    return (
      <Button className={CLASS} onClick={this.handleErrorButtonClick} disabled={isLoading}>
        🔴 {TEXT_ERROR}
      </Button>
    );
  }
}
