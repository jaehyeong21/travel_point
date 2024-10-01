import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KaKaoProvider from "next-auth/providers/kakao";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60 * 1,
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    }),
    NaverProvider({
      clientId: process.env.NEXT_PUBLIC_NAVER_SEARCH_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_NAVER_SEARCH_KEY || "",
    }),
    KaKaoProvider({
      clientId: process.env.NEXT_PUBLIC_KAKAO_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || "",
    }),
  ],  
  callbacks: {
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
    async jwt({ user, token }) {
      return { ...token, ...user };
    },
  },
};
