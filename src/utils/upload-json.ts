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
          pinata_api_key: '420fa5e0818989bf7c8',
          pinata_secret_api_key: '059a5c6e54156958dce952e5ca416a0ee9832a071900ee4841e616e41a6c14c',
        },
      }
    );

    return res.status(200).json(pinataRes.data);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error uploading JSON' });
  }
}