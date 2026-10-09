import { handleInquiry, tooMany } from '../server/inquiry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : req.headers['x-real-ip']) || 'unknown';
  if (tooMany(String(ip).trim())) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
  }

  const result = await handleInquiry(req.body);
  return res.status(result.status).json(result.body);
}
