"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { LoginSchema, LoginData } from "@/lib/schemas/yup";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (values: LoginData, callbackUrl?: string) => {
  try {
    const validatedFields = await LoginSchema.validate(values);

    const { email, password } = validatedFields;

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
  }

  redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT);
};
