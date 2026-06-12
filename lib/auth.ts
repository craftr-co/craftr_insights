import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sendSignInEmail } from "@/lib/send-email";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  events: {
    async signIn({ user }) {
      const email = user.email?.trim();
      if (!email) return;

      const name = user.name?.trim() || email.split("@")[0];
      const signedInAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      try {
        await sendSignInEmail({ name, email, signedInAt, imageUrl: user.image });
      } catch (err) {
        console.error("Sign-in notification failed:", err);
      }
    },
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/survey`;
    },
  },
};
