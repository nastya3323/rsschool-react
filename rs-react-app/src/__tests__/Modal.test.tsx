import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../components/Modal/Modal';
import { useState } from 'react';

describe('Modal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders children inside portal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal Content</p>
      </Modal>
    );

    const content = screen.getByText('Modal Content');
    expect(content).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('displays title correctly', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Title">
        <p>Body</p>
      </Modal>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

    expect(screen.getByText('Test Title')).toHaveAttribute('id', 'modal-title');
  });

  it('calls onClose when Escape key is pressed', async () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Body</p>
      </Modal>
    );

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked (not dialog)', async () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Body</p>
      </Modal>
    );
    const overlay = screen.getByTestId('modal-overlay');

    await userEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when dialog content is clicked', async () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Body</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');

    await userEvent.click(dialog);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('focuses the dialog when opened', async () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <input type="text" placeholder="focusable" />
      </Modal>
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveFocus();
    });
  });

  it('returns focus to previously active element after close', async () => {
    const TestComponent = () => {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button data-testid="outside-btn">Outside</button>
          <Modal isOpen={open} onClose={() => setOpen(false)}>
            <p>Body</p>
          </Modal>
        </>
      );
    };

    render(<TestComponent />);

    const outsideBtn = screen.getByTestId('outside-btn');
    outsideBtn.focus();

    expect(outsideBtn).toHaveFocus();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(outsideBtn).toHaveFocus();
    });
  });
});
