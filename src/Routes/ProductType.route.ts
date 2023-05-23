import { Router } from "express";
import { ProductTypeController } from "../Controllers/ProductTypeController";

const router = Router();
(async () => {
    const productTypeController = new ProductTypeController();
    router.get("/all", productTypeController.GetAllTypes);
    router.get("/find/:id", productTypeController.GetTypeById);
    router.get("/:page/:quantity", productTypeController.GetAllTypes);
    router.get("/:page/:quantity/:searchTerm", productTypeController.GetAllTypes);
    router.post("/add", productTypeController.AddType);
    router.put("/update/:id", productTypeController.UpdateType);
    router.delete("/delete/:id", productTypeController.DeleteType);
  })(); 

export default router; 