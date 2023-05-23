import { ConnectCompany } from "../index";
import { DataSource } from "typeorm";
import { Request, Response } from "express";
import { GenericRepository } from "../Core/GenericRepository";
import { ProductBrand } from "../Models/ProductBrand";
import { IProductBrand } from "Interfaces/ProductBrand";

export class ProductBrandController {
    async GetAllBrands(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductBrands = new GenericRepository<ProductBrand>(ProductBrand, appConnection);
        try {
            const valueToSearch = req.params.searchTerm;
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let brandsMapped: Array<IProductBrand> = [];
            let predicate!: (x: IProductBrand, index: number) => boolean;
            if (valueToSearch != "" && valueToSearch != undefined) predicate = x => x.name.startsWith(valueToSearch);
            (await _repoProductBrands.GetListAsync(predicate, page, quantity)).forEach(element => {
                brandsMapped.push(element);
            });
            res.status(200).json({ data: brandsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async GetBrandById(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductBrands = new GenericRepository<ProductBrand>(ProductBrand, appConnection);
        try {
            const id = parseInt(req.params.id);
            let predicate: (x: ProductBrand) => boolean = x => x.id as number == id;
            const productBrand: ProductBrand = await _repoProductBrands.FindWhereAsync(predicate);
            if (productBrand != null && productBrand != undefined) res.status(200).json({ data: productBrand });
            else res.status(404).json({ message: "Brand Not Found" });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async AddBrand(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductBrands = new GenericRepository<ProductBrand>(ProductBrand, appConnection);
        try {
            const NewBrand = new ProductBrand();
            NewBrand.name = req.body.name;
            NewBrand.createdAt = new Date();
            NewBrand.name.toLocaleLowerCase();
            const objectToSend = await _repoProductBrands.InsertAsync(NewBrand);
            console.log(objectToSend);
            res.status(201).json({ data: objectToSend });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async UpdateBrand(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductBrands = new GenericRepository<ProductBrand>(ProductBrand, appConnection);
        try {
            const id = parseInt(req.params.id);
            const brandToUpdate = await _repoProductBrands.FindWhereAsync(x => x.id == id);
            if (brandToUpdate == null || brandToUpdate == undefined) return res.status(404).json({message: "Brand Not Found"});
            brandToUpdate.name = req.body.name;
            brandToUpdate.name = brandToUpdate.name.toLowerCase();
            const result = await _repoProductBrands.UpdateAsync(id, brandToUpdate);
            const response: number = result.affected as number;
            if (response > 0) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async DeleteBrand(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductBrands = new GenericRepository<ProductBrand>(ProductBrand, appConnection);
        try {
            const id = parseInt(req.params.id);
            const brandToDelete = await _repoProductBrands.FindWhereAsync(x => x.id == id);
            if (brandToDelete == null || brandToDelete == undefined) return res.status(404).json({message: "Brand Not Found"});
            const result = await _repoProductBrands.DeleteAsync(brandToDelete);
            if (result != null && result != undefined) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
}