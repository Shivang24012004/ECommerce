import express from "express";
import { registerController,loginController,testController,forgotPasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController } from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routing
// Register || method:POST
router.post("/register", registerController);

// Login || method:POST
router.post("/login", loginController);

// Forgot password || method:POST
router.post("/forgot-password", forgotPasswordController);

//test route for middleware-to be removed...
router.get("/test",requireSignIn,isAdmin,testController);

//protected route auth
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})

//admin route auth
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

//update user profile
router.put("/profile",requireSignIn,updateProfileController);

//orders
router.get("/orders",requireSignIn,getOrderController);

//all orders for admin panel
router.get("/all-orders",requireSignIn,isAdmin,getAllOrderController);

//order status update
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController);

export default router;