'use server';
import { AuthError } from 'next-auth';
import { LogInSchema } from 'schemas/logIn.schema';
import { LogIn } from 'types/Auth.types';
import { signIn } from '../../auth';
import { DEFAULT_LOGIN_REDIRECT } from '../../routes';

export const login = async (data: LogIn) => {
	const validatedFields = LogInSchema.safeParse(data);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn('credentials', { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        
        default: 
          return {error: "Something went wrong...Please try again later"}
			}
    }
    
    throw error
	}
};
