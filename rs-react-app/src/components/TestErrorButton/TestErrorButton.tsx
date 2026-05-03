import { Component, type JSX } from 'react';
import Button from '../Button/Button';

const CLASS = 'test-error-button';
const TEXT_ERROR = 'Test Error';

interface TestErrorButtonState {
  shouldThrowError: boolean;
}

export default class TestErrorButton extends Component<Record<string, never>, TestErrorButtonState> {
  constructor(props: Record<string, never>) {
    super(props);

    this.state = {
      shouldThrowError: false,
    };
  }

  private errorButtonClickHandler = (): void => {
    this.setState({ shouldThrowError: true });
  };

  render(): JSX.Element {
    if (this.state.shouldThrowError) {
      throw new Error(TEXT_ERROR);
    }

    return (
      <Button className={CLASS} onClick={this.errorButtonClickHandler}>
        🔴 {TEXT_ERROR}
      </Button>
    );
  }
}
