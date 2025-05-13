"use server";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { LogInSchema } from "schemas/logIn.schema";
import { LogIn } from "types/Auth.types";
import { findUserByEmail } from "utils/findUser";
import { signIn } from "../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";

export const login = async (data: LogIn) => {
  const validatedFields = LogInSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  const user = await findUserByEmail(email);

  if (!user) {
    return { error: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    try {
      await signIn("credentials", {
        email,
        password: user.password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials!" };

          default:
            return { error: "Something went wrong...Please try again later" };
        }
      }

      throw error;
    }
  }
};
