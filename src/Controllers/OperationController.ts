import { ConnectCompany } from "../index";
import { DataSource } from "typeorm";
import { Request, Response } from "express";
import { GenericRepository } from "../Core/GenericRepository";
import { Operation } from "../Models/Operation";
import { IOperation } from "Interfaces/Operation";

export class OperationController {
    async GetAllOperations(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoOperations = new GenericRepository<Operation>(Operation, appConnection);
        try {
            const valueToSearch = req.params.searchTerm;
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let operationsMapped: Array<IOperation> = [];
            let predicate!: (x: IOperation, index: number) => boolean;
            /* Decidir si se tendra un search aqui*/
            //if (valueToSearch != "" && valueToSearch != undefined) predicate = x => x.name.startsWith(valueToSearch);
            (await _repoOperations.GetListAsync(predicate, page, quantity, ["product", "audit"])).forEach(element => {
                operationsMapped.push(element);
            });
            res.status(200).json({ data: operationsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async GetOperationById(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoOperations = new GenericRepository<Operation>(Operation, appConnection);
        try {
            const id = parseInt(req.params.id);
            let predicate: (x: Operation) => boolean = x => x.id as number == id;
            const Operation: Operation = await _repoOperations.FindWhereAsync(predicate);
            if (Operation != null && Operation != undefined) res.status(200).json({ data: Operation });
            else res.status(404).json({ message: "Operation Not Found" });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async GetOperationsByAuditId(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoOperations = new GenericRepository<Operation>(Operation, appConnection);
        try {
            const auditToSearch = parseInt(req.params.auditid);
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let operationsMapped: Array<IOperation> = [];
            let predicate!: (x: IOperation, index: number) => boolean;
            if (auditToSearch != null && auditToSearch != undefined) predicate = x => x.audit.id as number == auditToSearch;
            else res.status(404).json({ message: "Audit Not Found" });
            (await _repoOperations.GetListAsync(predicate, page, quantity, ["product", "audit"])).forEach(element => {
                operationsMapped.push(element);
            });
            res.status(200).json({ data: operationsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async AddOperation(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoOperations = new GenericRepository<Operation>(Operation, appConnection);
        try {
            const NewOperation = new Operation();
            if(!["input", "output"].includes(req.body.type)) throw(Error("Invalid operation type"));
            NewOperation.product = req.body.product;
            NewOperation.type = req.body.type
            NewOperation.quantity = req.body.quantity;
            NewOperation.audit = req.body.audit;
            const objectToSend = await _repoOperations.InsertAsync(NewOperation);
            console.log(objectToSend);
            res.status(201).json({ data: objectToSend });
        }
        catch (err: any) {
            console.error(err);
            res.status(500).json({message: err.message});
        }
    }
    
    async UpdateOperation(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoOperations = new GenericRepository<Operation>(Operation, appConnection);
        try {
            const id = parseInt(req.params.id);
            const operationToUpdate = await _repoOperations.FindWhereAsync(x => x.id == id);
            if (operationToUpdate == null || operationToUpdate == undefined) return res.status(404).json({message: "Operation Not Found"});
            if(!["input", "output"].includes(req.body.type)) throw(Error("Invalid operation type"));
            operationToUpdate.product = req.body.product;
            operationToUpdate.type = req.body.type;
            operationToUpdate.quantity = req.body.quantity;
            operationToUpdate.audit = req.body.audit;
            const result = await _repoOperations.UpdateAsync(id, operationToUpdate);
            const response: number = result.affected as number;
            if (response > 0) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async DeleteOperation(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoOperations = new GenericRepository<Operation>(Operation, appConnection);
        try {
            const id = parseInt(req.params.id);
            const operationToDelete = await _repoOperations.FindWhereAsync(x => x.id == id);
            if (operationToDelete == null || operationToDelete == undefined) return res.status(404).json({message: "Operation Not Found"});
            const result = await _repoOperations.DeleteAsync(operationToDelete);
            if (result != null && result != undefined) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
}