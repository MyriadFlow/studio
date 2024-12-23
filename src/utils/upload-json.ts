import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { content } = req.body;

    const pinataRes = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      content,
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY!,
        },
      }
    );

    return res.status(200).json(pinataRes.data);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error uploading JSON' });
  }
}