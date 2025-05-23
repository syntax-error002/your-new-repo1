import mux from '@mux/mux-node';

export const config = {
  api: {
    bodyParser: true, // default true, can omit if no custom setting needed
  },
};

const { Video } = new mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing videoUrl in request body' });
  }

  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return res.status(500).json({ error: 'MUX credentials not set in environment' });
  }

  try {
    const asset = await Video.Assets.create({
      input: videoUrl,
      playback_policy: 'public',
    });

    return res.status(200).json({
      success: true,
      assetId: asset.id,
      playbackId: asset.playback_ids?.[0]?.id,
    });
  } catch (error) {
    console.error('Mux upload error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
