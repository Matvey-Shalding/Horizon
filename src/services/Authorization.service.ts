"use client";

import { login } from "actions/login";
import { singUp } from "actions/singup";
import { signIn } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React, { Dispatch, SetStateAction } from "react";
import { MAIN_ROUTES } from 'routes';
import { LogIn, SingUp } from "types/Auth.types";
import { Updater } from "use-immer";

class Authorization {
  async logIn(
    data: LogIn,
    setError: Dispatch<SetStateAction<string | undefined>>,
    setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>,
    startTransition: React.TransitionStartFunction,
  ) {
    console.log("submitting...");
    setError("");
    setSuccess("");
    startTransition(() => {
      login(data).then((data) => {
        setError(data?.error);
      });
    });
  }

  async singInAfterSignUp(
    userData: {
      email?: string;
      password?: string;
    },
    success: string | undefined,
    setSuccess: Dispatch<SetStateAction<string | undefined>>,
    setError: Dispatch<SetStateAction<string | undefined>>,
    router: AppRouterInstance,
  ) {
    if (success) {
      const authenticateUser = async () => {
        if (userData.email && userData.email) {
          const signInResult = await signIn("credentials", {
            redirect: false,
            email: userData.email,
            password: userData.password,
          });

          if (signInResult?.error) {
            setSuccess("");
            setError("Failed to sign in after signup");
          } else {
            router.push(MAIN_ROUTES.HOME);
          }
        }
      };
      authenticateUser();
    }
  }

  async singUp(
    data: SingUp,
    setError: Dispatch<SetStateAction<string | undefined>>,
    setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>,
    startTransition: React.TransitionStartFunction,
    setUserData: Updater<{
      email?: string;
      password?: string;
    }>,
  ) {
    setError("");
    setSuccess("");
    startTransition(() => {
      singUp(data).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        setUserData({ email: data.email, password: data.password });
      });
    });
  }
}

export const authorizationService = new Authorization();
