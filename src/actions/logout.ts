// app/actions/logout.ts
'use server';

/**
 * Logs out the current user.
 */
import { signOut } from '../../auth';

export async function logOut() {
  await signOut();
}
