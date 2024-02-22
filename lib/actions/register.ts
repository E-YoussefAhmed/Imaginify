"use server";

// import * as z from "zod";
// import { connectToDatabase } from "@/lib/db/connection";
import { hash, genSalt } from "bcryptjs";
import { RegisterSchema, RegisterData } from "@/lib/schemas/yup";
import { createUser, getUserByEmail } from "@/lib/data/user";

export const register = async (values: RegisterData) => {
  try {
    const validatedFields = await RegisterSchema.validate(values);

    const { name, email, password, cPassword } = validatedFields;

    if (password !== cPassword) {
      return { error: "Passwords doesn't match!" };
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) return { error: "Email already exists!" };

    const salt = await genSalt(10);

    const hashedPassword = await hash(password, salt);

    await createUser(name, email, hashedPassword);

    return { success: "Account created successfully!" };
  } catch (error: any) {
    if (error.errors?.length) {
      return { error: "Invalid fields!" };
    } else {
      console.log(error);
      return { error: "Something went wrong!" };
    }
  }
};
