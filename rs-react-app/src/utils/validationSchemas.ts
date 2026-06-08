import * as yup from 'yup';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const createValidationSchema = (countriesList: string[]) => {
  return yup.object({
    name: yup
      .string()
      .required('Name is required')
      .test('capital-first-letter', 'First letter must be uppercase', (value) => {
        return value ? value[0] === value[0].toUpperCase() : false;
      }),
    age: yup
      .number()
      .typeError('Age must be a number')
      .required('Age is required')
      .positive('Age cannot be negative')
      .integer('Age must be an integer'),
    email: yup
      .string()
      .required('Email is required')
      .test('has-at', 'Email must contain "@" with a local part', (value) => {
        if (!value) {
          return false;
        }

        return value.includes('@');
      })
      .test('has-dot-in-domain', 'Domain must contain a dot after "@"', (value) => {
        if (!value) {
          return false;
        }

        const atIndex = value.indexOf('@');
        const domain = value.slice(atIndex + 1);
        return domain.includes('.') && domain.indexOf('.') > 0;
      })
      .test('local-part-not-empty', 'Local part cannot be empty', (value) => {
        if (!value) {
          return false;
        }

        const atIndex = value.indexOf('@');
        return value.slice(0, atIndex).length > 0;
      }),
    gender: yup.string().required('Please select a gender'),
    terms: yup.boolean().required('You must accept the terms').oneOf([true], 'You must accept the terms'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    country: yup
      .string()
      .required('Select country')
      .test('valid-country', 'Select a valid country from the list', (value) => {
        if (!value) {
          return false;
        }

        return countriesList.includes(value);
      }),
    image: yup
      .mixed<File>()
      .required('Upload an image')
      .test('fileType', 'Only PNG or JPEG images are allowed', (value) => {
        if (!value) {
          return false;
        }

        return ['image/png', 'image/jpeg'].includes(value.type);
      })
      .test('fileSize', 'Image size must not exceed 5 MB', (value) => {
        if (!value) {
          return false;
        }

        return value.size <= MAX_IMAGE_SIZE_BYTES;
      }),
  });
};
