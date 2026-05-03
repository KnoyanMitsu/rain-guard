import { Parser } from "@json2csv/plainjs";

export type JSON = Record<string, any>;

type Props = {
  data?: JSON[];
  fileName?: string;
};

export default function saveJson({ data, fileName = "data.csv" }: Props = {}) {
  if (!data || !Array.isArray(data)) return null;

  try {
    const parser = new Parser();
    const csv = parser.parse(data);

    if (typeof document !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return null;
  } catch (err) {
    console.error("Error generating CSV:", err);
    return null;
  }
}
