import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";
import { requireSignIn } from "../middlewares/authMiddleware.js";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        //validation
        if (!name) {
            return res.send({ message: "Name is Required!" });
        }
        if (!email) {
            return res.send({ message: "Email is Required!" });
        }
        if (!password) {
            return res.send({ message: "Password is Required!" });
        }
        if (!phone) {
            return res.send({ message: "Phone-number is Required!" });
        }
        if (!address) {
            return res.send({ message: "Address is Required!" });
        }
        if (!answer) {
            return res.send({ message: "Answer is Required!" });
        }

        //check for existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered please login!"
            })
        }
        //register user
        const hashedPassword = await hashPassword(password);

        const user = await new userModel({ name, email, phone, address, answer, password: hashedPassword }).save();

        res.status(201).send({
            success: true,
            message: "User registered successfully!",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration!",
            error
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email/password"
            });
        }

        //find user
        const user = await userModel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found!"
            })
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid password!"
            })
        }

        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success: true,
            message: "Login successful!",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        });
    }
}

export const testController = (req, res) => {
    res.send("protected by middleware");
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Name is Required!" });
        }
        if (!answer) {
            return res.status(400).send({ message: "Answer is Required!" });
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New password is Required!" });
        }

        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email/Answer is incorrect!"
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password reset Successful!"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong!",
            error
        })
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        if (password && password.length < 6) {
            return res.json({ error: "Password should be greater than 6 chars!" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            address: address || user.address,
            phone: phone || user.phone,
        }, { new: true });
        res.status(200).send({
            success: true,
            message: "Profile Updated!",
            updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in Updation!",
            error
        })
    }
}

export const getOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error
        })
    }
}

export const getAllOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({createdAt:-1});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error
        })
    }
}

export const orderStatusController = async(req,res) => {
    try {
        const {orderId}=req.params;
        const {status}=req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating status",
            error
        })
    }
}