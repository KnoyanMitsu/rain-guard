import db from "@/utils/db/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export async function validateFirebaseCredentials(
  email?: string,
  password?: string
) {
  if (!email || !password) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const loginRef = collection(db, "login");
  const q = query(loginRef, where("email", "==", normalizedEmail));
  const querySnapshot = await getDocs(q);

  const matchedUser = querySnapshot.docs.find((doc) => {
    const data = doc.data();
    return data.password === password;
  });

  if (!matchedUser) {
    return null;
  }

  const userData = matchedUser.data();
  const displayName =
    userData.fullname ?? userData.nama ?? userData.name ?? normalizedEmail.split("@")[0];

  return {
    id: matchedUser.id,
    email: userData.email ?? normalizedEmail,
    name: displayName,
    fullname: displayName,
    nama: displayName,
  };
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          return await validateFirebaseCredentials(
            credentials?.email,
            credentials?.password
          );
        } catch (error) {
          console.error("❌ Auth Error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name ?? token.name;
        token.fullname = user.fullname ?? user.name ?? token.fullname;
        token.nama = user.nama ?? user.name ?? token.nama;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name ?? undefined;
        session.user.fullname =
          token.fullname ?? token.name ?? session.user.fullname ?? session.user.name;
        session.user.nama =
          token.nama ?? token.fullname ?? token.name ?? session.user.nama ?? session.user.fullname;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
});