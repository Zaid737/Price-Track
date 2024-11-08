"use server";

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeSnapdealProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.USERNAME);
  const password = String(process.env.PASS);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $('.pdp-e-i-head').text().trim();

    // Extract prices with validation
    const extractedCurrentPrice = extractPrice($('.pdp-final-price'), $('.pdp-discounted-price'));
    const currentPrice = extractedCurrentPrice ? extractedCurrentPrice * 1000 : null;

    const extractedOriginalPrice = extractPrice($('.pdpCutPrice'));
    const originalPrice = extractedOriginalPrice ? extractedOriginalPrice * 1000 : null;

    // Check if the product is out of stock
    const outOfStock = $('.pdp-not-available').length > 0;

    // Collect the main product image
    const imageElement = $('img.cloudzoom');
    const image = imageElement.attr('src') || imageElement.attr('data-src') || '';

    // Extract currency symbol
    const currency = extractCurrency($('.pdp-final-price .currency-symbol')) || '₹';

    // Extract discount rate, or calculate if needed
    const extractedDiscountRate = $('.pdpDiscount').text().replace(/[-%]/g, "");
    const discountRate = Number(extractedDiscountRate) || (
      originalPrice && currentPrice ? ((originalPrice - currentPrice) / originalPrice) * 100 : 0
    );

    // Extract description
    const description = extractDescription($);

    // Calculate average, highest, and lowest prices with defaults
    const averagePrice = currentPrice && originalPrice ? 
      (currentPrice + originalPrice) / 2 : (currentPrice || originalPrice || 0);
    const lowestPrice = currentPrice ? Math.min(currentPrice, originalPrice || currentPrice) : (originalPrice || 0);
    const highestPrice = originalPrice ? Math.max(originalPrice, currentPrice || originalPrice) : (currentPrice || 0);

    // Construct data object with scraped information
    const data = {
      url,
      currency,
      image,
      title,
      currentPrice: Number(currentPrice) || 0,
      originalPrice: Number(originalPrice) || 0,
      priceHistory: [],
      discountRate: Number(discountRate) || 0,
      category: 'category', // Placeholder; consider setting dynamically
      reviewsCount: 100, // Placeholder; replace with actual data if available
      stars: 4.5, // Placeholder; replace with actual data if available
      isOutOfStock: outOfStock,
      description,
      lowestPrice,
      highestPrice,
      averagePrice,
    };

    return data;

  } catch (error: any) {
    console.error('Error fetching Snapdeal product data:', error.message);
  }
}
