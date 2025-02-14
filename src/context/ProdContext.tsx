import React, { createContext } from 'react';
import { Product, ProductContextType } from '../types/product';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateSku } from '../utils/generateSku';
//eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);

  const addProduct = (productData: Omit<Product, 'sku' | 'createdAt'>) => {
    const newProduct = {
      ...productData,
      sku: generateSku(productData.type),
      createdAt: Date.now(),
    } as Product;
    
    setProducts(prev => [...prev, newProduct].sort((a, b) => b.createdAt - a.createdAt));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.sku === updatedProduct.sku 
          ? { ...updatedProduct, createdAt: product.createdAt }
          : product
      )
    );
  };

  const deleteProducts = (skus: string[]) => {
    setProducts(prev => prev.filter(product => !skus.includes(product.sku)));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

