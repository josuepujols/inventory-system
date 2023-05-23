import { Router } from "express";
import { OperationController } from "../Controllers/OperationController";

const router = Router();
(async () => {
    const operationController = new OperationController();
    router.get("/all", operationController.GetAllOperations);
    router.get("/find/:id", operationController.GetOperationById);
    router.get("/audit/:auditid", operationController.GetOperationsByAuditId);
    router.get("/:page/:quantity", operationController.GetAllOperations);
    router.get("/:page/:quantity/:searchTerm", operationController.GetAllOperations);
    router.post("/add", operationController.AddOperation);
    router.put("/update/:id", operationController.UpdateOperation);
    router.delete("/delete/:id", operationController.DeleteOperation);
  })(); 

export default router; 