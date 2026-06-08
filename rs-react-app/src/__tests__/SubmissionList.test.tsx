import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from '../store/slices/submissionsSlice';
import countriesReducer from '../store/slices/countriesSlice';
import SubmissionList from '../components/Submission/SubmissionList';
import type { Submission } from '../types';

function createTestStore(submissions: Submission[] = []) {
  return configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
    preloadedState: {
      submissions: { items: submissions },
    },
  });
}

function renderWithStore(ui: React.ReactElement, submissions: Submission[] = []) {
  const store = createTestStore(submissions);

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

function makeSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: '1',
    name: 'John',
    age: 25,
    email: 'john@example.com',
    gender: 'male',
    terms: true,
    password: 'Pass1234!',
    country: 'Germany',
    imageBase64: 'data:image/png;base64,ABC',
    submittedAt: 1000,
    highlighted: false,
    ...overrides,
  };
}

describe('SubmissionList component', () => {
  it('shows "No submissions yet." when list is empty', () => {
    renderWithStore(<SubmissionList />);

    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
  });

  it('renders cards for each submission sorted by submittedAt descending', () => {
    const sub1 = makeSubmission({ id: '1', submittedAt: 1000, name: 'First' });

    const sub2 = makeSubmission({ id: '2', submittedAt: 2000, name: 'Second' });

    renderWithStore(<SubmissionList />, [sub1, sub2]);

    const cards = screen.getAllByRole('img', { name: 'User' });

    expect(cards).toHaveLength(2);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();

    const items = screen.getAllByText(/^(First|Second)$/);

    expect(items[0]).toHaveTextContent('Second');
    expect(items[1]).toHaveTextContent('First');
  });
});
