import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { filename, currentDir } = req.query;

    const body = JSON.parse(req.body);

    const { isDryRun } = body;

    if (!filename || filename === undefined || !currentDir) {
      return res.status(400).json({ error: "Directory name is required." });
    }

    let files;

    if (!isDryRun) {
      const newFilePath = path.join(currentDir.toString(), filename as string);

      fs.writeFileSync(newFilePath, "");
      files = fs.readdirSync(currentDir.toString());
    } else {
      files = [...fs.readdirSync(currentDir.toString()), filename];
    }
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error creating directory:", error);
    res.status(500).json({ error: "Error creating directory" });
  }
}
