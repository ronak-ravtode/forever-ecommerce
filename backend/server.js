import express from "express";
import cors from "cors";
import "dotenv/config"; 
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import { ApiError } from "./utils/ApiError.js";
import CartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
//App config
const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//api endpoints

app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',CartRouter)
app.use('/api/order',orderRouter)

app.use((req, res, next) => {
    next(new ApiError(404, "Route not found"))
})

app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500
    const message = err?.message || "Internal server error"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err?.errors || [],
        data: null,
    })
})

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

