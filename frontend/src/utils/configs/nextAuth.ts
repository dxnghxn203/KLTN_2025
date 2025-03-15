import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { signInWithGoogle } from "@/services/authService";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const response = await signInWithGoogle({
                        id_token: account.idToken as string,
                        accessToken: account.accessToken as string,
                        email: user.email as string,
                    })

                    return response.success || false;
                } catch (error) {
                    console.error("Error authenticating with backend:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, account, user }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.id = token.userId as string;
            return { ...session, id_token: token.id_token };
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;