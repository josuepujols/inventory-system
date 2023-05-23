import { OperationType } from "Helpers/OperationType.type";
import { Audit } from "Models/Audit";
import { Product } from "Models/Product";

export interface IOperation {
    id?: number;
    product: Product;
    type: OperationType;
    quantity: number;
    audit: Audit;
}