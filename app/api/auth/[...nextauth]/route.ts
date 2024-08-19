// /app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  // Additional NextAuth configuration options can be added here
});

export { handler as GET, handler as POST };
