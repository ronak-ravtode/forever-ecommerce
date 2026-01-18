import express from "express";
import { addProduct, getAllProducts, removeProduct, singleProduct } from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/admin.auth.js";

const productRouter = express.Router();

//Product routes
productRouter.post("/add",upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]), adminAuth, addProduct);
productRouter.get("/all", getAllProducts);
productRouter.delete("/remove", adminAuth, removeProduct);
productRouter.get("/single", singleProduct);


export default productRouter

