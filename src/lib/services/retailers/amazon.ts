import { RAINFOREST_API_KEY } from '@/config/env';

interface AmazonProduct {
  request_info: {
    success: boolean;
    message?: string;
    credits_used: number;
    credits_remaining: number;
  };
  product?: {
    title: string;
    asin: string;
    buybox_winner?: {
      price?: {
        value: number;
        currency: string;
        raw: string;
      };
    };
  };
}

export async function getAmazonPrice(asin: string): Promise<number | null> {
  if (!asin) {
    console.log('No ASIN provided');
    return null;
  }

  try {
    console.log('Fetching price for ASIN:', asin);
    
    const url = `https://api.rainforestapi.com/request?api_key=${RAINFOREST_API_KEY}&type=product&amazon_domain=amazon.com&asin=${asin}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AmazonProduct = await response.json();

    if (!data.request_info?.success) {
      throw new Error(data.request_info?.message || 'API request unsuccessful');
    }

    const price = data.product?.buybox_winner?.price?.value;
    if (typeof price !== 'number') {
      console.log('No valid price found in response');
      return null;
    }

    console.log('Successfully fetched price:', price);
    return price;
  } catch (error) {
    console.error('Error fetching price from amazon:', error);
    return null; // Return null instead of rethrowing to prevent continuous retries
  }
}

export function extractAmazonAsin(url: string): string | null {
  if (!url) return null;

  // Handle different Amazon URL formats
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /amzn\.to\/([A-Z0-9]{10})/i,
    /(?:\/|\?|&)(?:ASIN|asin|product)=([A-Z0-9]{10})(?:\/|&|$)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const asin = match[1].toUpperCase();
      console.log('Extracted ASIN:', asin, 'from URL:', url);
      return asin;
    }
  }

  console.log('No ASIN found in URL:', url);
  return null;
}