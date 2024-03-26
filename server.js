import express from "express";
import colors from "colors";
import dotenv from "dotenv"
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import productRoute from "./routes/productRoute.js"
import cors from 'cors';
import path from "path";

//configure env
dotenv.config();  //{path:xyz} if in another folder...

const PORT = process.env.PORT || 8080;

//database config
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product",productRoute);
app.use(express.static(path.join(__dirname,'./client/build')));

app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
});

//rest API
app.get("/", (req, res) => {
    res.send("<h1>welcome to e-commerce</h1>")
})

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`.bgCyan.white);
})