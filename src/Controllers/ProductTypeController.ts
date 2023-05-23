import { ConnectCompany } from "../index";
import { Request, Response } from "express";
import { GenericRepository } from "../Core/GenericRepository";
import { ProductType } from "../Models/ProductType";
import { IProductType } from "Interfaces/ProductType";

export class ProductTypeController {
    async GetAllTypes(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductTypes = new GenericRepository<ProductType>(ProductType, appConnection);
        try {
            const valueToSearch = req.params.searchTerm;
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let typesMapped: Array<IProductType> = [];
            let predicate!: (x: IProductType, index: number) => boolean;
            if (valueToSearch != "" && valueToSearch != undefined) predicate = x => x.name.startsWith(valueToSearch);
            (await _repoProductTypes.GetListAsync(predicate, page, quantity)).forEach(element => {
                typesMapped.push(element);
            });
            res.status(200).json({ data: typesMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async GetTypeById(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductTypes = new GenericRepository<ProductType>(ProductType, appConnection);
        try {
            const id = parseInt(req.params.id);
            let predicate: (x: ProductType) => boolean = x => x.id as number == id;
            const productType: ProductType = await _repoProductTypes.FindWhereAsync(predicate);
            if (productType != null && productType != undefined) res.status(200).json({ data: productType });
            else res.status(404).json({ message: "Type Not Found" });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async AddType(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductTypes = new GenericRepository<ProductType>(ProductType, appConnection);
        try {
            const NewType = new ProductType();
            NewType.name = req.body.name;
            NewType.createdAt = new Date();
            NewType.name.toLocaleLowerCase();
            const objectToSend = await _repoProductTypes.InsertAsync(NewType);
            console.log(objectToSend);
            res.status(201).json({ data: objectToSend });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async UpdateType(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductTypes = new GenericRepository<ProductType>(ProductType, appConnection);
        try {
            const id = parseInt(req.params.id);
            const typeToUpdate = await _repoProductTypes.FindWhereAsync(x => x.id == id);
            if (typeToUpdate == null || typeToUpdate == undefined) return res.status(404).json({message: "Type Not Found"});
            typeToUpdate.name = req.body.name;
            typeToUpdate.name = typeToUpdate.name.toLowerCase();
            const result = await _repoProductTypes.UpdateAsync(id, typeToUpdate);
            const response: number = result.affected as number;
            if (response > 0) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async DeleteType(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoProductTypes = new GenericRepository<ProductType>(ProductType, appConnection);
        try {
            const id = parseInt(req.params.id);
            const typeToDelete = await _repoProductTypes.FindWhereAsync(x => x.id == id);
            if (typeToDelete == null || typeToDelete == undefined) return res.status(404).json({message: "Type Not Found"});
            const result = await _repoProductTypes.DeleteAsync(typeToDelete);
            if (result != null && result != undefined) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
}