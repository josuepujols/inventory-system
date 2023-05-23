import { ProductType } from "../Models/ProductType";
import { ProductBrand } from "../Models/ProductBrand";
export interface IProduct {
    id?: number;
    photo: string;
    name: string;
    cost: number;
    price: number;
    barCode: string;
    quantity: number;
    createdAt: Date;
    productType: ProductType;
    productBrand: ProductBrand;
}