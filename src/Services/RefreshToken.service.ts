import { Request, Response, NextFunction } from "express";
import { RefreshToken } from "../Helpers/RefreshTokens";
import jwt from "jsonwebtoken";

export class RefreshTokenService {
    InvalidateRefreshToken(req: Request, res: Response) {
        const refreshToken = req.headers['x-refresh-token'] || req.body.refreshtoken;
        if(!refreshToken) return res.sendStatus(401);

        if(refreshToken && refreshToken in RefreshToken.refreshTokens) {
            delete RefreshToken.refreshTokens[refreshToken]
            return res.sendStatus(205)
        }
        res.sendStatus(403)
    }
    ValidateRefreshToken(refreshToken: string) {
        if(refreshToken && refreshToken in RefreshToken.refreshTokens) {
            let decodedjwt = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "jwtrefreshsecret")
            return decodedjwt
        }
        console.log(RefreshToken.refreshTokens);
        console.log(refreshToken in RefreshToken.refreshTokens);

        return null
    }
    RefreshJWT(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.headers['x-refresh-token'] || req.body.refreshtoken;

        if(!refreshToken) return res.sendStatus(401);

        let response: any = this.ValidateRefreshToken(refreshToken)

        if(!response) return res.sendStatus(403)


        const token = jwt.sign(response.user, 
            process.env.JWT_SECRET || "3baa2d1cc92797f836f90b47e6eea575", //jwtsecret
            { expiresIn: '30s'}
        );

        res.json({token: token})
    }
}