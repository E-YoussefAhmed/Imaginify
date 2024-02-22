import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import clientPromise from "@/lib/db/client";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (!user._doc) {
          console.log({ token, user });
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
