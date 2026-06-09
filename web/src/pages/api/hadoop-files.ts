import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/db/firebase";
import { doc, getDoc } from "firebase/firestore";

const HDFS_USER = process.env.HDFS_USER || "hadoop";
const HDFS_DIR = "/rain-guard";

function hdfsRequest(
  method: string,
  url: string,
  body?: string
): Promise<{ statusCode: number; location?: string; data: string }> {
  return new Promise((resolve, reject) => {
    const options: RequestInit = {
      method,
      redirect: "manual", // Menahan agar tidak otomatis pindah ke IP lokal Hadoop
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

async function getHadoopConfig() {
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
  return { hadoopBaseUrl, datanodes };
}

async function listFiles(hadoopBaseUrl: string) {
  const res = await hdfsRequest(
    "GET",
    `${hadoopBaseUrl}/webhdfs/v1${HDFS_DIR}?op=LISTSTATUS&user.name=${HDFS_USER}`
  );

  // Direktori belum ada (belum pernah backup)
  if (res.statusCode === 404) {
    return [];
  }

  if (res.statusCode !== 200) {
    throw new Error(`Gagal membaca HDFS. Status: ${res.statusCode}`);
  }

  const json = JSON.parse(res.data);
  const statuses: any[] = json?.FileStatuses?.FileStatus ?? [];

  return statuses
    .filter((f: any) => f.type === "FILE")
    .map((f: any) => ({
      fileName: f.pathSuffix as string,
      size: f.length as number,
      modifiedAt: new Date(f.modificationTime as number).toLocaleString("id-ID"),
      modifiedTimestamp: f.modificationTime as number,
    }))
    .sort((a: any, b: any) => b.modifiedTimestamp - a.modifiedTimestamp);
}

async function readFile(fileName: string, hadoopBaseUrl: string, datanodes: string[]) {
  const filePath = `${HDFS_DIR}/${fileName}`;

  // Step 1: minta NameNode → dapat redirect ke DataNode
  const step1 = await hdfsRequest(
    "GET",
    `${hadoopBaseUrl}/webhdfs/v1${filePath}?op=OPEN&user.name=${HDFS_USER}`
  );

  if (step1.statusCode !== 307 || !step1.location) {
    throw new Error(
      `File tidak ditemukan atau HDFS error. Status: ${step1.statusCode}`
    );
  }

  // Step 2: Olah URL dari DataNode agar bisa diakses dari luar (lewat Cloudflare/Nginx)
  const dataNodeUrl = new URL(step1.location);
  const originalUrl = new URL(hadoopBaseUrl);
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
    // Deteksi otomatis: Jika NameNode diakses via hadoop.domain.com,
    // maka arahkan request DataNode ke datanode.domain.com
    if (originalUrl.hostname.includes("hadoop")) {
      dataNodeUrl.hostname = originalUrl.hostname.replace("hadoop", "datanode");
    } else {
      // Fallback manual jika format domain berbeda
      dataNodeUrl.hostname = "datanode.rain-guard.my.id"; 
    }

    // Wajib menggunakan protokol HTTPS dan menghapus port 9864 bawaan Hadoop pada otomatis
    dataNodeUrl.protocol = "https:";
    dataNodeUrl.port = ""; 
  }

  const step2 = await hdfsRequest(
    "GET",
    dataNodeUrl.toString()
  );

  if (step2.statusCode !== 200) {
    throw new Error(`Gagal membaca file dari DataNode. Status: ${step2.statusCode}`);
  }

  return JSON.parse(step2.data);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { file } = req.query;

  try {
    const { hadoopBaseUrl, datanodes } = await getHadoopConfig();

    if (file && typeof file === "string") {
      // Mode: baca isi file tertentu
      const content = await readFile(file, hadoopBaseUrl, datanodes);
      return res.status(200).json({ success: true, data: content });
    } else {
      // Mode: list semua file
      const files = await listFiles(hadoopBaseUrl);
      return res.status(200).json({ success: true, files });
    }
  } catch (error: any) {
    const errStr = String(error).replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***.***");
    console.error("[hadoop-files] Error:", errStr);
    return res.status(500).json({ success: false, message: error.message });
  }
}