import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const currentDir = process.cwd();
    res.status(200).json({ currentDir });
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).json({ error: "Error reading directory" });
  }
}
