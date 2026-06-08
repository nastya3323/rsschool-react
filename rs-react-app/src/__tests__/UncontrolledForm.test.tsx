import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from '../store/slices/submissionsSlice';
import countriesReducer from '../store/slices/countriesSlice';
import UncontrolledForm from '../components/forms/UncontrolledForm';
import fileToBase64 from '../utils/fileToBase64';
import { vi } from 'vitest';

vi.mock('../utils/fileToBase64', () => ({
  default: vi.fn(() => Promise.resolve('data:image/png;base64,MOCKED')),
}));

function createTestStore() {
  return configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
  });
}

function renderForm(onClose = vi.fn()) {
  const store = createTestStore();

  const utils = render(
    <Provider store={store}>
      <UncontrolledForm onClose={onClose} />
    </Provider>
  );

  return { store, onClose, ...utils };
}

async function fillValidForm() {
  const file = new File(['image'], 'test.png', { type: 'image/png' });

  await userEvent.type(screen.getByLabelText('Name:'), 'John');
  await userEvent.type(screen.getByLabelText('Age:'), '25');
  await userEvent.type(screen.getByLabelText('Email:'), 'john@example.com');

  await userEvent.click(screen.getByLabelText('Male'));

  await userEvent.click(screen.getByLabelText('Accept Terms & Conditions'));

  const fileInput = screen.getByLabelText('Upload Image (PNG/JPEG):') as HTMLInputElement;
  await userEvent.upload(fileInput, file);

  await userEvent.type(screen.getByLabelText('Password:'), 'Pass1234!');
  await userEvent.type(screen.getByLabelText('Confirm Password:'), 'Pass1234!');

  const countryInput = screen.getByLabelText('Country:');

  await userEvent.clear(countryInput);
  await userEvent.type(countryInput, 'Germany');
}

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Age:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Gender:')).toBeInTheDocument();
    expect(screen.getByLabelText('Accept Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Image (PNG/JPEG):')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Country:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('shows validation errors when submitted with empty fields', async () => {
    renderForm();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Age cannot be negative')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Please select a gender')).toBeInTheDocument();
      expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Select country')).toBeInTheDocument();
      expect(screen.getByText('Upload an image')).toBeInTheDocument();
    });
  });

  it('submits valid data and dispatches addSubmission, then calls onClose', async () => {
    const onClose = vi.fn();
    const { store } = renderForm(onClose);

    await fillValidForm();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(fileToBase64).toHaveBeenCalled();
    });

    const state = store.getState().submissions;
    expect(state.items).toHaveLength(1);

    const submission = state.items[0];

    expect(submission.name).toBe('John');
    expect(submission.age).toBe(25);
    expect(submission.email).toBe('john@example.com');
    expect(submission.gender).toBe('male');
    expect(submission.terms).toBe(true);
    expect(submission.imageBase64).toBe('data:image/png;base64,MOCKED');
    expect(submission.country).toBe('Germany');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays password strength indicator when typing password', async () => {
    renderForm();

    const passwordField = screen.getByLabelText('Password:');

    await userEvent.type(passwordField, 'Aa1!');

    await waitFor(() => {
      expect(screen.getByText(/strong|average|weak/)).toBeInTheDocument();
    });
  });
});
