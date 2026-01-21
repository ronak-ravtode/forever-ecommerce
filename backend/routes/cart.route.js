import express from "express";
import { addToCart, updateCart, getCart } from "../controllers/cart.controller.js";
import authUser from "../middleware/auth.js";

const CartRouter = express.Router();

CartRouter.use(authUser)

CartRouter.post('/add', addToCart)
CartRouter.post('/update', updateCart)
CartRouter.post('/get', getCart)

export default CartRouter
