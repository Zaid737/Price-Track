export type PriceHistoryItem = {
  price: number;
  date: string; // Optional, to track when each price was recorded
};

export type User = {
  email: string;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: boolean;
  users?: User[];
  platform?: "amazon" | "snapdeal"; // Added to distinguish products by platform
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
  currentPrice: number; // Include latest price in the email info
  discountRate?: number; // Optional, only included if a discount is available
  platform: "amazon" | "snapdeal"; // Include platform in email content
};
