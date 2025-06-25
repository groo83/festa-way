import type { NextApiRequest, NextApiResponse } from 'next';
import { requestLaas } from '../../../utils/requestLaas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Invalid request: question required' });
  }
  try {
    const result = await requestLaas(question);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch completion' });
  }
}