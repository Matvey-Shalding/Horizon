"use client";

import { useEffect, useState } from "react";
import { Provider } from "./provider";
import { getUser } from 'utils/getUser'; // <- from server utils (if you move it)
import { SingUp } from 'types/Auth.types';

export function ClientProvider({}:{}) {
  const [user, setUser] = useState<SingUp | null | undefined>(null);

  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUser();
      setUser(fetchedUser);
    }
    fetchUser();
  }, []);

  return <Provider user={user}></Provider>;
}
