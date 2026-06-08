import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from '../store/slices/submissionsSlice';
import countriesReducer from '../store/slices/countriesSlice';
import ReactHookForm from '../components/forms/ReactHookForm';
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
      <ReactHookForm onClose={onClose} />
    </Provider>
  );

  return { store, onClose, ...utils };
}

async function fillValidRHF() {
  const file = new File(['img'], 'photo.png', { type: 'image/png' });

  await userEvent.type(screen.getByLabelText('Name:'), 'Maria');
  await userEvent.type(screen.getByLabelText('Age:'), '25');
  await userEvent.type(screen.getByLabelText('Email:'), 'maria@example.com');
  await userEvent.click(screen.getByLabelText('Female'));
  await userEvent.click(screen.getByLabelText('Accept Terms & Conditions'));

  const fileInput = screen.getByLabelText('Upload Image (PNG/JPEG):') as HTMLInputElement;

  await userEvent.upload(fileInput, file);

  await userEvent.type(screen.getByLabelText('Password:'), 'Pass1234!');

  await userEvent.type(screen.getByLabelText('Confirm Password:'), 'Pass1234!');

  const countryInput = screen.getByLabelText('Country:');

  await userEvent.clear(countryInput);
  await userEvent.type(countryInput, 'Russia');
}

describe('ReactHookForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables submit button when form is invalid', async () => {
    renderForm();
    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    expect(submitBtn).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Name:'), 'м');
    expect(submitBtn).toBeDisabled();

    await userEvent.clear(screen.getByLabelText('Name:'));
    await userEvent.type(screen.getByLabelText('Name:'), 'Maria');

    await userEvent.type(screen.getByLabelText('Age:'), '25');

    await userEvent.type(screen.getByLabelText('Email:'), 'maria@example.com');

    await userEvent.click(screen.getByLabelText('Female'));
    await userEvent.click(screen.getByLabelText('Accept Terms & Conditions'));

    expect(submitBtn).toBeDisabled();

    const file = new File(['img'], 'photo.png', { type: 'image/png' });

    const fileInput = screen.getByLabelText('Upload Image (PNG/JPEG):') as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    await userEvent.type(screen.getByLabelText('Password:'), 'Pass1234!');

    await userEvent.type(screen.getByLabelText('Confirm Password:'), 'Pass1234!');

    const countryInput = screen.getByLabelText('Country:');

    await userEvent.clear(countryInput);

    await userEvent.type(countryInput, 'Russia');

    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });
  });

  it('shows validation errors on submit if fields are empty', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText('Name:'), 'j');

    await waitFor(() => {
      expect(screen.getByText('First letter must be uppercase')).toBeInTheDocument();
    });
  });

  it('submits valid data and dispatches addSubmission, calls onClose', async () => {
    const onClose = vi.fn();

    const { store } = renderForm(onClose);

    await fillValidRHF();

    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    expect(submitBtn).toBeEnabled();

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(fileToBase64).toHaveBeenCalled();
    });

    const state = store.getState().submissions;
    expect(state.items).toHaveLength(1);

    const sub = state.items[0];

    expect(sub.name).toBe('Maria');
    expect(sub.age).toBe(25);
    expect(sub.email).toBe('maria@example.com');
    expect(sub.gender).toBe('female');
    expect(sub.terms).toBe(true);
    expect(sub.imageBase64).toBe('data:image/png;base64,MOCKED');
    expect(sub.country).toBe('Russia');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('resets form after successful submission', async () => {
    const onClose = vi.fn();

    renderForm(onClose);

    await fillValidRHF();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
