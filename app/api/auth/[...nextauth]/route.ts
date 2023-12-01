import { PrismaClient } from '@prisma/client';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Super Admin',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Enter your username',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your Password',
        },
      },
      async authorize(credentials, req) {
        const username = credentials?.username
        const password = credentials?.password ?? ''
        const prisma = new PrismaClient();
        const selectUser: any = await prisma.$queryRaw`SELECT * FROM pos_users WHERE username = ${username}`;
        if (!selectUser[0].username) return null;
        const match = await bcrypt.compare(password, selectUser[0].password);
        if (!match) return null;
        const user = {
          id: selectUser[0].id,
          name: selectUser[0].name,
          image: selectUser[0].role
        }
        await prisma.$disconnect()
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({url, baseUrl}) {
      
      const realURL = new URL(url)
      if (realURL.pathname.startsWith('/superadmin'))  baseUrl += realURL.pathname
      return baseUrl
    },
    async jwt({ token, user, session }) {
      token.role = user.image
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      session.user.role = token.role
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
