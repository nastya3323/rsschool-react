import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardDetails from '../components/Card/CardDetails';
import type { Character } from '../types/types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  location: { name: 'Earth' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

describe('CardDetails component', () => {
  it('renders character details', () => {
    render(<CardDetails character={mockCharacter} onClose={() => {}} />);

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Alive/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Male/i)).toBeInTheDocument();
    expect(screen.getByText(/Species/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Earth/i)).toBeInTheDocument();

    const img = screen.getByAltText('Rick Sanchez');
    expect(img).toHaveAttribute('src', mockCharacter.image);
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();

    render(<CardDetails character={mockCharacter} onClose={onClose} />);

    const button = screen.getByRole('button', { name: '✕' });
    await userEvent.click(button);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
