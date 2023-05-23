import { Router } from "express";
import { ProductController } from "../Controllers/ProductController";

const router = Router();
(async () => {
    const productController = new ProductController();
    router.get("/all", productController.GetAllProducts);
    router.get("/find/:id", productController.GetProducteById);
    router.get("/:page/:quantity", productController.GetAllProducts);
    router.get("/:page/:quantity/:searchTerm", productController.GetAllProducts);
    router.post("/add", productController.AddProduct);
    router.put("/update/:id", productController.UpdateProduct);
    router.delete("/delete/:id", productController.DeleteProduct);
  })(); 

export default router; 