import { useContext } from "react";
import { ProductContextType } from "../types/product";
import { ProductContext } from "../context/ProdContext";

export function useProducts(): ProductContextType {
    const context = useContext(ProductContext);
    if (context === undefined) {
      throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
  }