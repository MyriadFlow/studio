import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import InstagramProvider from "next-auth/providers/instagram";

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Update verification status in your database
      if (account.provider === "twitter") {
        // Verify Twitter username matches claimed account
      }
      if (account.provider === "instagram") {
        // Verify Instagram username matches claimed account
      }
      return true;
    },
  },
};



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
