import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import submissionsReducer from '../store/slices/submissionsSlice';
import countriesReducer from '../store/slices/countriesSlice';

const store = configureStore({
  reducer: {
    submissions: submissionsReducer,
    countries: countriesReducer,
  },
});

function renderWithProviders(ui: React.ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('App component', () => {
  it('renders title and buttons', () => {
    renderWithProviders(<App />);

    expect(screen.getByText('Form Submissions')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Open Uncontrolled Form/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Open React Hook Form/i })).toBeInTheDocument();
  });

  it('opens uncontrolled form modal on button click', async () => {
    renderWithProviders(<App />);

    const openBtn = screen.getByRole('button', { name: /Open Uncontrolled Form/i });

    await userEvent.click(openBtn);

    const nameInput = screen.getByLabelText('Name:');
    expect(nameInput).toBeInTheDocument();

    expect(nameInput).toHaveAttribute('id', 'uname');
  });

  it('opens react hook form modal on button click', async () => {
    renderWithProviders(<App />);

    const openBtn = screen.getByRole('button', { name: /Open React Hook Form/i });

    await userEvent.click(openBtn);

    const nameInput = screen.getByLabelText('Name:');

    expect(nameInput).toHaveAttribute('id', 'rhf-name');
  });

  it('closes modal when close button is clicked', async () => {
    renderWithProviders(<App />);

    await userEvent.click(screen.getByRole('button', { name: /Open Uncontrolled Form/i }));

    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });

    await userEvent.click(closeBtn);

    expect(screen.queryByLabelText('Name:')).not.toBeInTheDocument();
  });

  it('displays SubmissionList (initially empty)', () => {
    renderWithProviders(<App />);

    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
  });
});
