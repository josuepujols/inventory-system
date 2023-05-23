import { Router } from "express";
import { ProductBrandController } from "../Controllers/ProductBrandController";

const router = Router();
(async () => {
    const productBrandController = new ProductBrandController();
    router.get("/all", productBrandController.GetAllBrands);
    router.get("/find/:id", productBrandController.GetBrandById);
    router.get("/:page/:quantity", productBrandController.GetAllBrands);
    router.get("/:page/:quantity/:searchTerm", productBrandController.GetAllBrands);
    router.post("/add", productBrandController.AddBrand);
    router.put("/update/:id", productBrandController.UpdateBrand);
    router.delete("/delete/:id", productBrandController.DeleteBrand);
  })(); 

export default router; 