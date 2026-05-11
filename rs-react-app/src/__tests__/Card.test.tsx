import { render, screen } from '@testing-library/react';
import type { Character } from '../App';
import Card from '../components/Card/Card';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  location: { name: 'Earth' },
};

describe('Card component', () => {
  it('renders character name', () => {
    render(<Card character={mockCharacter} />);
    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
  });

  it('renders status, gender, species, location', () => {
    render(<Card character={mockCharacter} />);
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Alive/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Male/i)).toBeInTheDocument();
    expect(screen.getByText(/Species/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Earth/i)).toBeInTheDocument();
  });
});
