import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
    // import Stripe from "stripe";
    // import razorpay from "razorpay";

// //global variables
// const currency = "INR"
// const deliveryCharge = 10

//gatway intialize
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// const razorpayInstance = new razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// })


//Placing order using COD method
const placeOrder = asyncHandler(async (req, res) => {
    const { userId, items, amount, address } = req.body;

    const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "COD",
        payment: false,
        date: Date.now()
    }

    const newOrder = await Order.create(orderData)
    await newOrder.save()

    await User.findByIdAndUpdate(userId, { cartData: {} })

    res.status(200).json(new ApiResponse(200, "Order placed successfully", newOrder))
})

//Placing order using Stripe method
// const placeOrderStripe = asyncHandler(async (req, res) => {
//     const { userId, items, amount, address } = req.body;

//     const { origin } = req.headers

//     const orderData = {
//         userId,
//         items,
//         address,
//         amount,
//         paymentMethod: "Stripe",
//         payment: false,
//         date: Date.now()
//     }

//     const newOrder = await Order.create(orderData)
//     await newOrder.save()

//     const line_items = items.map((item) => ({
//         price_data: {
//             currency: currency,
//             product_data: {
//                 name: item.name
//             },
//             unit_amount: item.price * 100
//         },
//         quantity: item.quantity
//     }))

//     line_items.push({
//         price_data: {
//             currency: currency,
//             product_data: {
//                 name: "Delivery Charges"
//             },
//             unit_amount: 500
//         },
//         quantity: 1
//     })

//     const session = await stripe.checkout.sessions.create({
//         success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url:`${origin}/verify?canceled=true&orderId=${newOrder._id}`,
//         line_items,
//         mode:"payment",
//     })

//     res.status(200).json(new ApiResponse(200, "Order placed successfully", {session_url:session.url}))
// })

//Verify Stripe

// const verifyStripe = asyncHandler(async (req, res) => {
//     const { orderId,success,userId } = req.body;
//     if(success){
//         await Order.findByIdAndUpdate(orderId, { payment: true })
//         await User.findByIdAndUpdate(userId, { cartData: {} })
//     }else{
//         await Order.findByIdAndDelete(orderId)
//         return res.json({success:false,message:"Order verification failed"})
//     }
//     res.status(200).json(new ApiResponse(200, "Order verified successfully"))
// })

//Placing order using Razorpay method
// const placeOrderRazorpay = asyncHandler(async (req, res) => {
//     const { userId, items, amount, address } = req.body

//     const orderData = {
//         userId,
//         items,
//         address,
//         amount,
//         paymentMethod: "Razorpay",
//         payment: false,
//         date: Date.now()
//     }

//     const newOrder = await Order.create(orderData)
//     await newOrder.save()

//     const options = {
//         amount: amount * 100,
//         currency: currency,
//         receipt: newOrder._id.toString(),
//     }

//     razorpayInstance.orders.create(options, (error, order) => {
//         if(error){
//             console.log(error)
//             return res.status(400).json(new ApiResponse(400, "Order placed failed", error))
//         }
//         // Store razorpay_order_id in the order
//         Order.findByIdAndUpdate(newOrder._id, { razorpay_order_id: order.id }).then(() => {
//             return res.status(200).json(new ApiResponse(200, "Order placed successfully", order))
//         })
//     })
// })

// const verifyRazorpay = asyncHandler(async (req, res) => {
//     const {userId,razorpay_order_id} = req.body
//     console.log(razorpay_order_id)
//     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
//     console.log(orderInfo)
//     if(orderInfo.status === "paid"){
//         await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true })
//         await User.findByIdAndUpdate(userId, { cartData: {} })
//         return res.status(200).json(new ApiResponse(200, "Payment successfully"))
//     }
//     return res.status(200).json(new ApiResponse(200, "Payment failed"))
// })

//Get all orders for admin panel
const allOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
    res.status(200).json(new ApiResponse(200, "Orders fetched successfully", orders))
})

//Get user orders for frontend
const userOrders = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const orders = await Order.find({ userId })
    res.status(200).json(new ApiResponse(200, "Orders fetched successfully", orders))
})

//Update order status for admin panel
const updateStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status })
    res.status(200).json(new ApiResponse(200, "Order status updated successfully", order))
})

export { placeOrder, allOrders, userOrders, updateStatus }