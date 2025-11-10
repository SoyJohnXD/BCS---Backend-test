const API_GATEWAY_URL =
  process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error(
    "No se encontró API_GATEWAY_URL ni NEXT_PUBLIC_API_GATEWAY_URL. Define una de ellas en .env.local"
  );
}

export const serverApi = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_GATEWAY_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers: defaultHeaders,
  });
};
