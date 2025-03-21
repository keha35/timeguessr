import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GoogleProvider from 'next-auth/providers/google';
import { Session } from 'next-auth';
import { AdapterUser } from '@auth/core/adapters';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, user }: { session: Session; user: AdapterUser }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
}; 