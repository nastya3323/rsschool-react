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
    render(<Card character={mockCharacter} onClick={() => {}} />);
    expect(screen.getByText(/Rick Sanchez/)).toBeInTheDocument();
    expect(screen.getByText(/Alive/)).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Species/i)).toBeInTheDocument();
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
  });

  it('calls onClick with stopPropagation', async () => {
    const onClick = vi.fn();
    const parentClick = vi.fn();

    render(
      <div onClick={parentClick}>
        <Card character={mockCharacter} onClick={onClick} />
      </div>
    );
    const card = screen.getByTestId('card');

    await userEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });
});
