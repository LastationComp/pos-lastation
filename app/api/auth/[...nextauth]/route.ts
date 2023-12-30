
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/app/_lib/prisma/client';
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

        let permission = {};
        const selectUser: any = await prisma.$queryRaw`SELECT * FROM pos_users WHERE username = BINARY ${username} AND role = ${credentials?.role} `;

        if (!selectUser[0].username) return null;

        if (!selectUser[0].is_active) return null;
        if (selectUser[0].license_key !== credentials?.license_key && selectUser[0].role !== 'super_admin') return null;

        const match = await bcrypt.compare(password, selectUser[0].password);
        if (!match) return null;

        const getSettings = await prisma.clients.findFirst({
          where: {
            license_key: credentials?.license_key,
          },
          select: {
            client_name: true,
            client_code: true,
            admin: {
              select: {
                name: true,
                setting: {
                  select: {
                    emp_can_create: true,
                    emp_can_delete: true,
                    emp_can_update: true,
                    shop_close_hours: true,
                    shop_open_hours: true
                  },
                },
              },
            },
          },
        });
        permission = getSettings?.admin?.setting ?? {};

        let employee_data = {
          avatar_url: selectUser[0].avatar,
          client_code: getSettings?.client_code,
          permissions: { ...permission },
        };

        let user = {
          id: selectUser[0].id,
          name: selectUser[0].name,
          username: selectUser[0].username,
          role: selectUser[0].role,
          client_name: getSettings?.client_name,
          license_key: selectUser[0].license_key,
        };

        if (selectUser[0].role === 'employee') {
          user = {
            ...user,
            ...employee_data,
          };
        }
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
    error: '/',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const realURL = new URL(url);
      if (realURL.pathname === '/superadmin/login') baseUrl += realURL.pathname;
      return baseUrl;
    },
    jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.user?.avatar_url && session?.user?.name) {
        return {
          ...token,
          avatar_url: session?.user?.avatar_url,
          name: session?.user?.name,
        };
      }
      if (user) {
        const u = user as unknown as any;

        return {
          ...token,
          role: u.role,
          client_code: u.client_code,
          avatar_url: u.avatar_url,
          license_key: u.license_key,
          username: u.username,
          permissions: u.permissions,
          client_name: u.client_name,
        };
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.avatar_url = token.avatar_url;
      session.user.license_key = token.license_key;
      session.user.username = token.username;
      session.user.permissions = token.permissions;
      session.user.client_name = token.client_name;
      session.user.client_code = token.client_code
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
