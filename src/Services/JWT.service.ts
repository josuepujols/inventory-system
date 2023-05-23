import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export class JWTService {
    AuthenticateJWT(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if(!authHeader) return res.sendStatus(401);

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || "jwtsecret", (err: any, user: any) => {
            if(err) return res.sendStatus(403);
            req.headers["x-user"] = user;
            next();
        })
    }
}