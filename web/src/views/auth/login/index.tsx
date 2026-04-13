import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const TampilanLogin = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Username dan password wajib diisi!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      document.cookie = "isLoginRainGuard=true; path=/";
      setLoading(false);
      push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-100 w-full max-w-md border border-blue-100">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800">
            Rain Guard
          </h1>
          <p className="text-blue-400 mt-2">
            Login untuk mengakses dashboard
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-blue-700 ml-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 border-2 border-blue-100 p-3 rounded-xl"
              type="text"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-blue-700 ml-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border-2 border-blue-100 p-3 rounded-xl"
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {/* Link */}
        <div className="mt-6 text-center">
          <Link href="/auth/register" className="text-blue-600 font-bold">
            Daftar akun
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TampilanLogin;