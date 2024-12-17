export const RAINFOREST_API_KEY = import.meta.env.VITE_RAINFOREST_API_KEY;
export const BLUECART_API_KEY = import.meta.env.VITE_BLUECART_API_KEY;
export const REDCIRCLE_API_KEY = import.meta.env.VITE_REDCIRCLE_API_KEY;

if (!RAINFOREST_API_KEY || !BLUECART_API_KEY || !REDCIRCLE_API_KEY) {
  throw new Error('Missing required API keys in environment variables');
}