import { createValidationSchema } from '../utils/validationSchemas';

const countriesList = ['United States', 'Germany'];

const schema = createValidationSchema(countriesList);

const validData = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: 'male',
  terms: true,
  password: 'Pass1234!',
  confirmPassword: 'Pass1234!',
  country: 'Germany',
  image: new File(['image'], 'photo.png', { type: 'image/png' }),
};

describe('validationSchemas', () => {
  it('validates a complete valid form', async () => {
    await expect(schema.validate(validData)).resolves.toEqual(validData);
  });

  it('rejects when name does not start with uppercase', async () => {
    const data = {
      ...validData,
      name: 'john',
    };

    await expect(schema.validate(data)).rejects.toThrow('First letter must be uppercase');
  });

  it('rejects when age is negative', async () => {
    const data = {
      ...validData,
      age: -1,
    };

    await expect(schema.validate(data)).rejects.toThrow('Age cannot be negative');
  });

  it('rejects invalid email (missing @)', async () => {
    const data = {
      ...validData,
      email: 'johnexample.com',
    };

    await expect(schema.validate(data)).rejects.toThrow('Email must contain "@" with a local part');
  });

  it('rejects unmatched passwords', async () => {
    const data = {
      ...validData,
      confirmPassword: 'Different',
    };

    await expect(schema.validate(data)).rejects.toThrow('Passwords must match');
  });

  it('rejects image with wrong type', async () => {
    const file = new File([''], 'document.pdf', { type: 'application/pdf' });

    const data = {
      ...validData,
      image: file,
    };

    await expect(schema.validate(data)).rejects.toThrow('Only PNG or JPEG images are allowed');
  });

  it('rejects image too large', async () => {
    const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });

    const data = {
      ...validData,
      image: largeFile,
    };

    await expect(schema.validate(data)).rejects.toThrow('Image size must not exceed 5 MB');
  });

  it('rejects if country not in list', async () => {
    const data = {
      ...validData,
      country: 'France',
    };

    await expect(schema.validate(data)).rejects.toThrow('Select a valid country from the list');
  });
});
