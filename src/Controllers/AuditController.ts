import { ConnectCompany } from "../index";
import { DataSource } from "typeorm";
import { Request, Response } from "express";
import { GenericRepository } from "../Core/GenericRepository";
import { Audit } from "../Models/Audit";
import { IAudit } from "Interfaces/Audit";

export class AuditController {
    async GetAllAudits(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            //const dateToSearch = new Date(req.params.searchTerm);
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let auditsMapped: Array<IAudit> = [];
            let predicate!: (x: IAudit, index: number) => boolean;
            //if (dateToSearch != undefined) predicate = x => x.createdAt > dateToSearch;
            (await _repoAudits.GetListAsync(predicate, page, quantity)).forEach(element => {
                auditsMapped.push(element);
            });
            res.status(200).json({ data: auditsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async GetAuditById(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            const id = parseInt(req.params.id);
            let predicate: (x: Audit) => boolean = x => x.id as number == id;
            const audit: Audit = await _repoAudits.FindWhereAsync(predicate);
            if (audit != null && audit != undefined) res.status(200).json({ data: audit });
            else res.status(404).json({ message: "Audit Not Found" });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async GetAuditsByDate(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            const searchByYear = Boolean(parseInt(req.params.year))
            const searchByMonth = Boolean(parseInt(req.params.month))
            const searchByDay = Boolean(parseInt(req.params.day))
            const date = new Date(req.params.date)

            if(isNaN(date.valueOf())) return res.status(400).json({message: "Invalid Date"});

            console.log(searchByYear, searchByMonth, searchByDay)

            let auditsMapped: Array<IAudit> = [];

            let predicate!: (x: IAudit, index: number) => boolean;

            predicate = x => {
                /* Uncomment if you want to return no audits if no params sent from client*/
                //if(!searchByYear && !searchByMonth && !searchByDay) return false;
                if(searchByDay && x.createdAt.getDay() != date.getDay()) return false;
                if(searchByMonth && x.createdAt.getMonth() != date.getMonth()) return false;
                if(searchByYear && x.createdAt.getFullYear() != date.getFullYear()) return false;
                return true
            }

            (await _repoAudits.GetListAsync(predicate, page, quantity)).forEach(element => {
                auditsMapped.push(element);
            });
            res.status(200).json({ data: auditsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async GetAuditsBeforeDate(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            const dateToSearch = new Date(req.params.searchTerm);
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let auditsMapped: Array<IAudit> = [];
            let predicate!: (x: IAudit, index: number) => boolean;
            if (dateToSearch != undefined) predicate = x => x.createdAt < dateToSearch;
            (await _repoAudits.GetListAsync(predicate, page, quantity)).forEach(element => {
                auditsMapped.push(element);
            });
            res.status(200).json({ data: auditsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async GetAuditsAfterDate(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            const dateToSearch = new Date(req.params.searchTerm);
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let auditsMapped: Array<IAudit> = [];
            let predicate!: (x: IAudit, index: number) => boolean;
            if (dateToSearch != undefined) predicate = x => x.createdAt > dateToSearch;
            (await _repoAudits.GetListAsync(predicate, page, quantity)).forEach(element => {
                auditsMapped.push(element);
            });
            res.status(200).json({ data: auditsMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async AddAudit(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            const NewAudit = new Audit();
            NewAudit.createdAt = new Date();
            const objectToSend = await _repoAudits.InsertAsync(NewAudit);
            console.log(objectToSend);
            res.status(201).json({ data: objectToSend });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
    
    /*
    async UpdateAudit(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            const id = parseInt(req.params.id);
            const auditToUpdate = await _repoAudits.FindWhereAsync(x => x.id == id);
            if (auditToUpdate == null || auditToUpdate == undefined) return res.status(404).json({message: "Audit Not Found"});
            const result = await _repoAudits.UpdateAsync(id, auditToUpdate);
            const response: number = result.affected as number;
            if (response > 0) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
    */

    /*
    async DeleteAudit(req: Request, res: Response) {
        const appConnection = await ConnectCompany("test");
        const _repoAudits = new GenericRepository<Audit>(Audit, appConnection);
        try {
            const id = parseInt(req.params.id);
            const auditToDelete = await _repoAudits.FindWhereAsync(x => x.id == id);
            if (auditToDelete == null || auditToDelete == undefined) return res.status(404).json({message: "Audit Not Found"});
            const result = await _repoAudits.DeleteAsync(auditToDelete);
            if (result != null && result != undefined) res.status(204).json();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
    */
}