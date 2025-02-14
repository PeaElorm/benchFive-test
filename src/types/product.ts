export type ProductType = "DVD" | "Book" | "Furniture";

export type BaseProduct = {
    sku: string;
    name: string;
    imageUrl?: string;
    price: number;
    type: ProductType;
    createdAt: number;
}

interface DVDProduct extends BaseProduct {
    type: "DVD";
    size: number;
}

interface BookProduct extends BaseProduct {
    type: "Book";
    weight: number;
}

interface FurnitureProduct extends BaseProduct {
    type: "Furniture";
    height: number;
    width: number;
    length: number;
}

export type Product = DVDProduct | BookProduct | FurnitureProduct;

export interface ProductContextType{
    products: Product[];
    addProduct: (product: Omit<Product, "createdAt" | "sku">) => void;
    deleteProducts: (skus: string[]) => void;
    updateProduct: (product: Product) => void;
}