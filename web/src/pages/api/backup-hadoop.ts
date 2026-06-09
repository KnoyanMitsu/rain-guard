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
  url: string,
  body?: string
): Promise<HdfsResponse> {
  return new Promise((resolve, reject) => {
    const options: RequestInit = {
      method,
      redirect: "manual",
    };
    if (body) {
      options.headers = {
        "Content-Type": "application/octet-stream",
      };
      options.body = body;
    }

    fetch(url, options)
      .then(async (res) => {
        resolve({
          statusCode: res.status,
          location: res.headers.get("location") || undefined,
          data: await res.text(),
        });
      })
      .catch((err) => reject(err));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // 0. Ambil konfigurasi IP Hadoop dari Firebase Settings
    let hadoopBaseUrl = "http://localhost:9870";
    let datanodes: string[] = [];
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "config"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (data.hadoop_ip) {
          let ip = data.hadoop_ip.trim();
          if (!ip.startsWith("http://") && !ip.startsWith("https://")) {
            ip = "http://" + ip;
          }
          hadoopBaseUrl = ip;
        }
        if (data.datanodes && Array.isArray(data.datanodes)) {
          datanodes = data.datanodes.map((dn: any) => typeof dn === 'string' ? dn : dn.external).filter(Boolean);
        } else if (data.datanode_ip) {
          datanodes = [data.datanode_ip.trim()];
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
      "PUT",
      `${hadoopBaseUrl}/webhdfs/v1${HDFS_DIR}?op=MKDIRS&user.name=${HDFS_USER}`
    );

    // 4. WebHDFS upload Step 1: kirim CREATE request ke NameNode → dapat redirect ke DataNode
    const step1 = await hdfsRequest(
      "PUT",
      `${hadoopBaseUrl}/webhdfs/v1${hdfsFilePath}?op=CREATE&overwrite=true&user.name=${HDFS_USER}`
    );

    if (step1.statusCode !== 307 || !step1.location) {
      throw new Error(
        `HDFS tidak merespons dengan redirect (307). ` +
        `Status: ${step1.statusCode}. ` +
        `Pastikan Hadoop NameNode aktif di ${hadoopBaseUrl}.`
      );
    }

    // 5. Parse URL DataNode dari header Location
    //    Ganti hostname dan port sesuai list datanodes
    const dataNodeUrl = new URL(step1.location);
    const originalDnHostname = dataNodeUrl.hostname;
    
    let matchedExternal = "";
    if (datanodes.length > 0) {
      const originalDnShort = originalDnHostname.split('.')[0];
      matchedExternal = datanodes.find(dn => {
         try {
           return new URL(dn).hostname.includes(originalDnShort);
         } catch {
           return dn.includes(originalDnShort);
         }
      }) || datanodes[0];
    }

    if (matchedExternal) {
      if (matchedExternal.startsWith("http://") || matchedExternal.startsWith("https://")) {
        const customDatanode = new URL(matchedExternal);
        dataNodeUrl.protocol = customDatanode.protocol;
        dataNodeUrl.hostname = customDatanode.hostname;
        if (customDatanode.port) {
          dataNodeUrl.port = customDatanode.port;
        } else {
          dataNodeUrl.port = "";
        }
      } else {
        dataNodeUrl.hostname = matchedExternal;
      }
    } else {
      const originalUrl = new URL(hadoopBaseUrl);
      dataNodeUrl.hostname = originalUrl.hostname;
    }

    // 6. WebHDFS upload Step 2: kirim data aktual ke DataNode
    const step2 = await hdfsRequest(
      "PUT",
      dataNodeUrl.toString(),
      jsonData
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
      "GET",
      `${hadoopBaseUrl}/webhdfs/v1${hdfsFilePath}?op=GETFILESTATUS&user.name=${HDFS_USER}`
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
      hdfsPath: `hdfs://${originalUrl.hostname}${hdfsFilePath}`,
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
