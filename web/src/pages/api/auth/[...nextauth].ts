import db from "@/utils/db/firebase";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        nama: { label: "Nama", type: "text" }
      },
      async authorize(credentials) {
        // Logika sederhana: jika ada email, anggap authorize berhasil
        if (credentials?.email) {
          return { 
            id: credentials.email, 
            email: credentials.email, 
            name: credentials.nama 
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, credentials }: any) {
      if (!user?.email) return false;

      try {
        const loginRef = collection(db, "login");
        const q = query(loginRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        // Simpan ke Firestore jika email belum ada
        if (querySnapshot.empty) {
          await addDoc(loginRef, {
            nama: user.name || "User Baru",
            email: user.email,
            password: credentials?.password || "", // Simpan password string sesuai request
            createdAt: serverTimestamp()
          });
          console.log(" Data berhasil disimpan ke koleksi login");
        }
        return true; 
      } catch (error) {
        console.error("❌ Firestore Error:", error);
        return true; // Tetap izinkan login walau gagal simpan log database
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Karena kamu pakai folder custom views/auth/login, pastikan path ini benar
  pages: {
    signIn: "/auth/login", 
  }
});