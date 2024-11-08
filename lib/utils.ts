import { PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      // Clean the price text to remove any unwanted characters
      const cleanPrice = priceText.replace(/[^\d.]/g, '');
      // Convert the cleaned price to a float
      const priceNumber = parseFloat(cleanPrice);

      if (!isNaN(priceNumber)) {
        return priceNumber;
      }
    }
  }

  return null; // Return null if no valid price found
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  // Assuming all prices are in Indian Rupees for Flipkart
  return '₹';
}

// Extracts description from possible elements on Flipkart
export function extractDescription($: any) {
  // Possible elements holding the description of the product
  const selectors = [
    "div.spec-body", 
    
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

 
  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  return Math.max(...priceList.map(item => item.price)); // Simplified using Math.max
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  return Math.min(...priceList.map(item => item.price)); // Simplified using Math.min
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
