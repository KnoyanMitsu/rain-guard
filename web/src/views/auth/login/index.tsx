import AceUICard from "@/component/card/AceUICard";
import AceUIInput from "@/component/input/AceUIInput";
import AceUITemplateTwoGrid from "@/component/template/AceUITemplateTwoGrid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { signIn } from "next-auth/react";
import AceUIAppname from "@/component/aestetic/AceUIAppname";

const TampilanLogin = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username dan password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        fullname: username,
        password: password,
      });

      if (res?.error) {
        alert("Login gagal, pastikan credential Anda benar.");
      } else {
        push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AceUITemplateTwoGrid>
        {/* Ini akan menjadi kolom kiri */}
        <div className="">
          <AceUIAppname appname="Rain Guard" description="Loremipsum" />
        </div>
        {/* Ini akan menjadi kolom kanan */}
        <div className="flex items-center justify-center">
          <div className="min-h-screen w-screen bg-blue-50 flex items-center justify-center p-4">
            <AceUICard>
              {/* Header */}
              <div className="text-center mb-8 mt-8">
                <h1 className="text-3xl font-extrabold text-black">
                  Dashboard
                </h1>
              </div>

              {/* Input */}
              <div className="flex flex-col gap-4 mb-6">
                <AceUIInput
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  type="text"
                />

                <AceUIInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                />
              </div>

              {/* Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </AceUICard>
          </div>
        </div>
      </AceUITemplateTwoGrid>
    </>
  );
};

export default TampilanLogin;
