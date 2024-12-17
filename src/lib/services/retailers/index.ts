import { getAmazonPrice, extractAmazonAsin } from './amazon';
import { getWalmartPrice, extractWalmartId } from './walmart';
import { getTargetPrice, extractTargetId } from './target';

export type RetailerType = 'amazon' | 'walmart' | 'target' | 'unknown';

export function identifyRetailer(url: string): RetailerType {
  if (!url) return 'unknown';
  
  const urlLower = url.toLowerCase();
  if (urlLower.includes('amazon.com')) return 'amazon';
  if (urlLower.includes('walmart.com')) return 'walmart';
  if (urlLower.includes('target.com')) return 'target';
  
  return 'unknown';
}

export async function getCurrentPrice(url: string): Promise<number | null> {
  const retailer = identifyRetailer(url);
  let productId: string | null = null;
  
  switch (retailer) {
    case 'amazon':
      productId = extractAmazonAsin(url);
      if (productId) return await getAmazonPrice(productId);
      break;
    case 'walmart':
      productId = extractWalmartId(url);
      if (productId) return await getWalmartPrice(productId);
      break;
    case 'target':
      productId = extractTargetId(url);
      if (productId) return await getTargetPrice(productId);
      break;
  }

  console.log(`No valid product ID found for ${retailer} URL:`, url);
  return null;
}

export function getRetailerName(type: RetailerType): string {
  switch (type) {
    case 'amazon': return 'Amazon';
    case 'walmart': return 'Walmart';
    case 'target': return 'Target';
    default: return 'Unknown Retailer';
  }
}