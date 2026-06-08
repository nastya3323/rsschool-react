import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addSubmission } from '../../store/slices/submissionsSlice';
import { createValidationSchema } from '../../utils/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from './FormFields/InputField';
import CheckboxField from './FormFields/CheckboxField';
import FileField from './FormFields/FileField';
import PasswordField from './FormFields/PasswordField';
import CountryField from './FormFields/CountryField';
import GenderField from './FormFields/GenderFieldControlled';
import { countriesList } from '../../store/slices/countriesSelectors';
import fileToBase64 from '../../utils/fileToBase64';
import type { FormValues } from '../../types';

interface RHFProps {
  onClose: () => void;
}

export default function ReactHookForm({ onClose }: RHFProps) {
  const dispatch = useDispatch();
  const countries = useSelector(countriesList);

  const schema = createValidationSchema(
    countries.map((country) => {
      return country.name;
    })
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: '',
      terms: false,
      password: '',
      confirmPassword: '',
      country: '',
    },
  });

  const passwordValue = watch('password');

  const evaluatePasswordStrength = (password: string) => {
    const checks: string[] = [];

    if (/\d/.test(password)) {
      checks.push('1 digit');
    }
    if (/[A-Z]/.test(password)) {
      checks.push('1 uppercase');
    }

    if (/[a-z]/.test(password)) {
      checks.push('1 lowercase');
    }

    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      checks.push('1 special char');
    }

    setPasswordStrength(checks);
  };

  useEffect(() => {
    evaluatePasswordStrength(passwordValue || '');
  }, [passwordValue]);

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setImagePreview(null);
      return;
    }

    try {
      const imageBase64 = await fileToBase64(file);
      setImagePreview(imageBase64);
    } catch {
      setImagePreview(null);
    }
  };

  const onSubmit = (data: FormValues) => {
    dispatch(
      addSubmission({
        name: data.name,
        age: data.age,
        email: data.email,
        gender: data.gender as 'male' | 'female' | 'other',
        terms: data.terms,
        imageBase64: imagePreview || '',
        password: data.password,
        country: data.country,
      })
    );

    reset();
    setImagePreview(null);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      <InputField id="rhf-name" label="Name:" {...register('name')} error={errors.name?.message} />

      <InputField
        id="rhf-age"
        label="Age:"
        type="number"
        {...register('age', { valueAsNumber: true })}
        error={errors.age?.message}
      />

      <InputField id="rhf-email" label="Email:" type="email" {...register('email')} error={errors.email?.message} />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <GenderField
            id="rhf-gender"
            label="Gender:"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            selectedValue={field.value}
            onChange={field.onChange}
            error={errors.gender?.message}
          />
        )}
      />

      <CheckboxField
        id="rhf-accept"
        label="Accept Terms & Conditions"
        {...register('terms')}
        error={errors.terms?.message}
      />

      <Controller
        name="image"
        control={control}
        render={({ field: { onChange, ref } }) => (
          <FileField
            id="rhf-image"
            label="Upload Image (PNG/JPEG):"
            accept="image/png, image/jpeg"
            ref={ref}
            onFileChange={(file) => {
              onChange(file);
              handleImageChange(file);
            }}
            preview={imagePreview}
            error={errors.image?.message}
          />
        )}
      />

      <PasswordField
        id="rhf-password"
        label="Password:"
        {...register('password')}
        strength={passwordStrength}
        error={errors.password?.message}
      />

      <PasswordField
        id="rhf-confirm"
        label="Confirm Password:"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <CountryField
            id="rhf-country"
            label="Country:"
            options={countries}
            {...field}
            error={errors.country?.message}
          />
        )}
      />

      <button type="submit" className="submitButton" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
