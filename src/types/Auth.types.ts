import { Bank } from './Bank.interface';

export interface SingUp {
	firstName: string;
	lastName: string;
	address: string;
	state: string;
	postalCode: string;
	dateOfBirth: string;
	SSN: string;
	password: string;
	email: string;
}

export type SingUpField = keyof SingUp

export interface LogIn {
	password: string;
	email: string;
}

export type LogInFields = keyof LogIn