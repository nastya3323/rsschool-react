import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubmission } from '../../store/slices/submissionsSlice';
import { createValidationSchema } from '../../utils/validationSchemas';
import InputField from './FormFields/InputField';
import CheckboxField from './FormFields/CheckboxField';
import FileField from './FormFields/FileField';
import PasswordField from './FormFields/PasswordField';
import CountryField from './FormFields/CountryField';
import { countriesList } from '../../store/slices/countriesSelectors';
import GenderFieldUncontrolled from './FormFields/GenderFieldUncontrolled';
import fileToBase64 from '../../utils/fileToBase64';

interface UncontrolledFormProps {
  onClose: () => void;
}

export default function UncontrolledForm({ onClose }: UncontrolledFormProps) {
  const dispatch = useDispatch();
  const countries = useSelector(countriesList);
  const schema = createValidationSchema(
    countries.map((country) => {
      return country.name;
    })
  );

  const [passwordStrength, setPasswordStrength] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

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

  const handlePasswordChange = () => {
    const password = passwordRef.current?.value || '';
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

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});

    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const genderValue = formData.get('gender') as string;

    const formValues = {
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value) || 0,
      email: emailRef.current?.value || '',
      gender: genderValue,
      terms: termsRef.current?.checked || false,
      image: imageInputRef.current?.files?.[0],
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      country: countryRef.current?.value || '',
    };

    try {
      await schema.validate(formValues, { abortEarly: false });
    } catch (error) {
      const yupError = error as { inner: { path: string; message: string }[] };

      const fieldErrors: Record<string, string> = {};

      yupError.inner.forEach((error) => {
        if (!fieldErrors[error.path]) {
          fieldErrors[error.path] = error.message;
        }
      });

      setErrors(fieldErrors);

      return;
    }

    dispatch(
      addSubmission({
        name: formValues.name,
        age: formValues.age,
        email: formValues.email,
        gender: formValues.gender as 'male' | 'female' | 'other',
        terms: formValues.terms,
        imageBase64: imagePreview || '',
        password: formValues.password,
        country: formValues.country,
      })
    );

    onClose();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form" noValidate>
      <InputField id="uname" label="Name:" ref={nameRef} error={errors.name} />

      <InputField id="uage" label="Age:" type="number" ref={ageRef} error={errors.age} />

      <InputField id="uemail" label="Email:" type="email" ref={emailRef} error={errors.email} />

      <GenderFieldUncontrolled
        name="gender"
        label="Gender:"
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ]}
        error={errors.gender}
      />

      <CheckboxField id="uaccept" label="Accept Terms & Conditions" ref={termsRef} error={errors.terms} />

      <FileField
        id="uimage"
        label="Upload Image (PNG/JPEG):"
        accept="image/png, image/jpeg"
        ref={imageInputRef}
        onFileChange={handleImageChange}
        preview={imagePreview}
        error={errors.image}
      />

      <PasswordField
        id="upassword"
        label="Password:"
        ref={passwordRef}
        onChange={handlePasswordChange}
        strength={passwordStrength}
        error={errors.password}
      />

      <PasswordField id="uconfirm" label="Confirm Password:" ref={confirmPasswordRef} error={errors.confirmPassword} />

      <CountryField id="ucountry" label="Country:" options={countries} ref={countryRef} error={errors.country} />

      <button type="submit" className="submitButton">
        Submit
      </button>
    </form>
  );
}
