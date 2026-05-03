import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/db/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const mockHistoryData = [
  {
    lokasi: "Sungai Ciliwung",
    tinggi_air: "85 cm",
    curah_hujan: "12.5 mm/jam",
    status: "Waspada",
    update_terakhir: "5 menit lalu",
  },
  {
    lokasi: "Sungai Cisadane",
    tinggi_air: "45 cm",
    curah_hujan: "5.2 mm/jam",
    status: "Aman",
    update_terakhir: "8 menit lalu",
  },
  {
    lokasi: "Bendungan Katulampa",
    tinggi_air: "120 cm",
    curah_hujan: "25.8 mm/jam",
    status: "Bahaya",
    update_terakhir: "2 menit lalu",
  },
  {
    lokasi: "Kali Pesanggrahan",
    tinggi_air: "62 cm",
    curah_hujan: "8.3 mm/jam",
    status: "Aman",
    update_terakhir: "10 menit lalu",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const historyCollection = collection(db, "history");

    // Upload data to Firestore
    const promises = mockHistoryData.map((data) =>
      addDoc(historyCollection, {
        ...data,
        createdAt: serverTimestamp(),
      })
    );

    await Promise.all(promises);

    res.status(200).json({ 
      success: true, 
      message: "Seeding success. Data uploaded to Firestore collection 'history'.",
      count: mockHistoryData.length 
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    res.status(500).json({ success: false, message: "Seeding failed", error: error.message });
  }
}
