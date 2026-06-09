import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/db/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import http from "http";

const HDFS_PORT = 9870;
const HDFS_USER = process.env.HDFS_USER || "hadoop";
const HDFS_DIR = "/rain-guard";

type HdfsResponse = {
  statusCode: number;
  location?: string;
  data: string;
};

function hdfsRequest(
  method: string,
  host: string,
  port: number,
  path: string,
  body?: string
): Promise<HdfsResponse> {
  return new Promise((resolve, reject) => {
    const headers: http.OutgoingHttpHeaders = {};
    if (body) {
      headers["Content-Type"] = "application/octet-stream";
      headers["Content-Length"] = Buffer.byteLength(body);
    }

    const req = http.request({ method, hostname: host, port, path, headers }, (res) => {
      let rawData = "";
      res.on("data", (chunk: string) => { rawData += chunk; });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          location: res.headers.location,
          data: rawData,
        });
      });
    });

    req.on("error", (err) => reject(err));
    if (body) req.write(body);
    req.end();
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // 0. Ambil konfigurasi IP Hadoop dari Firebase Settings
    let hadoopHost = "localhost";
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "config"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (data.hadoop_ip) {
          hadoopHost = data.hadoop_ip;
        }
      }
    } catch (e) {
      // Fallback ke localhost
    }

    // 1. Ambil semua data dari Firestore collection "history"
    let snapshot;
    try {
      snapshot = await getDocs(
        query(collection(db, "history"), orderBy("timestamp", "desc"))
      );
    } catch {
      // Fallback tanpa ordering jika index belum ada
      snapshot = await getDocs(collection(db, "history"));
    }

    const sensorData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Generate nama file dengan format backup-YYYY-MM-DD-HH-mm.json
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fileName = [
      "backup",
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
      pad(now.getHours()),
      pad(now.getMinutes()),
    ].join("-") + ".json";

    const hdfsFilePath = `${HDFS_DIR}/${fileName}`;
    const jsonData = JSON.stringify(sensorData, null, 2);

    // 3. Buat direktori /rain-guard di HDFS (idempotent - aman jika sudah ada)
    await hdfsRequest(
      "PUT", hadoopHost, HDFS_PORT,
      `/webhdfs/v1${HDFS_DIR}?op=MKDIRS&user.name=${HDFS_USER}`
    );

    // 4. WebHDFS upload Step 1: kirim CREATE request ke NameNode → dapat redirect ke DataNode
    const step1 = await hdfsRequest(
      "PUT", hadoopHost, HDFS_PORT,
      `/webhdfs/v1${hdfsFilePath}?op=CREATE&overwrite=true&user.name=${HDFS_USER}`
    );

    if (step1.statusCode !== 307 || !step1.location) {
      throw new Error(
        `HDFS tidak merespons dengan redirect (307). ` +
        `Status: ${step1.statusCode}. ` +
        `Pastikan Hadoop NameNode aktif di ${hadoopHost}:${HDFS_PORT}.`
      );
    }

    // 5. Parse URL DataNode dari header Location
    //    Ganti hostname → localhost agar kompatibel dengan Hadoop di Windows lokal
    const dataNodeUrl = new URL(step1.location);
    const dataNodePort = parseInt(dataNodeUrl.port, 10) || 9864;
    const dataNodePath = dataNodeUrl.pathname + dataNodeUrl.search;

    // 6. WebHDFS upload Step 2: kirim data aktual ke DataNode
    const step2 = await hdfsRequest(
      "PUT", hadoopHost, dataNodePort,
      dataNodePath, jsonData
    );

    if (step2.statusCode !== 201) {
      throw new Error(
        `Upload ke DataNode gagal. ` +
        `Status: ${step2.statusCode}. ` +
        `Response: ${step2.data}`
      );
    }

    // 7. Verifikasi file benar-benar tersimpan di HDFS
    const verify = await hdfsRequest(
      "GET", hadoopHost, HDFS_PORT,
      `/webhdfs/v1${hdfsFilePath}?op=GETFILESTATUS&user.name=${HDFS_USER}`
    );

    if (verify.statusCode !== 200) {
      throw new Error(
        "Verifikasi gagal: file tidak ditemukan di HDFS setelah upload. " +
        `Status: ${verify.statusCode}`
      );
    }

    return res.status(200).json({
      success: true,
      fileName,
      hdfsPath: `hdfs://${hadoopHost}${hdfsFilePath}`,
      recordCount: sensorData.length,
    });
  } catch (error: any) {
    const errStr = String(error).replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***.***");
    console.error("[backup-hadoop] Error:", errStr);
    return res.status(500).json({
      success: false,
      message: error.message || "Backup ke Hadoop gagal",
    });
  }
}
