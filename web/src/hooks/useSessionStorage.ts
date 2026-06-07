// src/hooks/useSessionStorage.ts
import { useState, useEffect } from "react";

export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  // Saat pertama kali load, cek apakah ada data tersimpan di browser
  const [value, setValue] = useState<T>(defaultValue);

  // Baca dari sessionStorage setelah komponen di-mount di client-side
  // Ini untuk mencegah error Next.js Hydration Mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.sessionStorage.getItem(key);
        if (saved !== null) {
          setValue(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Gagal membaca sessionStorage", err);
      }
    }
  }, [key]);

  // Setiap kali nilai berubah, otomatis simpan ke memori browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}
