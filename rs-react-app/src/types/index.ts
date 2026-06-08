export interface Submission {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  password: string;
  country: string;
  imageBase64: string;
  submittedAt: number;
  highlighted: boolean;
}

export type FormData = Omit<Submission, 'id' | 'submittedAt' | 'highlighted'>;

export interface Country {
  code: string;
  name: string;
}

export interface FormValues {
  name: string;
  age: number;
  email: string;
  gender: string;
  terms: boolean;
  image: File;
  password: string;
  confirmPassword: string;
  country: string;
}
