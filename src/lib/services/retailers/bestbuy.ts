export function parseBestBuyUrl(url: string): string {
  // Extract product ID from Best Buy URL
  const match = url.match(/\/([^\/]+)\.p\?/);
  return match ? match[1] : '';
}

export async function scrapeBestBuyPrice(productId: string): Promise<number | null> {
  try {
    // In production, use Best Buy's API or a scraping service
    const response = await fetch(`https://api.bestbuy.com/v1/products/${productId}?apiKey=${process.env.BESTBUY_API_KEY}&format=json`);
    const data = await response.json();
    return data.salePrice || null;
  } catch (error) {
    console.error('Error scraping Best Buy price:', error);
    return null;
  }
}