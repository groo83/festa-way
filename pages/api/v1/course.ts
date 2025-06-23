import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// 환경변수 로드 (Next.js는 자동으로 process.env 에 주입)
const {
  LAAS_API_URL,
  LAAS_PROJECT,
  LAAS_API_KEY,
  LAAS_HASH
} = process.env

type RequestBody = {
  question: string
}

type ApiResponse = {
  result?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { question } = req.body as RequestBody

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Invalid request: question required' })
  }

  try {
    const headers = {
      project: LAAS_PROJECT,
      apiKey: LAAS_API_KEY,
      'Content-Type': 'application/json; charset=utf-8',
    }

    const body = {
      hash: LAAS_HASH,
      params: {
        question,
      },
    }

    const response = await axios.post(
      LAAS_API_URL as string,
      body,
      { headers }
    )

    res.status(200).json({ result: response.data })
  } catch (error: any) {
    console.error('API 호출 실패:', error)
    res.status(500).json({ error: 'Failed to fetch completion' })
  }
}
