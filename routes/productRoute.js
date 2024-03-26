import express from "express";
import {requireSignIn,isAdmin} from "../middlewares/authMiddleware.js";
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProuctController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable"
import braintree from "braintree";

const router = express.Router();

//routes
router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController);

//update
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController);

//get products
router.get("/get-product",getProuctController)

//get single product
router.get("/get-product/:slug",getSingleProductController) 

//get photo
router.get("/product-photo/:pid",productPhotoController)

//delete product
router.delete("/delete-product/:pid",deleteProductController)

//filter product
router.post("/product-filters",productFiltersController)

//product count
router.get("/product-count",productCountController)

//product per page
router.get("/product-list/:page",productListController)

//search product
router.get("/search/:keyword",searchProductController)

//get similar product
router.get("/related-product/:pid/:cid",relatedProductController);

//product by category
router.get("/product-category/:slug",productCategoryController);

//payment route 
//token
router.get("/braintree/token",braintreeTokenController);
//payments
router.post("/braintree/payment",requireSignIn,brainTreePaymentController);

export default router;
