import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { location_id, limit } = req.body;

    const response = await axios.get(
      "https://staging-api.arbolitics.com/data/getArboliticsDataset",
      {
        headers: {
          Authorization: req.headers.authorization || "",
          "Content-Type": "application/json",
        },
        params: {
          location_id,
          limit,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error in proxy API:", error.message);
    res.status(error.response?.status || 500).json({
      error: `External API error: ${error.response?.statusText || error.message}`,
    });
  }
}
