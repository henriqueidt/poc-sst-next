import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { dirname } = req.query;

    if (!dirname || dirname === undefined) {
      return res.status(400).json({ error: "Directory name is required." });
    }

    const currentDir = process.cwd();
    const newDirPath = path.join(currentDir, dirname as string);

    fs.mkdirSync(newDirPath);

    const files = fs.readdirSync(currentDir);
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error creating directory:", error);
    res.status(500).json({ error: "Error creating directory" });
  }
}
