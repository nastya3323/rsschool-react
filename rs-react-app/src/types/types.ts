export interface Character {
  id: number;
  name: string;
  gender: string;
  species: string;
  status: string;
  location: {
    name: string;
  };
}
