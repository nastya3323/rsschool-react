import { fireEvent, render, screen } from '@testing-library/react';
import FileField from '../components/forms/FormFields/FileField';
import userEvent from '@testing-library/user-event';

describe('FileField component', () => {
  it('renders file input', () => {
    render(<FileField id="avatar" label="Upload avatar" />);

    expect(screen.getByLabelText('Upload avatar')).toBeInTheDocument();

    expect(screen.getByLabelText('Upload avatar')).toHaveAttribute('type', 'file');
  });

  it('shows error', () => {
    render(<FileField id="avatar" label="Upload avatar" error="File too big" />);

    expect(screen.getByText('File too big')).toBeInTheDocument();
  });

  it('displays preview image when preview prop is set', () => {
    render(<FileField id="avatar" label="Upload avatar" preview="data:image/png;base64,ABC" />);

    expect(screen.getByRole('img', { name: 'Preview' })).toBeInTheDocument();

    expect(screen.getByRole('img')).toHaveAttribute('src', 'data:image/png;base64,ABC');
  });

  it('calls onFileChange with file when file selected', async () => {
    const handleFileChange = vi.fn();

    render(<FileField id="avatar" label="Upload avatar" onFileChange={handleFileChange} />);

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    const input = screen.getByLabelText('Upload avatar');

    await userEvent.upload(input, file);

    expect(handleFileChange).toHaveBeenCalledTimes(1);
    expect(handleFileChange.mock.calls[0][0]).toBe(file);
  });

  it('calls onFileChange with null when file is cleared', async () => {
    const handleFileChange = vi.fn();

    render(<FileField id="avatar" label="Upload avatar" onFileChange={handleFileChange} />);

    const input = screen.getByLabelText('Upload avatar');

    fireEvent.change(input, { target: { files: [] } });
    expect(handleFileChange).toHaveBeenCalledWith(null);
  });
});
