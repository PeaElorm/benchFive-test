export type ProductType = "DVD" | "Book" | "Furniture";

export type BaseProduct = {
    sku: string;
    name: string;
    imageUrl?: string;
    price: number;
    type: ProductType;
    createdAt: number;
}