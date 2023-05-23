import { ConnectCompany } from "../index";
import { Request, Response } from "express";
import { GenericRepository } from "../Core/GenericRepository";
import { Product } from "../Models/Product";
import { IProduct } from "../Interfaces/Product";
import { ProductType } from "../Models/ProductType";
import { ProductBrand } from "../Models/ProductBrand";

export class ProductController {
    async GetAllProducts(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProducts = new GenericRepository<Product>(Product, appConnection);
        try {
            const valueToSearch = req.params.searchTerm;
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let productsMapped: Array<IProduct> = [];
            let predicate!: (x: IProduct, index: number) => boolean;
            if (valueToSearch != "" && valueToSearch != undefined) predicate = x => x.name.startsWith(valueToSearch);
            (await _repoProducts.GetListAsync(predicate, page, quantity, ["productType", "productBrand"])).forEach(element => {
                productsMapped.push(element);
            });
            res.status(200).json({ data: productsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async GetProducteById(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProducts = new GenericRepository<Product>(Product, appConnection);
        try {
            const id = parseInt(req.params.id);
            let predicate: (x: Product) => boolean = x => (x.id as number) == id;
            const Product: Product = await _repoProducts.FindWhereAsync(predicate, ["productType", "productBrand"]);
            if (Product != null && Product != undefined) res.status(200).json({ data: Product });
            else res.status(404).json({ message: "Type Not Found" });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async AddProduct(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProducts = new GenericRepository<Product>(Product, appConnection);
        try {
            const productTypeObject: ProductType = new ProductType();
            productTypeObject.id = parseInt(req.body.productTypeId);
            const productBrandObject: ProductBrand = new ProductBrand();
            productBrandObject.id = parseInt(req.body.productBrandId);
            //building object
            const NewProduct = new Product();
            NewProduct.photo = req.body.photo;
            NewProduct.name = req.body.name;
            NewProduct.cost = parseInt(req.body.cost);
            NewProduct.price = parseInt(req.body.price);
            NewProduct.barCode = req.body.barCode;
            NewProduct.quantity = parseInt(req.body.quantity);
            NewProduct.createdAt = new Date();
            NewProduct.productType = productTypeObject;
            NewProduct.productBrand = productBrandObject;
            NewProduct.name.toLocaleLowerCase();

            const objectToSend = await _repoProducts.InsertAsync(NewProduct);
            res.status(201).json({ data: objectToSend });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async UpdateProduct(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProducts = new GenericRepository<Product>(Product, appConnection);
        try {
            const id = parseInt(req.params.id);
            const productToUpdate = await _repoProducts.FindWhereAsync(x => x.id == id);
            if (productToUpdate == null || productToUpdate == undefined) return res.status(404).json({message: "Product Not Found"});
            productToUpdate.photo = req.body.photo;
            productToUpdate.name = req.body.name;
            productToUpdate.cost = parseInt(req.body.cost);
            productToUpdate.price = parseInt(req.body.price);
            productToUpdate.barCode = req.body.barCode;
            productToUpdate.quantity = parseInt(req.body.quantity);
            const productType: ProductType = new ProductType();
            productType.id = req.body.productTypeId;
            const productBrand: ProductBrand = new ProductBrand();
            productType.id = req.body.productBrandId;
            productToUpdate.productType = productType;
            productToUpdate.productBrand = productBrand;
            productToUpdate.name = productToUpdate.name.toLowerCase();
        
            const result = await _repoProducts.UpdateAsync(id, productToUpdate);
            const response: number = result.affected as number;
            if (response > 0) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async DeleteProduct(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProducts = new GenericRepository<Product>(Product, appConnection);
        try {
            const id = parseInt(req.params.id);
            const typeToDelete = await _repoProducts.FindWhereAsync(x => x.id == id);
            if (typeToDelete == null || typeToDelete == undefined) return res.status(404).json({message: "Product Not Found"});
            const result = await _repoProducts.DeleteAsync(typeToDelete);
            if (result != null && result != undefined) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
}