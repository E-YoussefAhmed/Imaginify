"use server";

import crypto from "crypto";

import { connectToDatabase } from "@/lib/db/mongoose";
import User from "@/lib/models/user.model";
import { handleError } from "@/lib/utils";

export const getUserByEmail = async (email: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });

    return user;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ user_id: id });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string
) => {
  try {
    await connectToDatabase();
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];

    const newUser = await User.create({
      user_id: crypto.randomInt(1_000_000, 10_000_000).toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      Image: "",
    });

    return newUser;
  } catch (error) {
    handleError(error);
  }
};

export const updateCredits = async (userId: string, creditFee: number) => {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { $inc: { creditBalance: creditFee } }
    );

    if (!updatedUser) throw new Error("User credits update failed");

    return {
      creditBalance: JSON.parse(JSON.stringify(updatedUser)).creditBalance,
    };
  } catch (error) {
    handleError(error);
  }
};
