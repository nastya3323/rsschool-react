import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from '../store/slices/submissionsSlice';
import countriesReducer from '../store/slices/countriesSlice';
import SubmissionCard from '../components/Submission/SubmissionCard';
import type { Submission } from '../types';
import { vi } from 'vitest';

function createStoreWithSubmission(submission: Submission) {
  return configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
    preloadedState: {
      submissions: { items: [submission] },
    },
  });
}

function renderCard(submission: Submission) {
  const store = createStoreWithSubmission(submission);

  return {
    store,
    ...render(
      <Provider store={store}>
        <SubmissionCard submission={submission} />
      </Provider>
    ),
  };
}

const baseSubmission: Submission = {
  id: '1',
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: 'male',
  terms: true,
  password: 'Pass1234!',
  country: 'Germany',
  imageBase64: 'data:image/png;base64,ABC',
  submittedAt: 1712345678000,
  highlighted: false,
};

describe('SubmissionCard component', () => {
  it('renders all submission fields correctly', () => {
    renderCard(baseSubmission);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Pass1234!')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    const img = screen.getByRole('img', { name: 'User' });
    expect(img).toHaveAttribute('src', 'data:image/png;base64,ABC');

    expect(screen.getByText(/Sent at:/)).toBeInTheDocument();
  });

  it('applies highlighted class when submission is highlighted', () => {
    const highlightedSub = { ...baseSubmission, highlighted: true };

    const { container } = renderCard(highlightedSub);

    const card = container.firstChild as HTMLElement;

    expect(card.className).toContain('highlighted');
  });

  it('removes highlight after 3 seconds', async () => {
    vi.useFakeTimers();

    const submission = { ...baseSubmission, highlighted: true };

    const { store } = renderCard(submission);

    const stateBefore = store.getState().submissions;
    expect(stateBefore.items[0].highlighted).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const stateAfter = store.getState().submissions;
    expect(stateAfter.items[0].highlighted).toBe(false);

    vi.useRealTimers();
  });

  it('clears timer on unmount if highlighted', () => {
    vi.useFakeTimers();

    const submission = { ...baseSubmission, highlighted: true };

    const { unmount } = renderCard(submission);

    unmount();

    vi.useRealTimers();
  });
});
