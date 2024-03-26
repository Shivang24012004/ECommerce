import express from "express";
import { isAdmin,requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, updateCategoryController,categoryController, singleCategoryController, deleteCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

//routes
//create category route
router.post("/create-category",requireSignIn,isAdmin,createCategoryController);

//update category route
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController);

//get All category route
router.get("/get-category",categoryController);

//single category
router.get("/single-category/:slug",singleCategoryController);

//delete category
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController);



export default router;