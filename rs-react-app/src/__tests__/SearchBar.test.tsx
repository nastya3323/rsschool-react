import { fireEvent, render, screen } from '@testing-library/react';
import SearchBar from '../components/SearchBar/SearchBar';
import userEvent from '@testing-library/user-event';

describe('SearchBar component', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchInput: vi.fn(),
    onSearch: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input and button', () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /find/i })).toBeInTheDocument();
  });

  it('should display searchQuery in input', () => {
    render(<SearchBar {...defaultProps} searchQuery="rick" />);

    const input: HTMLInputElement = screen.getByRole('textbox');

    expect(input.value).toBe('rick');
  });

  it('should display empty input when searchQuery is empty', () => {
    render(<SearchBar {...defaultProps} searchQuery="" />);

    const input: HTMLInputElement = screen.getByRole('textbox');

    expect(input.value).toBe('');
  });

  it('should call onSearchInput when typing', () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'morty' } });

    expect(defaultProps.onSearchInput).toHaveBeenCalledTimes(1);

    expect(defaultProps.onSearchInput).toHaveBeenLastCalledWith('morty');
  });

  it('should call onSearch when button clicked', async () => {
    render(<SearchBar {...defaultProps} />);

    const button = screen.getByRole('button', { name: /find/i });

    await userEvent.click(button);

    expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('should call onSearch when Enter key pressed', () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('should disable input and button when loading', () => {
    render(<SearchBar {...defaultProps} isLoading={true} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should show "Search..." on button when loading', () => {
    render(<SearchBar {...defaultProps} isLoading={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Search...');
  });
});
