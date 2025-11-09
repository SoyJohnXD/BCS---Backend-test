const API_GATEWAY_URL = process.env.API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error("La variable de entorno API_GATEWAY_URL no está definida");
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
