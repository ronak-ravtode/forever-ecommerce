import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// global variables
const currency = "INR";
const deliveryCharge = 10;

// Placing order using COD method
const placeOrder = asyncHandler(async (req, res) => {
    const { items, amount, address } = req.body;

    const orderData = {
        userId: req.userId,
        items,
        address,
        amount,
        paymentMethod: "COD",
        payment: false,
        date: Date.now()
    }

    const newOrder = await Order.create(orderData)
    await newOrder.save()

    await User.findByIdAndUpdate(req.userId, { cartData: {} })

    res.status(200).json(new ApiResponse(200, "Order placed successfully", newOrder))
})

// Get all orders for admin panel
const allOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
    res.status(200).json(new ApiResponse(200, "Orders fetched successfully", orders))
})

//Get user orders for frontend
const userOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.userId })
    res.status(200).json(new ApiResponse(200, "Orders fetched successfully", orders))
})

//Update order status for admin panel
const updateStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status })
    res.status(200).json(new ApiResponse(200, "Order status updated successfully", order))
})

export { placeOrder, allOrders, userOrders, updateStatus }