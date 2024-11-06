import React, { useState } from 'react';
import { Modal } from './Modal';
import { useStore } from '../store/useStore';
import { fetchShopifyProducts, fetchWooCommerceProducts } from '../services/api';
import { Product } from '../types';
import { ShoppingBag, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportProductsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const addLink = useStore((state) => state.addLink);

  const importProducts = async (platform: 'shopify' | 'woocommerce') => {
    setLoading(true);
    try {
      const products = await (platform === 'shopify' 
        ? fetchShopifyProducts() 
        : fetchWooCommerceProducts()
      );
      
      products.forEach((product: Product) => {
        addLink({
          id: crypto.randomUUID(),
          type: 'product',
          data: product
        });
      });
      
      onClose();
    } catch (error) {
      console.error('Error importing products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Products">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => importProducts('shopify')}
            disabled={loading}
            className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            ) : (
              <div className="text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Import from Shopify
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => importProducts('woocommerce')}
            disabled={loading}
            className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            ) : (
              <div className="text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Import from WooCommerce
                </span>
              </div>
            )}
          </button>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};