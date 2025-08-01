import { RegisterOptions } from 'react-hook-form';
import { SingUp } from 'types/Auth.types';

/**
 * Configuration for a single form field.
 */
interface FieldConfig {
  /** The key of the SingUp type for form registration. */
  fieldRegister: keyof SingUp;
  /** The display label for the form field. */
  label: string;
  /** The placeholder text for the form field. */
  placeholder: string;
  /** Optional validation rules for react-hook-form. */
  options?: RegisterOptions<SingUp, keyof SingUp>;
}

/**
 * Configuration for SignUp form fields.
 */
export const FormFields: Record<keyof SingUp, FieldConfig> = {
  firstName: {
    fieldRegister: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
  },
  lastName: {
    fieldRegister: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your last name',
  },
  address: {
    fieldRegister: 'address',
    label: 'Address',
    placeholder: 'Enter your specific address',
  },
  state: {
    fieldRegister: 'state',
    label: 'State',
    placeholder: 'ex: NY',
  },
  postalCode: {
    fieldRegister: 'postalCode',
    label: 'Postal Code',
    placeholder: 'ex: 11101',
  },
  dateOfBirth: {
    fieldRegister: 'dateOfBirth',
    label: 'Date of Birth',
    placeholder: 'yyyy-mm-dd',
  },
  SSN: {
    fieldRegister: 'SSN',
    label: 'SSN',
    placeholder: 'ex: 1234',
  },
  email: {
    fieldRegister: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
  },
  password: {
    fieldRegister: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
} as const;
