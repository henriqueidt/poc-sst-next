import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { dirname, currentdir } = req.query;

    if (!dirname || !currentdir) {
      return res.status(400).json({ error: "Directory name is required." });
    }

    // const currentDir = process.cwd();
    const newDirPath = path.join(currentdir.toString(), dirname as string);

    if (!fs.existsSync(newDirPath)) {
      return res.status(400).json({ error: "Directory not found." });
    }

    res.status(200).json({ newDirPath });
  } catch (error) {
    console.error("Error changing directory:", error);
    res.status(500).json({ error: "Error changing directory" });
  }
}
