"use client";

import { login } from "actions/login";
import { singUp } from "actions/singup";
import React, { Dispatch, SetStateAction } from "react";
import { LogIn, SingUp } from "types/Auth.types";

class Authorization {
  async logIn(
    data: LogIn,
    setError: Dispatch<SetStateAction<string | undefined>>,
    setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>,
    startTransition: React.TransitionStartFunction,
  ) {
    console.log('submitting...')
    setError("");
    setSuccess("");
    startTransition(() => {
      login(data).then((data) => {
        setError(data?.error);
      });
    });
  }

  async singUp(
    data: SingUp,
    setError: Dispatch<SetStateAction<string | undefined>>,
    setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>,
    startTransition: React.TransitionStartFunction,
  ) {
    setError("");
    setSuccess("");
    startTransition(() => {
      singUp(data).then((data) => {
        setError(data?.error);
      });
    });
  }
}

export const authorizationService = new Authorization();
