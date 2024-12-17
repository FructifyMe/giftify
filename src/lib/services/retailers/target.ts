import { REDCIRCLE_API_KEY } from '@/config/env';

interface TargetProduct {
  request_info: {
    success: boolean;
    message?: string;
  };
  product?: {
    title: string;
    target_id: string;
    price?: number;
  };
}

export async function getTargetPrice(productId: string): Promise<number | null> {
  if (!productId) {
    console.log('No Target product ID provided');
    return null;
  }

  try {
    console.log('Fetching price for Target product:', productId);
    
    const url = `https://api.redcircleapi.com/request?api_key=${REDCIRCLE_API_KEY}&type=product&target_id=${productId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TargetProduct = await response.json();

    if (!data.request_info?.success) {
      throw new Error(data.request_info?.message || 'API request unsuccessful');
    }

    const price = data.product?.price;
    if (typeof price !== 'number') {
      console.log('No valid price found in response');
      return null;
    }

    console.log('Successfully fetched Target price:', price);
    return price;
  } catch (error) {
    console.error('Error fetching price from Target:', error);
    return null;
  }
}

export function extractTargetId(url: string): string | null {
  if (!url) return null;

  // Handle different Target URL formats
  const patterns = [
    /\/A-(\d+)/, // Standard product URL
    /(?:\/|\?|&)(?:product_id|item_id)=(\d+)(?:\/|&|$)/i // Query parameter
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const id = match[1];
      console.log('Extracted Target ID:', id, 'from URL:', url);
      return id;
    }
  }

  console.log('No Target product ID found in URL:', url);
  return null;
}