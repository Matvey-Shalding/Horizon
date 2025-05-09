"use server";

import { findUserByEmail } from "utils/findUser";
import { auth } from '../../auth';

export async function getUser() {
  const session = await auth();
  const email = session?.user?.email;
  const user = email ? await findUserByEmail(email) : undefined;
  return user;
}
