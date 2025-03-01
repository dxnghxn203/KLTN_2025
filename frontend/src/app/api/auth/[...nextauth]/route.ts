import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { signInWithGoogle } from "@/services/authService";
import { GoogleSignInData } from "@/types/auth";

export const authOptions: NextAuthOptions = {
    debug:  false,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const data: GoogleSignInData = {
                        email: user.email as string,
                        id_token: account.id_token as string,
                        accessToken: account.accessToken as string,
                    }

                    const rs: { success: boolean } = await signInWithGoogle(data);
                    return (await rs).success || false;
                } catch (error) {
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, account, user }) {
            if (user) token.id = user.id;
                return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.userId as string;
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/error/auth",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
