import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";


//protected routes
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
}

//admin access
export const isAdmin = async(req,res,next)=>{
    try {
        console.log(req.user);
        const user = await userModel.findById(req.user._id);

        if(user.role!==1) {
            return res.status(401).send({
                success:false,
                message:"Unauthorized access!"
            });
        }
        else {
            next();
        }

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:"error in admin middleware"
        });
    }
}