"use client";

import AceUIAppname from "@/component/aestetic/AceUIAppname";
import AceUICard from "@/component/card/AceUICard";
import AceUIButton from "@/component/input/AceUIButton";
import AceUIInput from "@/component/input/AceUIInput";
import AceUITemplateTwoGrid from "@/component/template/AceUITemplateTwoGrid";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const TampilanLogin = () => {
  const router = useRouter(); // Gunakan useRouter dari next/router
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        nama: nama,
        email: email,
        password: password,
      });

      if (res?.error) {
        alert("Login gagal!");
      } else {
        // Ganti ke halaman tujuan setelah login
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AceUITemplateTwoGrid>
        {/* Kolom Kiri */}
        <div className="">
          <AceUIAppname
            appname="Rain Guard"
            description="Pantau kondisi cuaca dan keamanan data Anda dalam satu platform terpadu."
          />
        </div>

        {/* Kolom Kanan */}
        <div className="flex items-center justify-center">
          <div className="min-h-screen w-screen bg-primary/20 flex items-center justify-center p-4">
            <AceUICard>
              {/* Header */}
              <div className="text-center mb-8 mt-8">
                <h1 className="text-3xl font-extrabold text-black">
                  Masuk Ke Akun
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  Data baru akan otomatis tersimpan
                </p>
              </div>

              {/* Form menggunakan handleSubmit agar lebih rapi */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-6">
                <AceUIInput
                  label="Nama Lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  type="text"
                />

                <AceUIInput
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  type="email"
                />

                <AceUIInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                />

                {/* Button */}
                <AceUIButton disable={loading} types="submit">
                  {loading ? "Memproses..." : "Masuk & Simpan"}
                </AceUIButton>
              </form>
            </AceUICard>
          </div>
        </div>
      </AceUITemplateTwoGrid>
    </>
  );
};

export default TampilanLogin;
