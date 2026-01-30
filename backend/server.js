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
const port = process.env.PORT || 3000;
connectDB()
connectCloudinary()

//Middleware
const allowedOrigins = [
    'https://forever-ecommerce-lilac.vercel.app',
    'https://forever-ecommerce-frontend-one.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//api endpoints

app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',CartRouter)
app.use('/api/order',orderRouter)

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

