import { Request, Response } from "express";
import { AuthService } from '../Services/Auth.service';
import { ConnectAuth } from '../index';
import { GenericRepository } from '../Core/GenericRepository';
import { User } from '../Models/User';
import { IUser } from '../Interfaces/User';
import { IUserAuth } from '../Interfaces/UserAuth';
import jwt from "jsonwebtoken";
import { RefreshToken } from "../Helpers/RefreshTokens";

export class AuthController {
    /*
    async SignUp(req : Request, res : Response) {
        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        const authService = new AuthService();
        const user: IUser = req.body;
        
        try {
            if (
                !user.email || user.email == "" || 
                !user.password || user.password == ""
            ) return res.status(400).json({message: "Missing User Fields"});
            
            let predicate: (x: User) => boolean = x => x.email as string == user.email;
            const userData: IUser = await _repoUsers.FindWhereAsync(predicate);
            if(userData) return res.status(409).json({message: "User Already Exists"});
            
            if (
                !user.name || user.name == "" || 
                !user.photo || user.photo == ""|| 
                !user.company || user.company == undefined || 
                !user.role || user.role == undefined
            ) return res.status(400).json({message: "Missing User Fields"});

            user.password = await authService.EncryptPassword(user.password)

            const newUser = new User();
            newUser.name = user.name;
            newUser.email = user.email;
            newUser.photo = user.photo;
            newUser.company = user.company;
            newUser.role = user.role;
            newUser.password = user.password;
            newUser.createdAt = new Date();

            const savedUser = await _repoUsers.InsertAsync(newUser);

            console.log(savedUser);

            // const token: string = jwt.sign({ 
            //     _id: savedUser.id,
            //     user: savedUser
            // // }, process.env.JWT_SECRET || "jwtsecret", {expiresIn: '30m'}); /* Agregar expiracion al token *
            // }, process.env.JWT_SECRET || "jwtsecret", { expiresIn: '30s'});

            // const refreshtoken: string = jwt.sign({ 
            //     _id: savedUser.id,
            //     user: savedUser
            // }, process.env.JWT_REFRESH_SECRET || "jwtrefreshsecret");

            // RefreshToken.refreshTokens[refreshtoken] = {
            //     token: refreshtoken,
            //     refreshtoken: refreshtoken
            // }

            // res.header("auth-token", token).header('refresh-token', refreshtoken).status(200).json({
            //     message: "SignUp Successful"
            // }); 

            res.status(205).json({
                message: "SignUp Successful"
            }); 

        } catch (err: any) {
            res.status(500).json({message: err.message});
        }
    };
    */
    
    async SignIn (req : Request, res : Response) {
        const appConnection = await ConnectAuth();
        const _repoUsers = new GenericRepository<User>(User, appConnection);
        const authService = new AuthService();
        const userCreds: IUserAuth = req.body;
        
        try {
            if (
                !userCreds.email || userCreds.email == "" || 
                !userCreds.password || userCreds.password == ""
            ) return res.status(401).json({message: "Missing Credentials"});
            
            let predicate: (x: User) => boolean = x => x.email as string == userCreds.email;
            const userData: IUser = await _repoUsers.FindWhereAsync(predicate);
            if(!userData) return res.status(403).json({message: "Invalid Credentials"});
        
            const isPasswordValidated: boolean = await authService.ComparePassword(userCreds.password, userData.password);

            if(!isPasswordValidated) return res.status(403).json({message: "Invalid Credentials"});

            const token: string = jwt.sign({ 
                _id: userData.id,
                user: userData
            }, process.env.JWT_SECRET || "3baa2d1cc92797f836f90b47e6eea575", { expiresIn: '30s'}); //jwtsecret

            const refreshtoken: string = jwt.sign({ 
                _id: userData.id,
                user: userData
            }, process.env.JWT_REFRESH_SECRET || "6f82cbe7bf1bfa16e2cc26d1cf5ecc4d"); //jwtrefreshsecret

            RefreshToken.refreshTokens[refreshtoken] = {
                token: refreshtoken,
                refreshtoken: refreshtoken
            }

            res.header("auth-token", token).header('refresh-token', refreshtoken).status(200).json({
                message: "SignIn Successful"
            }); 

        } catch (err: any) {
            res.status(500).json({message: err.message});
        }
    }
}
