import MESSAGES from '@/lib/messages';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
const API_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const result = await loginResponse.json();
        if (loginResponse.status === 200) {
          return {
            id: result.sub,
            accessToken: result.access_token,
            role: result.roleDiv,
            rememberMe: req?.body?.rememberMe == 'true' ? true : false || false,
          };
        } else {
          throw new Error(MESSAGES.CREDENTIALS_INCORRECT);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = {
        accessToken: token.accessToken,
        email: token.email,
        image: token.picture,
        name: token.name,
        role: token.role,
        id: token?.id?.toString(),
        rememberMe: Boolean(token.rememberMe),
        companyCd: token.companyCd as string,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
