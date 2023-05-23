import { Request, Response, NextFunction } from "express";

export class RoleService {
    AdminRoute(req: Request, res: Response, next: NextFunction) {
        const userHeader: any = req.headers['x-user'];
        if(!userHeader || !userHeader.user) return res.sendStatus(401);
        const user = userHeader.user;
        if(![0,1].includes(user.roleId)) return res.sendStatus(403);
        next();
    }
}