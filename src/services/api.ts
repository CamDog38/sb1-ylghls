import axios from 'axios';
import { Product } from '../types';

// These would normally come from environment variables
const SHOPIFY_API_URL = 'YOUR_SHOPIFY_API_URL';
const WOOCOMMERCE_API_URL = 'YOUR_WOOCOMMERCE_API_URL';

export const fetchShopifyProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${SHOPIFY_API_URL}/products.json`);
    return response.data.products.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: parseFloat(product.variants[0].price),
      image: product.images[0]?.src,
      platform: 'shopify',
      url: `https://your-store.myshopify.com/products/${product.handle}`
    }));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
};

export const fetchWooCommerceProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${WOOCOMMERCE_API_URL}/products`);
    return response.data.map((product: any) => ({
      id: product.id,
      title: product.name,
      price: parseFloat(product.price),
      image: product.images[0]?.src,
      platform: 'woocommerce',
      url: product.permalink
    }));
  } catch (error) {
    console.error('Error fetching WooCommerce products:', error);
    return [];
  }
};