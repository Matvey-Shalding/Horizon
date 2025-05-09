import { RegisterOptions } from 'react-hook-form';
import { SingUp } from 'types/Auth.types'

interface FieldConfig {
	fieldRegister: keyof SingUp;
	label: string;
	placeholder: string;
	options?: RegisterOptions<SingUp, keyof SingUp>;
}

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
};
