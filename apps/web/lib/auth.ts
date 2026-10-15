import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

/** カンマ区切りの GitHub ユーザー名。設定時はこのユーザーだけがログインできる */
const allowedUsers = (process.env.ALLOWED_GITHUB_USERS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/** ローカル開発用のログイン（GitHub OAuth を設定せずに動作確認するため）。本番では無効 */
export const devLoginEnabled =
  process.env.NODE_ENV === "development" && process.env.AUTH_DEV_LOGIN === "true";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: { params: { scope: "read:user user:email" } },
    }),
    ...(devLoginEnabled
      ? [
          CredentialsProvider({
            id: "dev",
            name: "Dev login",
            credentials: {},
            authorize: async () => ({ id: "dev", name: "Developer", email: "dev@localhost" }),
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider !== "github" || allowedUsers.length === 0) return true;
      const login = (profile as { login?: string } | undefined)?.login?.toLowerCase();
      return !!login && allowedUsers.includes(login);
    },
  },
};

export const getSession = () => getServerSession(authOptions);
