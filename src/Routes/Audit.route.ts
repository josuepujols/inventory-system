import { Router } from "express";
import { AuditController } from "../Controllers/AuditController";

const router = Router();
(async () => {
    const auditController = new AuditController();
    router.get("/all", auditController.GetAllAudits);
    router.get("/find/:id", auditController.GetAuditById);
    router.get("/:page/:quantity", auditController.GetAllAudits);
    router.get("/at/:page/:quantity/:year/:month/:day/:date", auditController.GetAuditsByDate);
    router.get("/after/:page/:quantity/:searchTerm", auditController.GetAuditsAfterDate);
    router.get("/before/:page/:quantity/:searchTerm", auditController.GetAuditsBeforeDate);
    router.post("/add", auditController.AddAudit);
    //router.put("/update/:id", auditController.UpdateAudit);
    //router.delete("/delete/:id", auditController.DeleteAudit);
  })(); 

export default router; 