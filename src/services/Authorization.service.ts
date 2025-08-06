'use client';

import { login } from 'actions/login';
import { signUp } from 'actions/singup';
import { signIn } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, SetStateAction } from 'react';
import { MAIN_ROUTES } from 'routes';
import { LogIn, SingUp } from 'types/Auth.types';
import { Bank } from 'types/Bank.interface';
import { Updater } from 'use-immer';
import { getUser } from 'utils/getUser';

interface ServerData {
  error?: string;
  success?: string;

  email?: string;

  password?: string;
}

/**
 * Service class for handling user authorization operations.
 */
class Authorization {
  /**
   * Sends user data and banks to the server when the page is hidden.
   * @param user - The user signup data.
   * @param banks - Array of user-associated banks.
   */
  handleSaveData = (user: SingUp | null | undefined, banks: Bank[]) => {
    const dataToSend = { userData: user, userBanks: banks };
    const blob = new Blob([JSON.stringify(dataToSend)], {
      type: 'application/json',
    });
    const success = navigator.sendBeacon('/api/home', blob);
    if (!success) {
      console.warn('sendBeacon failed to queue the data for sending.');
    }
  };

  async fetchUser(setUser: Dispatch<SetStateAction<SingUp | null | undefined>>): Promise<void> {
    const fetchedUser = await getUser();
    setUser(fetchedUser);
  }

  /**
   * Handles user login.
   * @param data - Login credentials.
   * @param setError - Function to set error message.
   * @param setSuccess - Function to set success message.
   * @param startTransition - React transition function.
   */
  async logIn(
    data: LogIn,
    setError: Dispatch<SetStateAction<string | undefined>>,
    setSuccess: Dispatch<SetStateAction<string | undefined>>,
    startTransition: React.TransitionStartFunction
  ) {
    setError('');
    setSuccess('');
    startTransition(() => {
      login(data).then((data) => {
        setError(data?.error);
      });
    });
  }

  /**
   * Signs in user after successful signup.
   * @param userData - User credentials.
   * @param success - Success message from signup.
   * @param setSuccess - Function to set success message.
   * @param setError - Function to set error message.
   * @param router - Next.js router instance.
   */
  async singInAfterSignUp(
    userData: { email?: string; password?: string },
    success: string | undefined,
    setSuccess: Dispatch<SetStateAction<string | undefined>>,
    setError: Dispatch<SetStateAction<string | undefined>>,
    router: AppRouterInstance
  ) {
    console.log('singInAfterSignUp', userData);
    if (success && userData.email && userData.password) {
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: userData.email,
        password: userData.password,
      });

      if (signInResult?.error) {
        setSuccess('');
        setError('Failed to sign in after signup');
      } else {
        router.push(MAIN_ROUTES.HOME);
      }
    }
  }

  /**
   * Handles user signup.
   * @param data - Signup data.
   * @param setError - Function to set error message.
   * @param setSuccess - Function to set success message.
   * @param startTransition - React transition function.
   * @param setUserData - Function to update user data.
   */
  async singUp(
    data: SingUp,
    setError: Dispatch<SetStateAction<string | undefined>>,
    setSuccess: Dispatch<SetStateAction<string | undefined>>,
    startTransition: React.TransitionStartFunction,
    setUserData: Updater<{ email?: string; password?: string }>
  ) {
    console.log('data', data);
    setError('');
    setSuccess('');
    startTransition(() => {
      signUp(data).then((data: ServerData) => {
        setError(data?.error);
        setSuccess(data?.success);
        setUserData({ email: data.email, password: data.password });
      });
    });
  }
}

export const authorizationService = new Authorization();
