import { render, screen } from '@testing-library/react';

import Card from '../components/Card/Card';
import type { Character } from '../types/types';
import userEvent from '@testing-library/user-event';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  location: { name: 'Earth' },
  image: 'url',
};

describe('Card component', () => {
  it('renders character name, status and species', () => {
    render(<Card character={mockCharacter} isSelected={false} onOpenDetails={() => {}} onSelect={() => {}} />);
    expect(screen.getByText(/Rick Sanchez/)).toBeInTheDocument();
    expect(screen.getByText(/Alive/)).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Species/i)).toBeInTheDocument();
    expect(screen.getByText(/Name/i)).toBeInTheDocument();

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onOpenDetails with stopPropagation', async () => {
    const onOpenDetails = vi.fn();
    const parentClick = vi.fn();

    render(
      <div onClick={parentClick}>
        <Card character={mockCharacter} isSelected={false} onOpenDetails={onOpenDetails} onSelect={() => {}} />
      </div>
    );
    const card = screen.getByTestId('card');

    await userEvent.click(card);
    expect(onOpenDetails).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('calls onOpenDetails when card clicked (but not checkbox)', async () => {
    const onSelect = vi.fn();
    const onOpenDetails = vi.fn();

    render(<Card character={mockCharacter} isSelected={false} onSelect={onSelect} onOpenDetails={onOpenDetails} />);

    const card = screen.getByTestId('card');
    await userEvent.click(card);

    expect(onOpenDetails).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onSelect with stopPropagation when checkbox clicked', async () => {
    const onSelect = vi.fn();
    const onOpenDetails = vi.fn();

    render(<Card character={mockCharacter} isSelected={false} onSelect={onSelect} onOpenDetails={onOpenDetails} />);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onOpenDetails).not.toHaveBeenCalled();
  });
});
