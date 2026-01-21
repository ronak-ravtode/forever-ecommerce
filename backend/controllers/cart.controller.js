import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addToCart = asyncHandler(async(req, res) => {
    const {userId,itemId,size} = req.body
    const userData = await User.findById(userId)
    if(!userData){
        throw new ApiError(404,"User not found")
    }
    const cartData = userData.cartData
    if(cartData[itemId]){
        if(cartData[itemId][size]){
            cartData[itemId][size] += 1
        }else{
            cartData[itemId][size] = 1
        }
    }
    else{
        cartData[itemId] = {}
        cartData[itemId][size] = 1
    }
    await User.findByIdAndUpdate(userId,{cartData})

    res.status(200).json(new ApiResponse(200,"Item added to cart successfully",cartData))
})

const updateCart = asyncHandler(async(req, res) => {
    const {userId,itemId,size,quantity} = req.body

    const userData = await User.findById(userId)
    let cartData = userData.cartData
    cartData[itemId][size] = quantity
   await User.findByIdAndUpdate(userId,{cartData})
   res.status(200).json(new ApiResponse(200,"Item updated to cart successfully",cartData))
})

const getCart = asyncHandler(async(req, res) => {
    const {userId} = req.body
    const userData = await User.findById(userId)
    let cartData = userData.cartData
    res.status(200).json(new ApiResponse(200,"Cart fetched successfully",cartData))
})

export {addToCart, updateCart, getCart}