"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';

const isValidProductURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    // Check for Amazon
    const isAmazon = 
      hostname === 'www.amazon.com' || 
      hostname === 'amazon.com' || 
      hostname.startsWith('www.amazon.') || 
      hostname.startsWith('amazon.');

    // Check for Snapdeal
    const isSnapdeal = 
      hostname === 'www.snapdeal.com' || 
      hostname === 'snapdeal.com' || 
      hostname.startsWith('www.snapdeal.') || 
      hostname.startsWith('snapdeal.');

    // Valid product links typically include "/dp/" for Amazon and "/product/" for Snapdeal
    const isAmazonProduct = isAmazon && parsedURL.pathname.includes('/dp/');
    const isSnapdealProduct = isSnapdeal && parsedURL.pathname.includes('/product/');

    return (isAmazon && isAmazonProduct) || (isSnapdeal && isSnapdealProduct);
  } catch (error) {
    return false;
  }
}

const Searchbar: React.FC = () => {
  const [searchPrompt, setSearchPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidProductURL(searchPrompt);

    if (!isValidLink) return alert('Please provide a valid Amazon or Snapdeal link');

    try {
      setIsLoading(true);

      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
      if (product) {
        // You can handle the scraped product data here if needed
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form 
      className="flex flex-wrap gap-4 mt-12" 
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
        required
      />

      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default Searchbar;
