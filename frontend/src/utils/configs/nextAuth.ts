import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { signInWithGoogle } from "@/services/authService";
import { setToken } from "@/utils/cookie";

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
                const response: any = await signInWithGoogle({
                    id_token: account.id_token as string,
                    email: user?.email as string,
                });
                if (response?.status_code === 200) {
                    setToken(response?.data?.token);
                    return true;
                } else {
                    return false;
                }
            }
            return false;
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