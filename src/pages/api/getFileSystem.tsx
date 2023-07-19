import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { currentdir } = req.query;

  if (!currentdir) {
    return res.status(400).json({ error: "Directory name is required." });
  }

  try {
    const files = fs.readdirSync(currentdir.toString());
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).json({ error: "Error reading directory" });
  }
}
