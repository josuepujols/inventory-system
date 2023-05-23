import { Router } from "express";
import productTypeRoutes from "./ProductType.route";
import productBrandRoutes from "./ProductBrand.route";
import auditRoutes from "./Audit.route";
import productRoutes from "./Product.route";
import operationRoutes from "./Operation.route";
import userRoutes from "./User.route";
import authRoutes from "./Auth.route";
import { JWTService } from "../Services/JWT.service";

const appRouter = Router();
const jwtService: JWTService = new JWTService();

appRouter.use("/api/types", productTypeRoutes);
appRouter.use("/api/brands", productBrandRoutes);
appRouter.use("/api/audits", auditRoutes);
appRouter.use("/api/products", jwtService.AuthenticateJWT, productRoutes);
appRouter.use("/api/operations", operationRoutes);
appRouter.use("/api/users", jwtService.AuthenticateJWT, userRoutes);
appRouter.use("/api/auth", authRoutes);

export default appRouter;