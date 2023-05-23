import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { RoleService } from "../Services/Role.service";

const roleService: RoleService = new RoleService();

const router = Router();
(async () => {
    const userController = new UserController();
    router.get("/all", roleService.AdminRoute, userController.GetAllUsers);
    router.get("/find/:id", roleService.AdminRoute, userController.GetUserById);
    router.get("/:page/:quantity", roleService.AdminRoute, userController.GetAllUsers);
    router.get("/:page/:quantity/:searchTerm", roleService.AdminRoute, userController.GetAllUsers);
    router.post("/add", roleService.AdminRoute, userController.AddUser);
    router.put("/update/:id", roleService.AdminRoute, userController.UpdateUser);
    router.put("/changepassword", userController.ChangeUserPassword);
    router.put("/changepassword/:id", userController.ChangeUserPassword);
    router.delete("/delete/:id", roleService.AdminRoute, userController.DeleteUser);
  })(); 

export default router; 