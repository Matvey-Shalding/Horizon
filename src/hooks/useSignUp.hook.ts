import { useState, useTransition } from 'react';
import { useImmer } from 'use-immer';

export function useSignUp() {
  const [isSubmitting, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [userData, setUserData] = useImmer<{
    email?: string;
    password?: string;
  }>({});

  return { isSubmitting, startTransition, error, setError, setSuccess, success, userData, setUserData };
}
