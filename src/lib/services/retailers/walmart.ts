import { BLUECART_API_KEY } from '@/config/env';

interface WalmartProduct {
  request_info: {
    success: boolean;
    message?: string;
  };
  product?: {
    title: string;
    walmart_id: string;
    price?: number;
  };
}

export async function getWalmartPrice(productId: string): Promise<number | null> {
  if (!productId) {
    console.log('No Walmart product ID provided');
    return null;
  }

  try {
    console.log('Fetching price for Walmart product:', productId);
    
    const url = `https://api.bluecartapi.com/request?api_key=${BLUECART_API_KEY}&type=product&walmart_id=${productId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WalmartProduct = await response.json();

    if (!data.request_info?.success) {
      throw new Error(data.request_info?.message || 'API request unsuccessful');
    }

    const price = data.product?.price;
    if (typeof price !== 'number') {
      console.log('No valid price found in response');
      return null;
    }

    console.log('Successfully fetched Walmart price:', price);
    return price;
  } catch (error) {
    console.error('Error fetching price from Walmart:', error);
    return null;
  }
}

export function extractWalmartId(url: string): string | null {
  if (!url) return null;

  // Handle different Walmart URL formats
  const patterns = [
    /\/ip\/([^\/]+)\/(\d+)/, // Standard product URL
    /\/ip\/([^\/]+)/, // Short URL
    /(?:\/|\?|&)(?:product_id|item_id)=(\d+)(?:\/|&|$)/i // Query parameter
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const id = match[1];
      console.log('Extracted Walmart ID:', id, 'from URL:', url);
      return id;
    }
  }

  console.log('No Walmart product ID found in URL:', url);
  return null;
}