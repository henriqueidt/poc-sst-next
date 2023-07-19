import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { filename } = req.query;

    if (!filename || filename === undefined) {
      return res.status(400).json({ error: "Directory name is required." });
    }

    const currentDir = process.cwd();
    const newFilePath = path.join(currentDir, filename as string);

    fs.writeFileSync(newFilePath, "");

    const files = fs.readdirSync(currentDir);
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error creating directory:", error);
    res.status(500).json({ error: "Error creating directory" });
  }
}
