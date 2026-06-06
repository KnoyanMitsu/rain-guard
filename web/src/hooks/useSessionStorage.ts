// src/hooks/useSessionStorage.ts
import { useState, useEffect } from "react";

export function useSessionStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Saat pertama kali load, cek apakah ada data tersimpan di browser
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const saved = window.sessionStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    return defaultValue;
  });

  // Setiap kali nilai berubah, otomatis simpan ke memori browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}