import { Router } from "express";
import { AuthController } from "../Controllers/AuthController";
import { RefreshTokenService } from "../Services/RefreshToken.service";

const refreshTokenService: RefreshTokenService = new RefreshTokenService()

const router = Router();
(async () => {
    const authController = new AuthController();
    router.post("/signin", authController.SignIn);
    //router.post("/signup", authController.SignUp);
    router.post("/token", (req, res, next) => refreshTokenService.RefreshJWT(req, res, next));
    router.post("/logout", (req, res) => refreshTokenService.InvalidateRefreshToken(req, res));
  })(); 

export default router; 