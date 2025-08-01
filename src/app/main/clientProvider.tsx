'use client';

import { useEffect, useState } from 'react';
import { authorizationService } from 'services/Authorization.service';
import { SingUp } from 'types/Auth.types';
import { Provider } from './provider';

export function ClientProvider({}: {}) {
  const [user, setUser] = useState<SingUp | null | undefined>(null);

  useEffect(() => {
    authorizationService.fetchUser(setUser);
  }, []);

  return <Provider user={user}></Provider>;
}
