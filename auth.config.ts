import type { NextAuthConfig } from "next-auth";
import crypto from "crypto";
import { compare } from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getUserByEmail, getUserById } from "@/lib/data/user";
import { LoginSchema } from "@/lib/schemas/yup";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        let userId;
        while (true) {
          userId = crypto.randomInt(1_000_000, 10_000_000).toString();
          const user = await getUserById(userId);
          if (!user) break;
        }
        return {
          id: profile.sub,
          user_id: userId,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
          planId: 1,
          creditBalance: 10,
        };
      },
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      async profile(profile) {
        let userId;
        while (true) {
          userId = crypto.randomInt(1_000_000, 10_000_000).toString();
          const user = await getUserById(userId);
          if (!user) break;
        }
        return {
          id: profile.id.toString(),
          user_id: userId,
          email: profile.email,
          image: profile.avatar_url,
          firstName: profile.login,
          planId: 1,
          creditBalance: 10,
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        try {
          const validateFields = await LoginSchema.validate(credentials);
          const { email, password } = validateFields;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordMatch = await compare(password, user.password);

          if (passwordMatch) return user;
        } catch {
          return null;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
