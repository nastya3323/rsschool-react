import { render, screen } from '@testing-library/react';
import Spinner from '../components/Spinner/Spinner';

describe('Spinner component', () => {
  it('renders spinner', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });
});
