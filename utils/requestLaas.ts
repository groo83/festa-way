import axios from 'axios';

export async function requestLaas(question: string) {
  const {
    LAAS_API_URL,
    LAAS_PROJECT,
    LAAS_API_KEY,
    LAAS_HASH
  } = process.env;

  const headers = {
    project: LAAS_PROJECT,
    apiKey: LAAS_API_KEY,
    'Content-Type': 'application/json; charset=utf-8',
  };

  const body = {
    hash: LAAS_HASH,
    params: { question },
  };

  const response = await axios.post(LAAS_API_URL as string, body, { headers });
  return response.data;
}