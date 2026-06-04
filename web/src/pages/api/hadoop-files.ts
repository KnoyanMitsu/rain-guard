import type { NextApiRequest, NextApiResponse } from "next";
import http from "http";

const HDFS_HOST = "localhost";
const HDFS_PORT = 9870;
const HDFS_USER = process.env.HDFS_USER || "hadoop";
const HDFS_DIR = "/rain-guard";

function hdfsRequest(
  method: string,
  host: string,
  port: number,
  path: string
): Promise<{ statusCode: number; location?: string; data: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request({ method, hostname: host, port, path }, (res) => {
      let raw = "";
      res.on("data", (chunk: string) => { raw += chunk; });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          location: res.headers.location,
          data: raw,
        });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function listFiles() {
  const res = await hdfsRequest(
    "GET", HDFS_HOST, HDFS_PORT,
    `/webhdfs/v1${HDFS_DIR}?op=LISTSTATUS&user.name=${HDFS_USER}`
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
    .filter((f) => f.type === "FILE")
    .map((f) => ({
      fileName: f.pathSuffix as string,
      size: f.length as number,
      modifiedAt: new Date(f.modificationTime as number).toLocaleString("id-ID"),
      modifiedTimestamp: f.modificationTime as number,
    }))
    .sort((a, b) => b.modifiedTimestamp - a.modifiedTimestamp);
}

async function readFile(fileName: string) {
  const filePath = `${HDFS_DIR}/${fileName}`;

  // Step 1: minta NameNode → dapat redirect ke DataNode
  const step1 = await hdfsRequest(
    "GET", HDFS_HOST, HDFS_PORT,
    `/webhdfs/v1${filePath}?op=OPEN&user.name=${HDFS_USER}`
  );

  if (step1.statusCode !== 307 || !step1.location) {
    throw new Error(
      `File tidak ditemukan atau HDFS error. Status: ${step1.statusCode}`
    );
  }

  // Step 2: baca data dari DataNode (ganti hostname → localhost)
  const dataNodeUrl = new URL(step1.location);
  const dataNodePort = parseInt(dataNodeUrl.port, 10) || 9864;
  const dataNodePath = dataNodeUrl.pathname + dataNodeUrl.search;

  const step2 = await hdfsRequest(
    "GET", "localhost", dataNodePort, dataNodePath
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
    if (file && typeof file === "string") {
      // Mode: baca isi file tertentu
      const content = await readFile(file);
      return res.status(200).json({ success: true, data: content });
    } else {
      // Mode: list semua file
      const files = await listFiles();
      return res.status(200).json({ success: true, files });
    }
  } catch (error: any) {
    console.error("[hadoop-files] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
