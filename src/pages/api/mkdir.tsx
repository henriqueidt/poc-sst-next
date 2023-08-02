import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { dirname, currentDir } = req.query;

    const body = JSON.parse(req.body);

    const { isDryRun } = body;

    if (!dirname || dirname === undefined || !currentDir) {
      return res.status(400).json({ error: "Directory name is required." });
    }
    let files;

    if (!isDryRun) {
      const newDirPath = path.join(currentDir.toString(), dirname as string);
      fs.mkdirSync(newDirPath);
      files = fs.readdirSync(currentDir.toString());
    } else {
      files = [...fs.readdirSync(currentDir.toString()), dirname];
    }

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error creating directory:", error);
    res.status(500).json({ error: "Error creating directory" });
  }
}
