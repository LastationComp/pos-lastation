import { PrismaClient } from '@prisma/client';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';
const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
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
        license_key: {
          label: 'License Key',
          type: 'text',
          placeholder: 'Enter your License Key',
        },
        role: {
          label: 'Role',
          type: 'text',
          placeholder: 'Enter your role',
        },
      },

      async authorize(credentials, req) {
        const username = credentials?.username;
        const password = credentials?.password ?? '';

        let permission = {}
        const selectUser: any = await prisma.$queryRaw`SELECT * FROM pos_users WHERE username = BINARY ${username} AND role = ${credentials?.role} `;

        if (!selectUser[0].username) return null;

        if (!selectUser[0].is_active) return null
        if (selectUser[0].license_key !== credentials?.license_key && selectUser[0].role !== 'super_admin') return null

        const match = await bcrypt.compare(password, selectUser[0].password);
        if (!match) return null;

        if (credentials?.role === 'employee') {
          const getSettings = await prisma.clients.findFirst({
            where: {
              license_key: credentials.license_key
            },
            select: {
              client_name: true,
              admin: {
                select: {
                  name: true,
                  setting: {
                    select: {
                      emp_can_create: true,
                      emp_can_delete: true,
                      emp_can_update: true
                    }
                  }
                }
              }
            }
          })
          permission = getSettings?.admin?.setting ?? {}
        }
        
        const user = {
          id: selectUser[0].id,
          name: selectUser[0].name,
          role: selectUser[0].role,
          license_key: selectUser[0].license_key,
          username: selectUser[0].username,
          permissions: {...permission}
        };

        await prisma.$disconnect();
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/',
    error: '/'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const realURL = new URL(url);
      if (realURL.pathname === '/superadmin/login') baseUrl += realURL.pathname;
      return baseUrl;
    },
    jwt({ token, user }) {
      if (user) {
        const u = user as unknown as any;
        if (!u.permissions?.emp_can_create) return {
          ...token,
          role: u.role,
          license_key: u.license_key,
          username: u.username
        };

        return {
          ...token,
          role: u.role,
          license_key: u.license_key,
          username: u.username,
          permissions: u.permissions
        };
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.license_key = token.license_key
      session.user.username = token.username
      session.user.permissions = token.permissions
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
