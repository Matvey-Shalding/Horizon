"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "state/auth/userSlice";
import { SingUp } from "types/Auth.types";

export function Provider({ user }: { user: SingUp | undefined | null }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUser(user));
  }, [user]);
  return <div></div>;
}
