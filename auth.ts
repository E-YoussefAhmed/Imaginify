import crypto from "crypto";
import NextAuth from "next-auth";
import { compare } from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import clientPromise from "@/lib/db/client";
import { LoginSchema } from "@/lib/schemas/yup";
import { getUserByEmail, getUserById } from "@/lib/data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  ...authConfig,
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
    // Github({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //   async profile(profile) {
    //     let userId;
    //     while (true) {
    //       userId = crypto.randomInt(1_000_000, 10_000_000).toString();
    //       const user = await getUserById(userId);
    //       if (!user) break;
    //     }
    //     return {
    //       id: profile.id.toString(),
    //       user_id: userId,
    //       email: profile.email,
    //       image: profile.avatar_url,
    //       firstName: profile.login,
    //       planId: 1,
    //       creditBalance: 10,
    //     };
    //   },
    // }),
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
  //@ts-ignore
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (!user._doc) {
          token.userId = user.user_id;
          token.email = user.email;
          token.picture = user.image;
          token.name = user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName;
          token.planId = user.planId;
          token.creditBalance = user.creditBalance;
        } else {
          token.userId = user._doc.user_id;
          token.email = user._doc.email;
          token.picture = user._doc.image;
          token.name = user._doc.lastName
            ? `${user._doc.firstName} ${user._doc.lastName}`
            : user._doc.firstName;
          token.planId = user._doc.planId;
          token.creditBalance = user._doc.creditBalance;
        }
      }
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.picture as string;
      session.user.planId = token.planId as number;
      session.user.creditBalance = token.creditBalance as number;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      planId: number;
      creditBalance: number;
    };
  }

  /*
    id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  */

  interface User {
    _id?: string;
    user_id: string;
    firstName: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
    image?: string | null;
    emailVerified?: boolean | null;
    planId: number;
    creditBalance: number;
    _doc?: User;
  }
}
