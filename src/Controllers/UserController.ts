import { ConnectAuth } from "../index";
import { DataSource } from "typeorm";
import { Request, Response } from "express";
import { GenericRepository } from "../Core/GenericRepository";
import { User } from "../Models/User";
import { IUser } from "../Interfaces/User";
import { IUserAuth } from "../Interfaces/UserAuth";
import { AuthService } from "../Services/Auth.service";

export class UserController {
    async GetAllUsers(req: Request, res: Response) {
        const userHeader: any = req.headers['x-user'];
        const user = userHeader.user;

        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        try {
            const valueToSearch = req.params.searchTerm;
            const page = parseInt(req.params.page);
            const quantity = parseInt(req.params.quantity);
            let usersMapped: Array<IUser> = [];
            let predicate!: (x: IUser) => boolean
            /* Decidir si se tendra un search aqui*/
            if(user.companyId != -1) predicate = x => (x.companyId as number) == user.companyId;
            //if (valueToSearch != "" && valueToSearch != undefined) predicate = x => x.name.startsWith(valueToSearch);
            (await _repoUsers.GetListAsync(predicate, page, quantity)).forEach(element => {
                usersMapped.push(element);
            });
            res.status(200).json({ data: usersMapped });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    } 

    async GetUserById(req: Request, res: Response) {
        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        try {
            const id = parseInt(req.params.id);
            let predicate: (x: User) => boolean = x => (x.id as number) == id;
            const User: User = await _repoUsers.FindWhereAsync(predicate);
            if (User != null && User != undefined) return res.status(404).json({ message: "User Not Found" });
            return res.status(200).json({ data: User });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async AddUser(req: Request, res: Response) {
        const userHeader: any = req.headers['x-user'];
        const user = userHeader.user;

        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        const authService = new AuthService();
        const newUserData: IUser = req.body;
        
        try {
            if (
                !newUserData.email || newUserData.email == "" || 
                !newUserData.password || newUserData.password == ""
            ) return res.status(400).json({message: "Missing User Fields"});
            
            let predicate: (x: User) => boolean = x => (x.email as string) == newUserData.email;
            const userData: IUser = await _repoUsers.FindWhereAsync(predicate);
            
            if(userData) return res.status(409).json({message: "User Already Exists"});

            if (
                !newUserData.name || newUserData.name == "" || 
                !newUserData.photo || newUserData.photo == ""|| 
                !newUserData.roleId || newUserData.roleId == undefined
            ) return res.status(400).json({message: "Missing User Fields"});

            if (newUserData.roleId <= user.roleId) return res.status(403).json({message: "Can't create a user with equal or higher role than you"});

            newUserData.password = await authService.EncryptPassword(user.password)

            const newUser = new User();
            newUser.name = newUserData.name;
            newUser.email = newUserData.email;
            newUser.photo = newUserData.photo;
            newUser.companyId = user.companyId;
            newUser.roleId = newUserData.roleId;
            newUser.password = newUserData.password;
            newUser.createdAt = new Date();

            const savedUser = await _repoUsers.InsertAsync(newUser);

            return res.status(201).json({
                message: "User Created Successful"
            });

        } catch (err: any) {
            res.status(500).json({message: err.message});
        }
    }
    
    async UpdateUser(req: Request, res: Response) {
        const userHeader: any = req.headers['x-user'];
        const user = userHeader.user;

        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        const newUserData: IUser = req.body;

        try {
            const userToEditId = parseInt(req.params.id);

            const userToUpdate = await _repoUsers.FindWhereAsync(x => x.id == userToEditId);
            if (userToUpdate == null || userToUpdate == undefined) return res.status(404).json({message: "User Not Found"});
            if (user.companyId != -1) {
                if (userToUpdate.companyId != user.companyId) return res.status(403).json({message: "Can't edit a user from another company"});
                if (userToUpdate.id != user.id && userToUpdate.roleId <= user.roleId) return res.status(403).json({message: "Can't update a user with equal or higher role than you"});
                if (newUserData.roleId <= user.roleId) return res.status(403).json({message: "Can't assign an equal or higher role than yours to a user"});
            }
            userToUpdate.name = newUserData.name;
            userToUpdate.email = newUserData.email;
            userToUpdate.photo = newUserData.photo;
            userToUpdate.roleId = newUserData.roleId;
            
            const result = await _repoUsers.UpdateAsync(userToEditId, userToUpdate);
            //const response: number = result.affected as number;
            //if (response > 0) return res.sendStatus(204);
            return res.status(204).json({
                message: "User Updated Successful"
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
    
    async DeleteUser(req: Request, res: Response) {
        const userHeader: any = req.headers['x-user'];
        const user = userHeader.user;

        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        try {
            const id = parseInt(req.params.id);
            const userToDelete = await _repoUsers.FindWhereAsync(x => x.id == id);
            if (userToDelete == null || userToDelete == undefined) return res.status(404).json({message: "User Not Found"});
            if (user.companyId != -1) {
                if (userToDelete.companyId != user.companyId) return res.status(403).json({message: "Can't delete a user from another company"});
                if (userToDelete.id != user.id && userToDelete.roleId <= user.roleId) return res.status(403).json({message: "Can't delete a user with equal or higher role than you"});
            }
            const result = await _repoUsers.DeleteAsync(userToDelete);
            //if (result != null && result != undefined) res.status(204).json();
            return res.status(204).json({
                message: "User Deleted Successful"
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }

    async ChangeUserPassword(req : Request, res : Response) {
        const userHeader: any = req.headers['x-user'];
        const user = userHeader.user;

        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        const authService = new AuthService();
        
        try {
            const userToEditId = parseInt(req.params.id);
            const newPassword = req.body.newPassword;

            if(!newPassword || newPassword == "") return res.status(400).json({message: "Missing New Password"});

            const userToUpdate = await _repoUsers.FindWhereAsync(x => x.id == userToEditId);
            if (userToUpdate == null || userToUpdate == undefined) return res.status(404).json({message: "User Not Found"});
            if (user.companyId != -1) {
                if (userToUpdate.companyId != user.companyId) return res.status(403).json({message: "Can't edit a user from another company"});
                if (userToUpdate.id != user.id && userToUpdate.roleId <= user.roleId) return res.status(403).json({message: "Can't update a user with a higher role than you"});
            }
            userToUpdate.password = await authService.EncryptPassword(newPassword)
            const result = await _repoUsers.UpdateAsync(userToEditId, userToUpdate);
            //const response: number = result.affected as number;
            //if (response > 0) return res.sendStatus(204);
            return res.status(204).json({message: "User Password Updated Successful"});
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: err});
        }
    }
}